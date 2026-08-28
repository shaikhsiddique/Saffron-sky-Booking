import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    // Get all active bookings (not expired)
    const activeBookings = await bookingsCollection
      .find({ expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .toArray();

    // Clean up expired bookings
    await bookingsCollection.deleteMany({
      expiresAt: { $lte: new Date() },
    });

    // Format response
    const formattedBookings = activeBookings.map((booking: any) => ({
      id: booking.id,
      guestName: booking.guestName,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      guestCount: booking.guestCount,
      tableId: booking.tableId,
      tableCapacity: booking.tableCapacity,
      status: booking.status,
      createdAt: booking.createdAt,
      expiresAt: booking.expiresAt,
      timeUntilExpiry: Math.round(
        (booking.expiresAt.getTime() - new Date().getTime()) / 1000
      ), // seconds
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      count: formattedBookings.length,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
