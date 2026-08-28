import { NextResponse } from 'next/server';
import { sendBookingNotification } from '@/lib/firebase';
import { isTableAllowedForParty, RESTAURANT_TABLES, GARDEN_TABLES } from '@/lib/tables';

interface BookingRecord {
  id: string;
  guestName: string;
  phone: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  tableId: string;
  section: string;
  createdAt: string;
  /** Millisecond timestamp when this booking expires (1h after creation) */
  expiresAtMs: number;
}

// In-memory booking store (resets on cold start / redeploy on Vercel)
const IN_MEMORY_BOOKINGS: BookingRecord[] = [];

/** TTL = 1 hour in milliseconds */
const BOOKING_TTL_MS = 60 * 60 * 1000;

/**
 * Purge any bookings older than 1 hour from creation.
 * Called before every GET and POST to keep the store clean.
 */
function cleanupExpiredBookings() {
  const now = Date.now();
  for (let i = IN_MEMORY_BOOKINGS.length - 1; i >= 0; i--) {
    if (IN_MEMORY_BOOKINGS[i].expiresAtMs <= now) {
      console.log(
        `🧹 Auto-freed Table ${IN_MEMORY_BOOKINGS[i].tableId} – reservation expired (${IN_MEMORY_BOOKINGS[i].guestName}, ${IN_MEMORY_BOOKINGS[i].date} ${IN_MEMORY_BOOKINGS[i].timeSlot})`
      );
      IN_MEMORY_BOOKINGS.splice(i, 1);
    }
  }
}

/**
 * GET /api/bookings
 * Returns all active (non-expired) bookings.
 */
export async function GET() {
  cleanupExpiredBookings();
  return NextResponse.json({
    success: true,
    bookings: IN_MEMORY_BOOKINGS,
    count: IN_MEMORY_BOOKINGS.length,
  });
}

/**
 * POST /api/bookings
 * Creates a new reservation. Validates capacity slots, prevents double-booking,
 * and dispatches an FCM push notification if Firebase is configured.
 * Booking auto-deletes 1 hour after creation.
 */
export async function POST(request: Request) {
  try {
    cleanupExpiredBookings();

    const body = await request.json();
    const { guestName, phone, adults, children, date, timeSlot, tableId, section } = body;

    // ── Required field validation ──
    if (!guestName || !phone || !date || !timeSlot || !tableId) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required booking fields.' },
        { status: 400 }
      );
    }

    const guestCount = (Number(adults) || 1) + (Number(children) || 0);
    const tables = section === 'garden' ? GARDEN_TABLES : RESTAURANT_TABLES;
    const targetTable = tables.find((t) => t.id === tableId);

    if (!targetTable) {
      return NextResponse.json(
        { success: false, error: `Table ${tableId} not found on the floor plan.` },
        { status: 404 }
      );
    }

    // ── Capacity Slot Enforcer ──
    if (!isTableAllowedForParty(targetTable.capacity, guestCount)) {
      return NextResponse.json(
        {
          success: false,
          error: `Table ${tableId} (${targetTable.capacity}-seater) doesn't match a party of ${guestCount}. Choose a table that fits your party size tier.`,
        },
        { status: 400 }
      );
    }

    // ── Double-booking conflict check ──
    const conflict = IN_MEMORY_BOOKINGS.find(
      (b) => b.tableId === tableId && b.date === date && b.timeSlot === timeSlot
    );

    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          error: `Table ${tableId} is already booked for ${timeSlot} on ${date}. Please pick a different table or time slot.`,
        },
        { status: 409 }
      );
    }

    // ── Create booking record with 1-hour TTL ──
    const now = Date.now();
    const newBooking: BookingRecord = {
      id: `BK-${now}`,
      guestName,
      phone,
      guestCount,
      date,
      timeSlot,
      tableId,
      section: section || 'restaurant',
      createdAt: new Date(now).toISOString(),
      expiresAtMs: now + BOOKING_TTL_MS,
    };

    IN_MEMORY_BOOKINGS.push(newBooking);

    // ── FCM Push Notification ──
    let notificationStatus = 'skipped';
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        await sendBookingNotification(guestName, tableId, timeSlot, guestCount);
        notificationStatus = 'sent';
      }
    } catch (fcmErr) {
      console.warn('FCM dispatch warning:', fcmErr);
      notificationStatus = 'fcm_not_configured';
    }

    return NextResponse.json({
      success: true,
      booking: newBooking,
      notificationStatus,
      message: `Table ${tableId} reserved for ${guestName} (${guestCount} guests) on ${date} at ${timeSlot}. Your table will be automatically freed after 1 hour.`,
    });
  } catch (error: any) {
    console.error('Booking API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
