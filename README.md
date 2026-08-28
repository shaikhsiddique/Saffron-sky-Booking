# 🍽️ Restaurant Booking System

A complete restaurant table booking system with real-time push notifications for staff.

## Features

✅ **Website Booking Page** - Beautiful, responsive booking interface
✅ **Smart Table Assignment** - Auto-assign best available tables based on guest count
✅ **Real-time Notifications** - Firebase Cloud Messaging push to staff
✅ **React Native App** - Native mobile app for staff notifications
✅ **Auto-Expiry** - Bookings automatically expire after 1 hour
✅ **Responsive Design** - Works on desktop and mobile
✅ **Zero Cost** - All services on free tier

## Tech Stack

**Backend:**
- Next.js 14 (TypeScript)
- MongoDB Atlas (Free tier)
- Firebase Cloud Messaging
- Deployed on Vercel

**Frontend:**
- React 18
- TypeScript
- CSS Modules

**Mobile App:**
- React Native (Expo)
- Firebase Messaging

## Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- MongoDB Atlas account (free)
- Firebase project (free)

### Installation

1. **Clone and Install**
```bash
npm install
```

2. **Setup Environment Variables**
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY_ID` - Firebase private key ID
- `FIREBASE_PRIVATE_KEY` - Firebase private key
- `FIREBASE_CLIENT_EMAIL` - Firebase client email
- `FIREBASE_CLIENT_ID` - Firebase client ID

3. **Run Locally**
```bash
npm run dev
```

Visit `http://localhost:3000`

## API Endpoints

### Get All Tables
```
GET /api/tables
```

Response:
```json
{
  "success": true,
  "tables": [
    {
      "id": "T1",
      "capacity": 2,
      "section": "premium",
      "isAvailable": true,
      "x": 50,
      "y": 30
    }
  ],
  "totalTables": 19,
  "bookedCount": 3,
  "availableCount": 16
}
```

### Create Booking
```
POST /api/book
```

Request body:
```json
{
  "guestName": "Aman",
  "phone": "9876543210",
  "date": "2025-01-20",
  "time": "19:30",
  "guestCount": 4
}
```

Response:
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

### Get All Bookings (for Staff App)
```
GET /api/bookings
```

Response:
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

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── tables/route.ts          # Get available tables
│   │   ├── book/route.ts            # Create booking
│   │   └── bookings/route.ts        # Get all bookings
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Booking UI
│   ├── page.module.css              # Page styles
│   └── globals.css                  # Global styles
├── lib/
│   ├── db.ts                        # MongoDB connection
│   ├── firebase.ts                  # FCM setup & notifications
│   └── tables.ts                    # Table schema & logic
├── .env.example                     # Environment variables template
├── next.config.js                   # Next.js config
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies
```

## Deployment to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/restaurant-booking.git
git push -u origin main
```

2. **Import to Vercel**
- Go to [Vercel Dashboard](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables in "Environment Variables"
- Click "Deploy"

3. **Your API is now live at:** `https://your-project.vercel.app`

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create a cluster
4. Create a database user
5. Get connection string
6. Add to `.env.local` as `MONGODB_URI`

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Cloud Messaging
4. Go to Project Settings → Service Accounts
5. Generate new private key (JSON)
6. Extract credentials and add to `.env.local`

## React Native Staff App

See documentation in the project for setting up the staff mobile app with Firebase Cloud Messaging.

**Key setup:**
- Subscribe to topic: `restaurant_bookings`
- Install `@react-native-firebase/messaging`
- Set backend API URL to your Vercel deployment URL

## Customization

### Modify Table Layout
Edit `/lib/tables.ts`:

```typescript
export const RESTAURANT_TABLES = [
  { id: 'T1', capacity: 2, section: 'premium', x: 50, y: 30 },
  // Add your tables here
];
```

### Change Booking Expiry Time
In `/app/api/book/route.ts`, modify:
```typescript
const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // Change 60 to desired minutes
```

### Customize Time Slots
The system currently accepts any time. To restrict to specific slots, modify the booking form in `/app/page.tsx`.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No tables available" | Ensure tables are configured in `/lib/tables.ts` |
| FCM not sending | Verify Firebase credentials in `.env.local` |
| MongoDB connection error | Check connection string and IP whitelist in Atlas |
| Tables not loading | Verify MongoDB is connected and bookings collection exists |

## Performance

- **Database Queries:** Optimized with indexes
- **Auto-cleanup:** Expired bookings deleted automatically after 1 hour
- **Real-time:** FCM push notifications < 1 second
- **Scale:** Free tier supports hundreds of daily bookings

## Security

- Environment variables kept private (not in git)
- Firebase credentials validated server-side only
- Input validation on all API endpoints
- CORS configured for production

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API responses for error messages
3. Check server logs in Vercel Dashboard
4. Verify environment variables are set correctly

---

**Built for:** Restaurant owners who need simple, free table booking with staff notifications.

**Ready to go live?**
1. ✅ Set up MongoDB & Firebase
2. ✅ Deploy to Vercel
3. ✅ Install React Native app on staff phones
4. ✅ Share booking link with customers
