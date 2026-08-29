import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import {
  RESTAURANT_TABLES,
  GARDEN_TABLES,
} from '@/lib/tables';

export async function GET(request: NextRequest) {
  console.log('\n========================================');
  console.log('🪑 GET /api/tables');
  console.log('========================================');

  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get('date');
    const timeSlot = searchParams.get('timeSlot');
    const section =
      searchParams.get('section') === 'garden'
        ? 'garden'
        : 'restaurant';

    console.log('📅 Date:', date);
    console.log('⏰ Time slot:', timeSlot);
    console.log('🏠 Section:', section);

    if (!date) {
      console.error('❌ No date supplied');

      return NextResponse.json(
        {
          success: false,
          error: 'Date is required.',
        },
        { status: 400 }
      );
    }

    if (!timeSlot) {
      console.error('❌ No time slot supplied');

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

    console.log(
      `🪑 Checking ${tables.length} ${section} tables`
    );

    const db = await getDatabase();

    console.log('✅ MongoDB connection successful');
    console.log('🗄️ Database:', db.databaseName);

    const bookingsCollection =
      db.collection('bookings');

    console.log(
      '📂 Collection:',
      bookingsCollection.collectionName
    );

    const now = new Date();

    console.log(
      '⏰ Current server time:',
      now.toISOString()
    );

    console.log('🧹 Checking for expired bookings...');

    const deleteResult =
      await bookingsCollection.deleteMany({
        expiresAt: { $lte: now },
      });

    console.log('🧹 Expired booking cleanup:', {
      acknowledged: deleteResult.acknowledged,
      deletedCount: deleteResult.deletedCount,
    });

    console.log(
      '🔎 Checking bookings for EXACT:',
      {
        date,
        timeSlot,
        section,
      }
    );

    const bookings =
      await bookingsCollection
        .find({
          date,
          timeSlot,
          section,
          expiresAt: { $gt: now },
        })
        .toArray();

    console.log(
      `📊 Matching active bookings found: ${bookings.length}`
    );

    if (bookings.length > 0) {
      console.log(
        '📋 Matching bookings:',
        bookings.map((booking: any) => ({
          id: booking.id,
          tableId: booking.tableId,
          date: booking.date,
          timeSlot: booking.timeSlot,
          section: booking.section,
          expiresAt: booking.expiresAt,
        }))
      );
    }

    const bookedTableIds = bookings.map(
      (booking: any) => booking.tableId
    );

    console.log(
      '🔴 BOOKED TABLE IDS:',
      bookedTableIds
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

        console.log(
          `🪑 ${table.id}: ${isAvailable
            ? '🟢 AVAILABLE'
            : '🔴 BOOKED'
          }`
        );

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

    console.log('\n📤 AVAILABILITY RESPONSE');

    console.log({
      date,
      timeSlot,
      section,
      totalTables: tables.length,
      bookedCount,
      availableCount,
      expiredBookingsDeleted:
        deleteResult.deletedCount,
    });

    console.log(
      '========================================'
    );
    console.log(
      '✅ GET /api/tables COMPLETE'
    );
    console.log(
      '========================================\n'
    );

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
    console.error('\n========================================');
    console.error('🔥 TABLE AVAILABILITY ERROR');
    console.error('========================================');

    console.error('Error:', error);
    console.error('Message:', error?.message);
    console.error('Stack:', error?.stack);

    console.error(
      '========================================\n'
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch table availability.',
      },
      { status: 500 }
    );
  }
}