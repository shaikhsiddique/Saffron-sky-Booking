# Restaurant Booking System - Setup Guide

## Backend Architecture

```
Next.js API (Vercel) ←→ MongoDB (Atlas) 
                     ↓
                Firebase FCM (Push Notifications)
```

---

## Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (free tier)
4. Go to **Database Access** → Create DB user
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/`
6. Copy to `.env.local` as `MONGODB_URI`

**Collection auto-creation:** Collections `bookings` will be created automatically.

---

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project (name: "restaurant-booking")
3. Enable **Cloud Messaging**
4. Go to **Project Settings** → **Service Accounts**
5. Click "Generate New Private Key" (JSON file)
6. Copy values from JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep newlines as `\n`)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `client_id` → `FIREBASE_CLIENT_ID`

Add to `.env.local`

---

## Step 3: Local Setup

```bash
# Clone/setup project
npm install

# Create .env.local (copy from .env.example)
cp .env.example .env.local

# Add your MongoDB URI and Firebase credentials

# Run locally
npm run dev

# Server runs on http://localhost:3000
```

---

## Step 4: Test Endpoints

### Get all tables
```bash
curl http://localhost:3000/api/tables
```

### Create a booking
```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "Aman",
    "phone": "9876543210",
    "date": "2025-01-20",
    "time": "19:30",
    "guestCount": 4
  }'
```

### Get all bookings (for React Native app)
```bash
curl http://localhost:3000/api/bookings
```

---

## Step 5: Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import GitHub repository
4. Add environment variables (same as `.env.local`)
5. Deploy

Your API will be at: `https://your-project.vercel.app`

---

## Step 6: React Native App Setup

See `REACT_NATIVE_APP.md` for complete setup.

### Quick checklist:
- [ ] Firebase config (google-services.json for Android)
- [ ] FCM topic subscription: `restaurant_bookings`
- [ ] API base URL: `https://your-project.vercel.app`
- [ ] Test on physical phone

---

## API Responses

### POST /api/book
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "tableId": "T5",
    "tableName": "Table T5",
    "tableCapacity": 4,
    "guestName": "Aman",
    "guestCount": 4,
    "date": "2025-01-20",
    "time": "19:30",
    "status": "confirmed",
    "message": "Booking confirmed! You're assigned to T5"
  }
}
```

### GET /api/bookings
```json
{
  "success": true,
  "bookings": [
    {
      "id": "uuid",
      "guestName": "Aman",
      "phone": "9876543210",
      "date": "2025-01-20",
      "time": "19:30",
      "guestCount": 4,
      "tableId": "T5",
      "tableCapacity": 4,
      "status": "confirmed",
      "createdAt": "2025-01-20T19:00:00Z",
      "expiresAt": "2025-01-20T20:00:00Z",
      "timeUntilExpiry": 3456
    }
  ],
  "count": 1
}
```

---

## Data Auto-Expiry

- Bookings automatically expire **1 hour** after creation
- MongoDB will delete expired records
- React Native app will refresh and remove them from list
- No manual cleanup needed

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No tables available" | Check if all tables are booked. Table count: 19 |
| FCM not sending | Check Firebase credentials in `.env.local` |
| MongoDB connection fails | Verify connection string and IP whitelist in Atlas |
| API 500 error | Check console logs: `npm run dev` |

---

## Next Steps

1. ✅ Backend ready
2. → Create React.js booking website UI
3. → Create React Native staff app
4. → Test end-to-end flow
5. → Deploy to Vercel + Play Store (APK)

Customize table layout in `/lib/tables.ts` as needed.
