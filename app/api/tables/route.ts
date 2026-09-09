
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
    const nowForIST = new Date();
    const todayIST = getISTDateString(nowForIST);
    const currentISTHour = getISTHour(nowForIST);
    const isSameDayClosed = date === todayIST && currentISTHour >= 19;

    const isBookingBlocked = isMasterDisabled || isSectionDisabled || isDateBlocked || isSameDayClosed;

    let blockReason = '';
    if (isMasterDisabled) {
      blockReason = settings?.reason || 'Online bookings are currently paused by management.';
    } else if (isSectionDisabled) {
      const sectionMsg = section === 'restaurant'
        ? (settings?.restaurantMessage || 'Fine Dine In bookings are currently closed.')
        : (settings?.gardenMessage || 'Garden dine-in bookings are currently closed.');
      blockReason = sectionMsg;
    } else if (isDateBlocked) {
      blockReason = `Reservations are closed for ${date}.`;
    } else if (isSameDayClosed) {
      blockReason = 'Same-day reservations for today close at 7:00 PM. Please select a future date.';
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

    const bookedTableIds: string[] = [];
    bookings.forEach((booking: any) => {
      if (Array.isArray(booking.tableIds)) {
        bookedTableIds.push(...booking.tableIds.map(String));
      }
      if (typeof booking.tableId === 'string') {
        const ids = booking.tableId
          .split(/[,+]/)
          .map((s: string) => s.trim())
          .filter(Boolean);
        bookedTableIds.push(...ids);
      }
    });

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
            (booking: any) => {
              if (booking.tableId === table.id) return true;
              if (Array.isArray(booking.tableIds) && booking.tableIds.includes(table.id)) return true;
              if (typeof booking.tableId === 'string') {
                const parts = booking.tableId.split(/[,+]/).map((s: string) => s.trim());
                return parts.includes(table.id);
              }
              return false;
            }
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

function getISTDateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

function getISTHour(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date);
  const hourPart = parts.find((p) => p.type === 'hour');
  return hourPart ? parseInt(hourPart.value, 10) : date.getHours();
}
