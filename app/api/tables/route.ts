
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import {
  RESTAURANT_TABLES,
  GARDEN_TABLES,
} from '@/lib/tables';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get('date');
    const timeSlot = searchParams.get('timeSlot');
    const section =
      searchParams.get('section') === 'garden'
        ? 'garden'
        : 'restaurant';

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Date is required.',
        },
        { status: 400 }
      );
    }

    if (!timeSlot) {
      return NextResponse.json(
        {
          success: false,
          error: 'Time slot is required.',
        },
        { status: 400 }
      );
    }

    const tables =
      section === 'garden'
        ? GARDEN_TABLES
        : RESTAURANT_TABLES;

    const db = await getDatabase();

    // Check if bookings are disabled or this date is blocked
    const settingsCollection = db.collection<any>('settings');
    const settings = await settingsCollection.findOne({ _id: 'booking_settings' });
    const isMasterDisabled = settings?.isBookingEnabled === false;
    const isSectionDisabled = section === 'restaurant'
      ? (settings?.isRestaurantEnabled === false)
      : (settings?.isGardenEnabled === false);
    const isDateBlocked = Array.isArray(settings?.blockedDates) && settings.blockedDates.includes(date);
    const isBookingBlocked = isMasterDisabled || isSectionDisabled || isDateBlocked;

    let blockReason = '';
    if (isMasterDisabled) {
      blockReason = settings?.reason || 'Online bookings are currently paused by management.';
    } else if (isSectionDisabled) {
      const sectionMsg = section === 'restaurant'
        ? (settings?.restaurantMessage || 'Restaurant dine-in bookings are currently closed.')
        : (settings?.gardenMessage || 'Garden dine-in bookings are currently closed.');
      blockReason = sectionMsg;
    } else if (isDateBlocked) {
      blockReason = `Reservations are closed for ${date}.`;
    }

    const bookingsCollection =
      db.collection('bookings');

    const now = new Date();

    const deleteResult =
      await bookingsCollection.deleteMany({
        expiresAt: { $lte: now },
      });

    const bookings = isBookingBlocked
      ? []
      : await bookingsCollection
          .find({
            date,
            timeSlot,
            section,
            expiresAt: { $gt: now },
          })
          .toArray();

    const bookedTableIds = bookings.map(
      (booking: any) => booking.tableId
    );

    const tablesWithAvailability =
      tables.map((table) => {
        if (isBookingBlocked) {
          return {
            ...table,
            isAvailable: false,
            bookedUntil: null,
            bookingId: null,
          };
        }

        const matchingBooking =
          bookings.find(
            (booking: any) =>
              booking.tableId === table.id
          );

        const isAvailable =
          !matchingBooking;

        return {
          ...table,
          isAvailable,
          bookedUntil:
            matchingBooking?.timeSlot ||
            null,
          bookingId:
            matchingBooking?.id ||
            null,
        };
      });

    const bookedCount =
      tablesWithAvailability.filter(
        (table) => !table.isAvailable
      ).length;

    const availableCount =
      tablesWithAvailability.length -
      bookedCount;

    return NextResponse.json({
      success: true,
      date,
      timeSlot,
      section,
      isBookingBlocked,
      blockReason,
      tables: tablesWithAvailability,
      totalTables: tables.length,
      bookedCount,
      availableCount,
      expiredBookingsDeleted:
        deleteResult.deletedCount,
    });

  } catch (error: any) {
    console.error('Table availability error:', error?.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch table availability.',
      },
      { status: 500 }
    );
  }
}
