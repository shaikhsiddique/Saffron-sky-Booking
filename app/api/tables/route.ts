import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { RESTAURANT_TABLES } from '@/lib/tables';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    // Get all active bookings
    const activeBookings = await bookingsCollection
      .find({ expiresAt: { $gt: new Date() } })
      .toArray();

    // Extract booked table IDs
    const bookedTableIds = activeBookings.map((booking: any) => booking.tableId);

    // Return tables with availability status
    const tablesWithAvailability = RESTAURANT_TABLES.map((table) => ({
      ...table,
      isAvailable: !bookedTableIds.includes(table.id),
      bookedUntil:
        activeBookings.find((b: any) => b.tableId === table.id)?.time || null,
    }));

    return NextResponse.json({
      success: true,
      tables: tablesWithAvailability,
      totalTables: RESTAURANT_TABLES.length,
      bookedCount: bookedTableIds.length,
      availableCount: RESTAURANT_TABLES.length - bookedTableIds.length,
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}
