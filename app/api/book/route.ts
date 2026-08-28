
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { sendBookingNotification } from '@/lib/firebase';
import {
  RESTAURANT_TABLES,
  getAvailableTables,
  assignBestTable,
  Booking,
} from '@/lib/tables';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  console.log('\n========================================');
  console.log('🚀 BOOKING API CALLED');
  console.log('========================================');

  try {
    // --------------------------------------------------
    // 1. READ REQUEST
    // --------------------------------------------------
    console.log('📥 Reading request body...');

    const body = await request.json();

    console.log('📦 Request body received:', body);

    const {
      guestName,
      phone,
      date,
      time,
      guestCount,
    } = body;

    // --------------------------------------------------
    // 2. VALIDATION
    // --------------------------------------------------
    console.log('🔍 Validating booking data...');

    if (!guestName || !phone || !date || !time || !guestCount) {
      console.error('❌ VALIDATION FAILED');
      console.error({
        guestName,
        phone,
        date,
        time,
        guestCount,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    if (guestCount < 1 || guestCount > 10) {
      console.error('❌ INVALID GUEST COUNT:', guestCount);

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid guest count (1-10)',
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // --------------------------------------------------
    // 3. CONNECT TO MONGODB
    // --------------------------------------------------
    console.log('🔌 Connecting to MongoDB...');

    const db = await getDatabase();

    console.log('✅ MongoDB connection successful');

    // --------------------------------------------------
    // 4. GET COLLECTION
    // --------------------------------------------------
    console.log('📂 Getting bookings collection...');

    const bookingsCollection = db.collection('bookings');

    console.log('✅ Collection reference created');
    console.log('📂 Collection name:', bookingsCollection.collectionName);

    // --------------------------------------------------
    // 5. CHECK EXISTING BOOKINGS
    // --------------------------------------------------
    console.log('🔎 Checking existing active bookings...');

    const nowForCheck = new Date();

    console.log('⏰ Current server time:', nowForCheck.toISOString());

    const activeBookings = await bookingsCollection
      .find({
        expiresAt: { $gt: nowForCheck },
      })
      .toArray();

    console.log(
      `📊 Active bookings found: ${activeBookings.length}`
    );

    if (activeBookings.length > 0) {
      console.log(
        '📋 Existing active bookings:',
        activeBookings.map((b: any) => ({
          id: b.id,
          guestName: b.guestName,
          tableId: b.tableId,
          date: b.date,
          time: b.time,
          expiresAt: b.expiresAt,
        }))
      );
    }

    const bookedTableIds = activeBookings.map(
      (b: any) => b.tableId
    );

    console.log('🪑 Currently booked tables:', bookedTableIds);

    // --------------------------------------------------
    // 6. FIND AVAILABLE TABLES
    // --------------------------------------------------
    console.log('🪑 Finding available tables...');

    const availableTables = getAvailableTables(
      RESTAURANT_TABLES,
      guestCount,
      bookedTableIds
    );

    console.log(
      '✅ Available tables:',
      availableTables.map((t) => ({
        id: t.id,
        capacity: t.capacity,
      }))
    );

    if (availableTables.length === 0) {
      console.error(
        '❌ No tables available for guest count:',
        guestCount
      );

      return NextResponse.json(
        {
          success: false,
          error: 'No tables available for this party size',
          availableAlternatives: [],
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // 7. ASSIGN TABLE
    // --------------------------------------------------
    console.log('🎯 Assigning best table...');

    const assignedTable = assignBestTable(
      availableTables,
      guestCount
    );

    if (!assignedTable) {
      console.error('❌ Table assignment failed');

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to assign table',
        },
        { status: 500 }
      );
    }

    console.log('✅ Table assigned:', {
      id: assignedTable.id,
      capacity: assignedTable.capacity,
    });

    // --------------------------------------------------
    // 8. CREATE BOOKING
    // --------------------------------------------------
    console.log('📝 Creating booking object...');

    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + 60 * 60 * 1000
    );

    const booking: Booking = {
      id: uuidv4(),
      guestName,
      phone,
      date,
      time,
      guestCount,
      tableId: assignedTable.id,
      tableCapacity: assignedTable.capacity,
      status: 'confirmed',
      createdAt: now,
      expiresAt,
    };

    console.log('📦 Booking object created:');
    console.log({
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      expiresAt: booking.expiresAt.toISOString(),
    });

    // --------------------------------------------------
    // 9. INSERT INTO MONGODB
    // --------------------------------------------------
    console.log('💾 INSERTING BOOKING INTO MONGODB...');

    const insertResult = await bookingsCollection.insertOne(
      booking
    );

    console.log('✅ MONGODB INSERT COMPLETED');

    console.log('📌 Insert result:', {
      acknowledged: insertResult.acknowledged,
      insertedId: insertResult.insertedId,
    });

    // --------------------------------------------------
    // 10. VERIFY INSERT
    // --------------------------------------------------
    console.log('🔍 VERIFYING INSERT...');

    const savedBooking = await bookingsCollection.findOne({
      _id: insertResult.insertedId,
    });

    if (savedBooking) {
      console.log('✅ BOOKING VERIFIED IN MONGODB');

      console.log('📄 Saved document:', savedBooking);
    } else {
      console.error(
        '❌ WARNING: INSERT REPORTED SUCCESS BUT DOCUMENT NOT FOUND'
      );
    }

    // --------------------------------------------------
    // 11. SEND NOTIFICATION
    // --------------------------------------------------
    console.log('📲 Sending FCM notification...');

    try {
      await sendBookingNotification(
        guestName,
        assignedTable.id,
        time,
        guestCount
      );

      console.log('✅ FCM notification sent');
    } catch (fcmError) {
      console.error(
        '⚠️ FCM notification failed:',
        fcmError
      );

      // FCM failure should NOT cancel the booking
    }

    // --------------------------------------------------
    // 12. AUTO DELETE
    // --------------------------------------------------
    console.log(
      '⏳ Auto-delete scheduled for:',
      expiresAt.toISOString()
    );

    setTimeout(async () => {
      try {
        console.log(
          '🧹 Attempting to auto-delete booking:',
          booking.id
        );

        const deleteResult =
          await bookingsCollection.deleteOne({
            id: booking.id,
          });

        console.log('🧹 Auto-delete result:', {
          acknowledged: deleteResult.acknowledged,
          deletedCount: deleteResult.deletedCount,
        });
      } catch (err) {
        console.error(
          '❌ Auto-delete failed:',
          err
        );
      }
    }, 60 * 60 * 1000);

    // --------------------------------------------------
    // 13. SUCCESS RESPONSE
    // --------------------------------------------------
    console.log('🎉 BOOKING SUCCESS');
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        tableId: assignedTable.id,
        tableName: `Table ${assignedTable.id}`,
        tableCapacity: assignedTable.capacity,
        guestName,
        guestCount,
        date,
        time,
        status: 'confirmed',
        message: `Booking confirmed! You're assigned to ${assignedTable.id}`,
      },
    });

  } catch (error) {
    // --------------------------------------------------
    // GLOBAL ERROR
    // --------------------------------------------------
    console.error('\n========================================');
    console.error('🔥 BOOKING API FAILED');
    console.error('========================================');

    console.error('Error:', error);

    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    console.error('========================================\n');

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}

