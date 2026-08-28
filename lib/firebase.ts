import * as admin from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}

export const getMessaging = () => admin.messaging();

export async function sendBookingNotification(
  guestName: string,
  tableId: string,
  time: string,
  guestCount: number
) {
  try {
    await admin.messaging().send({
      notification: {
        title: '🍽️ New Booking!',
        body: `${guestName} • ${guestCount} guests • Table ${tableId} at ${time}`,
      },
      data: {
        type: 'new_booking',
        guestName,
        tableId,
        time,
        guestCount: guestCount.toString(),
      },
      topic: 'restaurant_bookings',
    });

    console.log('FCM notification sent');
    return { success: true };
  } catch (error) {
    console.error('FCM error:', error);
    throw error;
  }
}
