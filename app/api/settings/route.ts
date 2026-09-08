import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export interface BookingSettings {
  _id: string;
  isBookingEnabled: boolean;
  isRestaurantEnabled: boolean;
  isGardenEnabled: boolean;
  blockedDates: string[];
  reason?: string;
  restaurantMessage?: string;
  gardenMessage?: string;
  updatedAt: Date;
}

const SETTINGS_ID = 'booking_settings';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const DEFAULT_SETTINGS = {
  isBookingEnabled: true,
  isRestaurantEnabled: true,
  isGardenEnabled: true,
  blockedDates: [] as string[],
  reason: '',
  restaurantMessage: '',
  gardenMessage: '',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const db = await getDatabase();
    const settingsCollection = db.collection<any>('settings');

    const settings = await settingsCollection.findOne({ _id: SETTINGS_ID });

    if (!settings) {
      return NextResponse.json(
        {
          success: true,
          settings: {
            ...DEFAULT_SETTINGS,
            updatedAt: new Date().toISOString(),
          },
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        settings: {
          isBookingEnabled: settings.isBookingEnabled ?? true,
          isRestaurantEnabled: settings.isRestaurantEnabled ?? true,
          isGardenEnabled: settings.isGardenEnabled ?? true,
          blockedDates: Array.isArray(settings.blockedDates) ? settings.blockedDates : [],
          reason: settings.reason || '',
          restaurantMessage: settings.restaurantMessage || '',
          gardenMessage: settings.gardenMessage || '',
          updatedAt: settings.updatedAt ? new Date(settings.updatedAt).toISOString() : new Date().toISOString(),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching booking settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch settings',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      isBookingEnabled,
      isRestaurantEnabled,
      isGardenEnabled,
      blockedDates,
      action,
      date,
      reason,
      restaurantMessage,
      gardenMessage,
    } = body;

    const db = await getDatabase();
    const settingsCollection = db.collection<any>('settings');

    const existing = await settingsCollection.findOne({ _id: SETTINGS_ID });

    let currentEnabled = existing?.isBookingEnabled ?? true;
    let currentRestaurant = existing?.isRestaurantEnabled ?? true;
    let currentGarden = existing?.isGardenEnabled ?? true;
    let currentBlocked = Array.isArray(existing?.blockedDates) ? [...existing.blockedDates] : [];
    let currentReason = existing?.reason ?? '';
    let currentRestaurantMsg = existing?.restaurantMessage ?? '';
    let currentGardenMsg = existing?.gardenMessage ?? '';

    // Direct boolean set
    if (typeof isBookingEnabled === 'boolean') {
      currentEnabled = isBookingEnabled;
    }
    if (typeof isRestaurantEnabled === 'boolean') {
      currentRestaurant = isRestaurantEnabled;
    }
    if (typeof isGardenEnabled === 'boolean') {
      currentGarden = isGardenEnabled;
    }

    if (Array.isArray(blockedDates)) {
      currentBlocked = Array.from(new Set(blockedDates.map((d: any) => String(d).trim()).filter(Boolean)));
    }

    // Specific atomic actions from app
    if (action === 'toggleMaster') {
      currentEnabled = !currentEnabled;
    } else if (action === 'toggleRestaurant') {
      currentRestaurant = !currentRestaurant;
    } else if (action === 'toggleGarden') {
      currentGarden = !currentGarden;
    } else if (action === 'blockDate' && date) {
      const cleanDate = String(date).trim();
      if (cleanDate && !currentBlocked.includes(cleanDate)) {
        currentBlocked.push(cleanDate);
      }
    } else if (action === 'unblockDate' && date) {
      const cleanDate = String(date).trim();
      currentBlocked = currentBlocked.filter((d) => d !== cleanDate);
    }

    if (typeof reason === 'string') {
      currentReason = reason;
    }
    if (typeof restaurantMessage === 'string') {
      currentRestaurantMsg = restaurantMessage;
    }
    if (typeof gardenMessage === 'string') {
      currentGardenMsg = gardenMessage;
    }

    const now = new Date();

    await settingsCollection.updateOne(
      { _id: SETTINGS_ID },
      {
        $set: {
          isBookingEnabled: currentEnabled,
          isRestaurantEnabled: currentRestaurant,
          isGardenEnabled: currentGarden,
          blockedDates: currentBlocked,
          reason: currentReason,
          restaurantMessage: currentRestaurantMsg,
          gardenMessage: currentGardenMsg,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Booking settings updated successfully',
        settings: {
          isBookingEnabled: currentEnabled,
          isRestaurantEnabled: currentRestaurant,
          isGardenEnabled: currentGarden,
          blockedDates: currentBlocked,
          reason: currentReason,
          restaurantMessage: currentRestaurantMsg,
          gardenMessage: currentGardenMsg,
          updatedAt: now.toISOString(),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error updating booking settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to update settings',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
