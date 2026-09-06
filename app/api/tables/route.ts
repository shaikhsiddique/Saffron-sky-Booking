
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

    const bookingsCollection =
      db.collection('bookings');

    const now = new Date();

    const deleteResult =
      await bookingsCollection.deleteMany({
        expiresAt: { $lte: now },
      });

    const bookings =
      await bookingsCollection
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
