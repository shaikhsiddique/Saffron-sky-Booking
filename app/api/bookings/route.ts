import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { sendBookingNotification } from '@/lib/firebase';
import {
  isTableAllowedForParty,
  RESTAURANT_TABLES,
  GARDEN_TABLES,
} from '@/lib/tables';

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

const IST_OFFSET = '+05:30';

/*
 * IMPORTANT:
 *
 * These booking slots are PM.
 *
 * 7:30 – 8:30  = 7:30 PM – 8:30 PM
 * 8:30 – 9:30  = 8:30 PM – 9:30 PM
 * 9:30 – 10:30 = 9:30 PM – 10:30 PM
 */
const VALID_TIME_SLOTS = [
  '7:30 – 8:30',
  '8:30 – 9:30',
  '9:30 – 10:30',
] as const;

type ValidTimeSlot = (typeof VALID_TIME_SLOTS)[number];

/**
 * Explicit PM times in 24-hour format.
 *
 * This avoids any AM/PM guessing.
 */
const SLOT_TIMES: Record<
  ValidTimeSlot,
  { start: string; end: string }
> = {
  '7:30 – 8:30': {
    start: '19:30',
    end: '20:30',
  },

  '8:30 – 9:30': {
    start: '20:30',
    end: '21:30',
  },

  '9:30 – 10:30': {
    start: '21:30',
    end: '22:30',
  },
};

// ============================================================
// GET /api/bookings
// ============================================================

export async function GET(request: NextRequest) {
  console.log('\n========================================');
  console.log('📥 GET /api/bookings');
  console.log('========================================');

  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get('date');
    const timeSlot = searchParams.get('timeSlot');
    const section = searchParams.get('section');

    console.log('📅 Requested date:', date);
    console.log('⏰ Requested time slot:', timeSlot);
    console.log('🏠 Requested section:', section);

    const db = await getDatabase();

    console.log('✅ MongoDB connection successful');

    const bookingsCollection =
      db.collection<BookingRecord>('bookings');

    const now = new Date();

    console.log(
      '🕐 Current server time:',
      now.toISOString()
    );

    // --------------------------------------------------------
    // DELETE EXPIRED BOOKINGS
    // --------------------------------------------------------

    const deleteResult =
      await bookingsCollection.deleteMany({
        expiresAt: {
          $lte: now,
        },
      });

    console.log('🧹 Expired bookings deleted:', {
      deletedCount: deleteResult.deletedCount,
    });

    // --------------------------------------------------------
    // BUILD QUERY
    // --------------------------------------------------------

    const query: any = {};

    if (date) {
      query.date = date;
    }

    if (timeSlot) {
      query.timeSlot = timeSlot;
    }

    if (section) {
      query.section = section;
    }

    console.log('🔎 MongoDB query:', query);

    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    console.log(
      `📊 Active matching bookings: ${bookings.length}`
    );

    console.log(
      '📋 Booking summary:',
      bookings.map((b) => ({
        id: b.id,
        tableId: b.tableId,
        section: b.section,
        date: b.date,
        timeSlot: b.timeSlot,
        expiresAt: b.expiresAt,
      }))
    );

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error: any) {
    console.error('\n========================================');
    console.error('❌ GET BOOKINGS ERROR');
    console.error('========================================');

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

export async function POST(request: NextRequest) {
  console.log('\n========================================');
  console.log('🚀 POST /api/bookings');
  console.log('========================================');

  try {
    // --------------------------------------------------------
    // 1. READ REQUEST
    // --------------------------------------------------------

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
    // 2. REQUIRED FIELDS
    // --------------------------------------------------------

    if (
      !guestName ||
      !phone ||
      !date ||
      !timeSlot ||
      !tableId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Please fill in all required booking fields.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 3. NAME VALIDATION
    // --------------------------------------------------------

    const cleanName = String(guestName).trim();

    if (
      cleanName.length < 2 ||
      cleanName.length > 50
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid guest name.',
        },
        { status: 400 }
      );
    }

    const nameRegex =
      /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!nameRegex.test(cleanName)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid guest name.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 4. PHONE VALIDATION
    // --------------------------------------------------------

    const cleanPhone = String(phone).replace(
      /\s+/g,
      ''
    );

    const phoneRegex =
      /^(?:\+91|91)?[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Please enter a valid 10-digit Indian mobile number.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 5. GUEST VALIDATION
    // --------------------------------------------------------

    const adultsNumber = Number(adults);
    const childrenNumber = Number(children);

    if (
      !Number.isInteger(adultsNumber) ||
      adultsNumber < 1 ||
      adultsNumber > 8
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Adults must be between 1 and 8.',
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(childrenNumber) ||
      childrenNumber < 0 ||
      childrenNumber > 3
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Children must be between 0 and 3.',
        },
        { status: 400 }
      );
    }

    const guestCount =
      adultsNumber + childrenNumber;

    console.log('👥 Guest count:', guestCount);

    if (
      guestCount < 1 ||
      guestCount > 11
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid guest count.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 6. TIME SLOT VALIDATION
    // --------------------------------------------------------

    const cleanTimeSlot =
      String(timeSlot).trim();

    if (
      !VALID_TIME_SLOTS.includes(
        cleanTimeSlot as ValidTimeSlot
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid reservation time slot.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 7. DATE FORMAT VALIDATION
    // --------------------------------------------------------

    const cleanDate = String(date).trim();

    const dateRegex =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(cleanDate)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid reservation date.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 8. VALIDATE ACTUAL CALENDAR DATE
    // --------------------------------------------------------

    const selectedDate = parseISTDate(
      cleanDate,
      '00:00'
    );

    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid reservation date.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 9. DATE + TIME VALIDATION
    // --------------------------------------------------------

    const now = new Date();

    const todayString =
      getISTDateString(now);

    console.log(
      '📅 Today in India:',
      todayString
    );

    console.log(
      '📅 Requested date:',
      cleanDate
    );

    // Cannot book previous dates.
    if (cleanDate < todayString) {
      return NextResponse.json(
        {
          success: false,
          error:
            'You cannot book a date in the past.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 10. CALCULATE PM RESERVATION TIMES
    // --------------------------------------------------------

    const reservationStart =
      getReservationStart(
        cleanDate,
        cleanTimeSlot as ValidTimeSlot
      );

    const reservationEnd =
      getReservationEnd(
        cleanDate,
        cleanTimeSlot as ValidTimeSlot
      );

    console.log(
      '▶️ Reservation starts:',
      reservationStart.toISOString()
    );

    console.log(
      '⏹️ Reservation ends:',
      reservationEnd.toISOString()
    );

    /*
     * Example:
     *
     * 7:30 – 8:30
     *
     * Start:
     * 7:30 PM IST
     * = 14:00 UTC
     *
     * End:
     * 8:30 PM IST
     * = 15:00 UTC
     *
     * Therefore expiresAt is 8:30 PM IST.
     */

    if (
      reservationEnd <=
      reservationStart
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid reservation time slot.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 11. PREVENT PAST / CURRENT SLOT BOOKING
    // --------------------------------------------------------

    if (reservationStart <= now) {
      console.error(
        '❌ RESERVATION SLOT HAS ALREADY STARTED'
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `The ${cleanTimeSlot} slot has already started or passed. Please choose a future time slot.`,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 12. SECTION
    // --------------------------------------------------------

    const selectedSection =
      section === 'garden'
        ? 'garden'
        : 'restaurant';

    const tables =
      selectedSection === 'garden'
        ? GARDEN_TABLES
        : RESTAURANT_TABLES;

    // --------------------------------------------------------
    // 13. FIND TABLE
    // --------------------------------------------------------

    const targetTable =
      tables.find(
        (table) =>
          table.id === String(tableId)
      );

    console.log(
      '🪑 Requested table:',
      tableId
    );

    console.log(
      '🏠 Section:',
      selectedSection
    );

    if (!targetTable) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Table ${tableId} not found.`,
        },
        { status: 404 }
      );
    }

    console.log(
      '✅ Table found:',
      {
        id: targetTable.id,
        capacity:
          targetTable.capacity,
      }
    );

    // --------------------------------------------------------
    // 14. TABLE CAPACITY
    // --------------------------------------------------------

    const tableAllowed =
      isTableAllowedForParty(
        targetTable.capacity,
        guestCount
      );

    console.log(
      '🔍 Capacity allowed:',
      tableAllowed
    );

    if (!tableAllowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Table ${tableId} does not match a party of ${guestCount}.`,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // 15. DATABASE
    // --------------------------------------------------------

    const db =
      await getDatabase();

    console.log(
      '✅ MongoDB connected'
    );

    const bookingsCollection =
      db.collection<BookingRecord>(
        'bookings'
      );

    // --------------------------------------------------------
    // 16. DELETE EXPIRED BOOKINGS
    // --------------------------------------------------------

    const deleteResult =
      await bookingsCollection.deleteMany(
        {
          expiresAt: {
            $lte: now,
          },
        }
      );

    console.log(
      '🧹 Expired bookings removed before conflict check:',
      deleteResult.deletedCount
    );

    // --------------------------------------------------------
    // 17. CHECK EXACT TABLE CONFLICT
    // --------------------------------------------------------

    console.log(
      '🔎 Checking exact booking conflict...'
    );

    const existingBooking =
      await bookingsCollection.findOne(
        {
          tableId:
            String(tableId),

          date:
            cleanDate,

          timeSlot:
            cleanTimeSlot,

          section:
            selectedSection,

          expiresAt: {
            $gt: now,
          },
        }
      );

    if (existingBooking) {
      console.error(
        '❌ TABLE ALREADY BOOKED FOR THIS SLOT'
      );

      console.error({
        tableId:
          existingBooking.tableId,

        date:
          existingBooking.date,

        timeSlot:
          existingBooking.timeSlot,

        section:
          existingBooking.section,

        bookingId:
          existingBooking.id,

        expiresAt:
          existingBooking.expiresAt,
      });

      return NextResponse.json(
        {
          success: false,
          error:
            `Table ${tableId} is already booked for ${cleanTimeSlot} on ${cleanDate}.`,
        },
        { status: 409 }
      );
    }

    console.log(
      '✅ No conflict found'
    );

    // --------------------------------------------------------
    // 18. CREATE BOOKING
    // --------------------------------------------------------

    const booking: BookingRecord = {
      id:
        `BK-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,

      guestName:
        cleanName,

      phone:
        cleanPhone,

      guestCount,

      date:
        cleanDate,

      timeSlot:
        cleanTimeSlot,

      tableId:
        String(tableId),

      section:
        selectedSection,

      createdAt:
        now,

      expiresAt:
        reservationEnd,
    };

    console.log(
      '📝 Booking created:',
      {
        ...booking,

        createdAt:
          booking.createdAt.toISOString(),

        expiresAt:
          booking.expiresAt.toISOString(),
      }
    );

    // --------------------------------------------------------
    // 19. SAVE
    // --------------------------------------------------------

    const insertResult =
      await bookingsCollection.insertOne(
        booking
      );

    console.log(
      '💾 MongoDB insert:',
      {
        acknowledged:
          insertResult.acknowledged,

        insertedId:
          insertResult.insertedId,
      }
    );

    if (
      !insertResult.acknowledged
    ) {
      throw new Error(
        'MongoDB did not acknowledge booking insertion.'
      );
    }

    // --------------------------------------------------------
    // 20. VERIFY
    // --------------------------------------------------------

    const savedBooking =
      await bookingsCollection.findOne(
        {
          _id:
            insertResult.insertedId,
        }
      );

    if (!savedBooking) {
      throw new Error(
        'Booking inserted but could not be verified.'
      );
    }

    console.log(
      '✅ BOOKING VERIFIED IN DATABASE'
    );

    // --------------------------------------------------------
    // 21. FCM
    // --------------------------------------------------------

    let notificationStatus =
      'skipped';

    try {
      if (
        process.env.FIREBASE_PROJECT_ID
      ) {
        console.log(
          '📲 Sending FCM notification...'
        );

        await sendBookingNotification(
          booking.guestName,
          booking.tableId,
          booking.timeSlot,
          booking.guestCount
        );

        notificationStatus =
          'sent';

        console.log(
          '✅ FCM notification sent'
        );
      }
    } catch (fcmError) {
      console.warn(
        '⚠️ FCM notification failed:',
        fcmError
      );

      notificationStatus =
        'fcm_failed';
    }

    // --------------------------------------------------------
    // 22. SUCCESS
    // --------------------------------------------------------

    console.log(
      '\n========================================'
    );

    console.log(
      '🎉 BOOKING CREATED SUCCESSFULLY'
    );

    console.log(
      '========================================'
    );

    console.log({
      bookingId:
        booking.id,

      tableId:
        booking.tableId,

      section:
        booking.section,

      date:
        booking.date,

      timeSlot:
        booking.timeSlot,

      expiresAt:
        booking.expiresAt.toISOString(),
    });

    return NextResponse.json({
      success: true,

      booking: {
        ...booking,

        createdAt:
          booking.createdAt.toISOString(),

        expiresAt:
          booking.expiresAt.toISOString(),
      },

      notificationStatus,

      message:
        `Table ${tableId} reserved for ${cleanName} on ${cleanDate} at ${cleanTimeSlot}.`,
    });
  } catch (error: any) {
    console.error(
      '\n========================================'
    );

    console.error(
      '🔥 BOOKING API ERROR'
    );

    console.error(
      '========================================'
    );

    console.error(
      'Error:',
      error
    );

    console.error(
      'Message:',
      error?.message
    );

    console.error(
      'Stack:',
      error?.stack
    );

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

// ============================================================
// RESERVATION START
// ============================================================

function getReservationStart(
  date: string,
  timeSlot: ValidTimeSlot
): Date {
  const slot =
    SLOT_TIMES[timeSlot];

  return parseISTDate(
    date,
    slot.start
  );
}

// ============================================================
// RESERVATION END
// ============================================================

function getReservationEnd(
  date: string,
  timeSlot: ValidTimeSlot
): Date {
  const slot =
    SLOT_TIMES[timeSlot];

  return parseISTDate(
    date,
    slot.end
  );
}

// ============================================================
// PARSE IST DATE
// ============================================================

function parseISTDate(
  date: string,
  time: string
): Date {
  const result =
    new Date(
      `${date}T${time}:00${IST_OFFSET}`
    );

  if (
    Number.isNaN(
      result.getTime()
    )
  ) {
    throw new Error(
      `Invalid IST date/time: ${date} ${time}`
    );
  }

  return result;
}

// ============================================================
// GET TODAY IN INDIA
// ============================================================

function getISTDateString(
  date: Date
): string {
  const formatter =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone:
          'Asia/Kolkata',

        year:
          'numeric',

        month:
          '2-digit',

        day:
          '2-digit',
      }
    );

  return formatter.format(date);
}