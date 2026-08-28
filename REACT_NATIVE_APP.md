# React Native Staff Booking App Setup

Complete guide to build and deploy the staff notification app.

## Overview

The React Native app runs on staff phones to:
- Receive push notifications for new bookings
- View all active bookings
- See table assignments
- Pull-to-refresh for real-time updates

## Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Xcode (macOS) or Android Studio (any OS)
- Physical phone (Android or iOS) for testing FCM

## Step 1: Create Expo Project

```bash
expo init RestaurantStaffApp --template expo-template-blank-typescript

cd RestaurantStaffApp

# Install required packages
npm install \
  @react-native-firebase/app \
  @react-native-firebase/messaging \
  axios \
  zustand \
  react-native-paper
```

## Step 2: Firebase Configuration

### Android Setup (google-services.json)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **Your Apps**
4. Select Android app (or create one)
5. Download `google-services.json`
6. Place in your project root: `google-services.json`

### iOS Setup (GoogleService-Info.plist)

1. In Firebase Console, select iOS app
2. Download `GoogleService-Info.plist`
3. In Xcode: Right-click project → Add Files
4. Select the plist file

### app.json Configuration

```json
{
  "expo": {
    "name": "Restaurant Staff",
    "slug": "restaurant-staff",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "plugins": [
      [
        "@react-native-firebase/app",
        {
          "android": {
            "googleServicesFile": "./google-services.json"
          },
          "ios": {
            "googleServicesPlistPath": "./GoogleService-Info.plist"
          }
        }
      ]
    ],
    "android": {
      "package": "com.example.restaurantstaff"
    },
    "ios": {
      "bundleIdentifier": "com.example.restaurantstaff"
    }
  }
}
```

## Step 3: Create App Components

### App.tsx (Main App)

```typescript
import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, Alert, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { BookingList } from './components/BookingList';
import { useBookingStore } from './store/bookingStore';

const BACKEND_URL = 'https://your-vercel-project.vercel.app';

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const { bookings, setBookings } = useBookingStore();

  useEffect(() => {
    initializeFCM();
    fetchBookings();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const initializeFCM = async () => {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // Subscribe to topic
        await messaging().subscribeToTopic('restaurant_bookings');
        console.log('Subscribed to restaurant_bookings topic');

        // Handle notifications in foreground
        messaging().onMessage(async (remoteMessage) => {
          console.log('New booking notification:', remoteMessage);
          Alert.alert(
            remoteMessage.notification?.title || 'New Booking',
            remoteMessage.notification?.body
          );
          // Refresh bookings
          await fetchBookings();
        });

        // Handle notifications when app is in background
        messaging().onNotificationOpenedApp((remoteMessage) => {
          console.log('Notification opened:', remoteMessage);
          fetchBookings();
        });

        // Handle notification when app is closed
        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (remoteMessage) {
              console.log('App opened from notification:', remoteMessage);
              fetchBookings();
            }
          });
      }
    } catch (error) {
      console.error('FCM setup error:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/bookings`);
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Active Bookings</Text>
        <Text style={styles.headerCount}>{bookings.length} active</Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={({ item }) => <BookingList booking={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active bookings</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  listContainer: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
```

### components/BookingList.tsx

```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface Booking {
  id: string;
  guestName: string;
  phone: string;
  date: string;
  time: string;
  guestCount: number;
  tableId: string;
  tableCapacity: number;
  status: string;
  createdAt: string;
  timeUntilExpiry: number;
}

export function BookingList({ booking }: { booking: Booking }) {
  const expiresIn = Math.max(0, booking.timeUntilExpiry);
  const expiresInMinutes = Math.floor(expiresIn / 60);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.guestName}>{booking.guestName}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Table {booking.tableId}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <DetailRow icon="📱" label="Phone" value={booking.phone} />
        <DetailRow icon="👥" label="Guests" value={booking.guestCount.toString()} />
        <DetailRow icon="🕐" label="Time" value={booking.time} />
        <DetailRow icon="📅" label="Date" value={booking.date} />
        <DetailRow
          icon="⏱️"
          label="Expires in"
          value={`${expiresInMinutes} min`}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Mark as Seated</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value }: any) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.detailContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  guestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  detailContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  btn: {
    backgroundColor: '#667eea',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

### store/bookingStore.ts

```typescript
import { create } from 'zustand';

interface Booking {
  id: string;
  guestName: string;
  phone: string;
  date: string;
  time: string;
  guestCount: number;
  tableId: string;
  tableCapacity: number;
  status: string;
  createdAt: string;
  timeUntilExpiry: number;
}

interface BookingStore {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) =>
    set((state) => ({
      bookings: [booking, ...state.bookings],
    })),
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),
}));
```

## Step 4: Build for Testing

### Test on Expo Go (Easy - for development)
```bash
npm start

# Scan QR code with Expo Go app on your phone
```

### Build APK for Android

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --local

# APK will be generated and downloadable
```

### Build for iOS

```bash
eas build --platform ios --local

# Requires Mac with Xcode
```

## Step 5: Deploy APK to Staff Phones

### Option 1: Direct Install (Easiest for one restaurant)
1. Build APK locally
2. Email APK to staff
3. They download and install directly
4. Enable "Unknown Sources" in Android settings

### Option 2: Firebase App Distribution
```bash
eas build --platform android
# Then upload to Firebase App Distribution
```

## Environment Configuration

Create `.env` file:
```
REACT_APP_BACKEND_URL=https://your-vercel-project.vercel.app
```

Update `App.tsx`:
```typescript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
```

## Testing Notifications

### Manual Test (using curl)
```bash
# Test API directly
curl https://your-vercel-project.vercel.app/api/bookings
```

### Test Booking Creation
1. Open booking website
2. Create a test booking
3. Staff app should receive push notification
4. Booking appears in the list

## Troubleshooting

| Issue | Solution |
|-------|----------|
| FCM not received | Check Firebase credentials, topic subscription |
| App crashes on startup | Install all dependencies: `npm install` |
| APK too large | Use `eas build` with `--local` flag |
| Notifications not showing | Check phone notification settings |
| Backend not connecting | Verify `BACKEND_URL` and network connection |

## Production Checklist

- [ ] Firebase project created and configured
- [ ] google-services.json added to project
- [ ] Backend URL set to production Vercel URL
- [ ] App tested on physical phone with test bookings
- [ ] APK built and installed on staff phones
- [ ] Notifications working end-to-end
- [ ] All staff phones subscribed to `restaurant_bookings` topic

## Next Steps

1. ✅ Create and test app locally
2. Build APK for production
3. Distribute to restaurant staff
4. Monitor bookings from staff phones
5. Adjust UI based on feedback

---

For questions or issues, refer to:
- [React Native Firebase Docs](https://rnfirebase.io/)
- [Expo Documentation](https://docs.expo.dev/)
