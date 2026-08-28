import { NextRequest, NextResponse } from 'next/server';
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
  try {
    const body = await request.json();
    const { guestName, phone, date, time, guestCount } = body;

    // Validation
    if (!guestName || !phone || !date || !time || !guestCount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (guestCount < 1 || guestCount > 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid guest count (1-10)' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    // Get active bookings to find available tables
    const activeBookings = await bookingsCollection
      .find({ expiresAt: { $gt: new Date() } })
      .toArray();

    const bookedTableIds = activeBookings.map((b: any) => b.tableId);

    // Find available tables for guest count
    const availableTables = getAvailableTables(
      RESTAURANT_TABLES,
      guestCount,
      bookedTableIds
    );

    if (availableTables.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No tables available for this party size',
          availableAlternatives: [],
        },
        { status: 409 }
      );
    }

    // Assign best table
    const assignedTable = assignBestTable(availableTables, guestCount);

    if (!assignedTable) {
      return NextResponse.json(
        { success: false, error: 'Failed to assign table' },
        { status: 500 }
      );
    }

    // Create booking
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry

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

    // Save to database
    await bookingsCollection.insertOne(booking);

    // Send FCM notification to staff
    try {
      await sendBookingNotification(
        guestName,
        assignedTable.id,
        time,
        guestCount
      );
    } catch (fcmError) {
      console.error('FCM notification failed (non-critical):', fcmError);
      // Don't fail the booking if FCM fails
    }

    // Setup auto-delete after 1 hour (background)
    setTimeout(async () => {
      try {
        await bookingsCollection.deleteOne({ id: booking.id });
      } catch (err) {
        console.error('Auto-delete failed:', err);
      }
    }, 60 * 60 * 1000);

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
    console.error('Booking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
