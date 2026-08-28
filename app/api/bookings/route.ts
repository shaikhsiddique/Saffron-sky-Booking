
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { sendBookingNotification } from '@/lib/firebase';
import {
  isTableAllowedForParty,
  RESTAURANT_TABLES,
  GARDEN_TABLES,
} from '@/lib/tables';

// ============================================================
// DATABASE BOOKING TYPE
// ============================================================

interface BookingRecord {
  id: string;
  guestName: string;
  phone: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  tableId: string;
  section: string;
  createdAt: Date;
  expiresAt: Date;
}

// ============================================================
// TTL
// ============================================================

const BOOKING_TTL_MS = 60 * 60 * 1000;

// ============================================================
// GET /api/bookings
// ============================================================

export async function GET() {
  console.log('\n========================================');
  console.log('📥 GET /api/bookings');
  console.log('========================================');

  try {
    console.log('🔌 Connecting to MongoDB...');

    const db = await getDatabase();

    console.log('✅ MongoDB connection successful');

    const bookingsCollection =
      db.collection<BookingRecord>('bookings');

    console.log('📂 Collection:', bookingsCollection.collectionName);

    const now = new Date();

    console.log(
      '⏰ Checking bookings active after:',
      now.toISOString()
    );

    const bookings = await bookingsCollection
      .find({
        expiresAt: { $gt: now },
      })
      .toArray();

    console.log(`📊 Active bookings: ${bookings.length}`);

    console.log(
      '📋 Active booking IDs:',
      bookings.map((b) => b.id)
    );

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error: any) {
    console.error('\n❌ GET BOOKINGS ERROR');
    console.error('Error:', error);
    console.error('Message:', error?.message);
    console.error('Stack:', error?.stack);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/bookings
// ============================================================

export async function POST(request: Request) {
  console.log('\n========================================');
  console.log('🚀 POST /api/bookings');
  console.log('========================================');

  try {
    // --------------------------------------------------------
    // 1. READ REQUEST
    // --------------------------------------------------------

    console.log('📥 Reading request body...');

    const body = await request.json();

    console.log('📦 Request body:', body);

    const {
      guestName,
      phone,
      adults,
      children,
      date,
      timeSlot,
      tableId,
      section,
    } = body;

    // --------------------------------------------------------
    // 2. VALIDATION
    // --------------------------------------------------------

    console.log('🔍 Validating required fields...');

    if (
      !guestName ||
      !phone ||
      !date ||
      !timeSlot ||
      !tableId
    ) {
      console.error('❌ Required field validation failed');

      return NextResponse.json(
        {
          success: false,
          error: 'Please fill in all required booking fields.',
        },
        { status: 400 }
      );
    }

    console.log('✅ Required fields valid');

    // --------------------------------------------------------
    // 3. CALCULATE GUEST COUNT
    // --------------------------------------------------------

    const guestCount =
      (Number(adults) || 1) +
      (Number(children) || 0);

    console.log('👥 Guest count:', guestCount);
    console.log('   Adults:', adults);
    console.log('   Children:', children);

    if (guestCount < 1 || guestCount > 20) {
      console.error(
        '❌ Invalid guest count:',
        guestCount
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid guest count.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 4. FIND TABLE
    // --------------------------------------------------------

    const selectedSection =
      section === 'garden'
        ? 'garden'
        : 'restaurant';

    const tables =
      selectedSection === 'garden'
        ? GARDEN_TABLES
        : RESTAURANT_TABLES;

    console.log('🏠 Section:', selectedSection);
    console.log('🪑 Looking for table:', tableId);

    const targetTable = tables.find(
      (t) => t.id === tableId
    );

    if (!targetTable) {
      console.error(
        '❌ Table not found:',
        tableId
      );

      return NextResponse.json(
        {
          success: false,
          error: `Table ${tableId} not found on the floor plan.`,
        },
        { status: 404 }
      );
    }

    console.log('✅ Table found:', {
      id: targetTable.id,
      capacity: targetTable.capacity,
    });

    // --------------------------------------------------------
    // 5. CHECK TABLE CAPACITY
    // --------------------------------------------------------

    console.log('🔍 Checking table capacity...');

    const tableAllowed = isTableAllowedForParty(
      targetTable.capacity,
      guestCount
    );

    console.log('Capacity allowed:', tableAllowed);

    if (!tableAllowed) {
      console.error(
        `❌ Table ${tableId} cannot accommodate ${guestCount} guests`
      );

      return NextResponse.json(
        {
          success: false,
          error: `Table ${tableId} (${targetTable.capacity}-seater) doesn't match a party of ${guestCount}. Choose a table that fits your party size tier.`,
        },
        { status: 400 }
      );
    }

    console.log('✅ Capacity check passed');

    // --------------------------------------------------------
    // 6. CONNECT TO MONGODB
    // --------------------------------------------------------

    console.log('🔌 Connecting to MongoDB...');

    const db = await getDatabase();

    console.log('✅ MongoDB connection successful');

    console.log('🗄️ Database name:', db.databaseName);

    const bookingsCollection =
      db.collection<BookingRecord>('bookings');

    console.log(
      '📂 Collection:',
      bookingsCollection.collectionName
    );

    // --------------------------------------------------------
    // 7. CHECK EXISTING BOOKING
    // --------------------------------------------------------

    console.log('🔎 Checking for existing booking...');

    console.log({
      tableId,
      date,
      timeSlot,
    });

    const existingBooking =
      await bookingsCollection.findOne({
        tableId,
        date,
        timeSlot,
        expiresAt: {
          $gt: new Date(),
        },
      });

    if (existingBooking) {
      console.error('❌ DOUBLE BOOKING DETECTED');

      console.error({
        existingBookingId: existingBooking.id,
        tableId: existingBooking.tableId,
        date: existingBooking.date,
        timeSlot: existingBooking.timeSlot,
      });

      return NextResponse.json(
        {
          success: false,
          error: `Table ${tableId} is already booked for ${timeSlot} on ${date}. Please pick a different table or time slot.`,
        },
        { status: 409 }
      );
    }

    console.log('✅ No conflicting booking found');

    // --------------------------------------------------------
    // 8. CREATE BOOKING
    // --------------------------------------------------------

    console.log('📝 Creating booking...');

    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + BOOKING_TTL_MS
    );

    const booking: BookingRecord = {
      id: `BK-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`,

      guestName: String(guestName).trim(),

      phone: String(phone).trim(),

      guestCount,

      date: String(date),

      timeSlot: String(timeSlot),

      tableId: String(tableId),

      section: selectedSection,

      createdAt: now,

      expiresAt,
    };

    console.log('📦 Booking object:');
    console.log(booking);

    // --------------------------------------------------------
    // 9. SAVE TO MONGODB
    // --------------------------------------------------------

    console.log('\n💾 ================================');
    console.log('💾 INSERTING BOOKING INTO MONGODB');
    console.log('💾 ================================');

    const insertResult =
      await bookingsCollection.insertOne(booking);

    console.log('📌 MongoDB insert result:');
    console.log({
      acknowledged: insertResult.acknowledged,
      insertedId: insertResult.insertedId,
    });

    if (!insertResult.acknowledged) {
      console.error(
        '❌ MongoDB did NOT acknowledge the insert'
      );

      throw new Error(
        'MongoDB did not acknowledge booking insertion'
      );
    }

    console.log('✅ BOOKING SAVED TO MONGODB');

    // --------------------------------------------------------
    // 10. VERIFY DATABASE RECORD
    // --------------------------------------------------------

    console.log('🔍 Verifying saved booking...');

    const savedBooking =
      await bookingsCollection.findOne({
        _id: insertResult.insertedId,
      });

    if (!savedBooking) {
      console.error(
        '❌ CRITICAL: Insert succeeded but booking cannot be found'
      );

      throw new Error(
        'Booking was inserted but could not be verified'
      );
    }

    console.log('✅ BOOKING VERIFIED IN DATABASE');

    console.log('📄 Saved booking:', savedBooking);

    // --------------------------------------------------------
    // 11. FCM NOTIFICATION
    // --------------------------------------------------------

    let notificationStatus = 'skipped';

    console.log('📲 Sending FCM notification...');

    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        await sendBookingNotification(
          booking.guestName,
          booking.tableId,
          booking.timeSlot,
          booking.guestCount
        );

        notificationStatus = 'sent';

        console.log('✅ FCM notification sent');
      } else {
        console.log(
          'ℹ️ FIREBASE_PROJECT_ID not configured'
        );
      }
    } catch (fcmError) {
      console.warn(
        '⚠️ FCM notification failed:',
        fcmError
      );

      notificationStatus = 'fcm_not_configured';
    }

    // --------------------------------------------------------
    // 12. SUCCESS
    // --------------------------------------------------------

    console.log('\n========================================');
    console.log('🎉 BOOKING CREATED SUCCESSFULLY');
    console.log('========================================');

    console.log({
      bookingId: booking.id,
      mongoId: insertResult.insertedId,
      guestName: booking.guestName,
      tableId: booking.tableId,
      date: booking.date,
      timeSlot: booking.timeSlot,
      guestCount: booking.guestCount,
      expiresAt: booking.expiresAt,
    });

    console.log('========================================\n');

    return NextResponse.json({
      success: true,

      booking: {
        ...booking,

        // Return dates as ISO strings
        createdAt: booking.createdAt.toISOString(),
        expiresAt: booking.expiresAt.toISOString(),
      },

      notificationStatus,

      message: `Table ${tableId} reserved for ${guestName} (${guestCount} guests) on ${date} at ${timeSlot}.`,
    });

  } catch (error: any) {
    // --------------------------------------------------------
    // GLOBAL ERROR
    // --------------------------------------------------------

    console.error('\n========================================');
    console.error('🔥 BOOKING API ERROR');
    console.error('========================================');

    console.error('Error:', error);
    console.error('Message:', error?.message);
    console.error('Name:', error?.name);
    console.error('Stack:', error?.stack);

    console.error('========================================\n');

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Internal server error.',
      },
      { status: 500 }
    );
  }
}

