# 🍽️ Restaurant Booking System — Complete Project Documentation

Welcome to the **Restaurant Floor Plan Booking System** documentation. This document provides a complete guide to the application architecture, directory structure, individual file responsibilities, SVG floor plan coordinate system, table capacity logic, Firebase backend & Push Notification setup, and step-by-step instructions for editing any part of the frontend or backend.

---

## 📐 1. Architecture Overview

- **Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS + Custom SVG Micro-Textures & Architectural Patterns
- **Graphics Engine**: Scalable Vector Graphics (SVG) with a responsive `viewBox="0 0 500 570"`
- **State Management**: React `useState` / Controlled Component pattern
- **Backend API**: Next.js API Routes (`app/api/bookings/route.ts`)
- **Push Notifications**: Firebase Admin SDK & Cloud Messaging (FCM) integration (`lib/firebase.ts`)

---

## 📁 2. File & Directory Map

```
claude/
├── app/
│   ├── api/
│   │   └── bookings/
│   │       └── route.ts          # Backend API route for booking validation & FCM dispatch
│   ├── favicon.ico
│   ├── globals.css               # Global CSS styles & font definitions
│   ├── layout.tsx                # Next.js root layout wrapper
│   └── page.tsx                  # Main interactive booking page
├── components/
│   ├── booking/
│   │   ├── BookingForm.tsx       # Guest input form (name, phone, adults, date, time)
│   │   ├── BookingHeader.tsx     # Hero banner header & restaurant title
│   │   ├── FloorPlanLegend.tsx   # Color status key (Available, Selected, Other tier)
│   │   └── SectionTabs.tsx       # Toggle between Restaurant Floor & Outdoor Garden
│   └── floor-plan/
│       ├── BarCounter.tsx        # L-shaped cocktail bar with stools & POS
│       ├── Chair.tsx             # SVG top-down dining chair renderer
│       ├── colors.ts             # Architectural color constants (gold, taupe, walls)
│       ├── CurvedSofa.tsx        # Annular curved lounge booth renderer (Tables 4 & 5)
│       ├── FixedFurniture.tsx    # Structural wall lines & entrance stairs
│       ├── FloorPlanSVG.tsx      # SVG viewport container & section switcher
│       ├── FurnitureDefs.tsx     # SVG gradients, marble, wood, and tufted fabric patterns
│       ├── Hedge.tsx             # Foliage sampler & scalloped green hedge foliage
│       ├── HostessDesk.tsx       # Reception desk & swivel task chair renderer
│       ├── LoungeSuite.tsx       # 8-seater corner lounge suite (Table 19)
│       ├── RenderTable.tsx       # Interactive table renderer & click/hover handler
│       ├── RestaurantLayout.tsx  # Full architectural room layout & fixed features
│       ├── RestroomSuite.tsx     # Dual WC restroom suite with commodes & swing doors
│       ├── ServiceCredenza.tsx   # Waiter service station & credenza unit
│       ├── WallBanquette.tsx     # Straight wall sofa banquette renderer
│       └── WashStation.tsx       # Double-basin marble handwash vanity unit
├── lib/
│   ├── firebase.ts               # Firebase Admin SDK & FCM Push Notification dispatcher
│   └── tables.ts                 # Table definitions, floor coordinates, capacity rules
├── PROJECT_DOCUMENTATION.md      # This comprehensive documentation file
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🎯 3. Floor Plan SVG Coordinate Architecture

The restaurant floor plan is built inside a high-precision SVG canvas defined by `viewBox="0 0 500 570"`.

| Feature / Element | SVG Location (x, y) | Dimensions / Details |
| :--- | :--- | :--- |
| **Top Structural Wall** | `y = 20` | Runs from `x = 28` to `x = 456` |
| **Left Structural Wall** | `x = 30` | Runs from `y = 20` to `y = 485` |
| **Right Structural Wall** | `x = 456` | Runs from `y = 20` to `y = 485` |
| **Water Fountain Pool** | `(398, 54)` | Circular basin with radial water ripples & center jet |
| **Central L-Hedge Divider** | Horizontal at `y = 168`, Vertical at `x = 318` | Scalloped foliage clumps with flower accents |
| **Tables 1, 2, 3, 4** (Top Row) | `y ≈ 52–58` | Booths 1 & 2 (top wall), Booth 3 (vertical), Booth 4 (curve) |
| **Table 5 & Waiting Lounge** | `x ≈ 406` (Right Wall) | Semicircle Booth 5 + 6-seater waiting lounge suite |
| **Booths 9, 8, 7, 6** | `y = 134` | 4-seater booths above horizontal hedge |
| **Booths 11, 12, 13** | `y = 198` | 4-seater booths under horizontal hedge |
| **Booths 14, 15, 16** | `x = 300, y = 245, 305, 365` | 4-seater booths right of vertical hedge |
| **Restroom Suite** | `x: 30–115, y: 245–290` | Dual WC cubicles with swing doors & foyer vanity |
| **Wash Station** | `x: 46, y: 195` | Double-basin marble handwash vanity unit |
| **Lounge Suite (Table 19)** | `x: 120, y: 245` | 8-seater tufted lounge sofa, armchairs, coffee table |
| **Cocktail Bar Counter** | `x: 192, y: 236` | L-shaped bar counter with 8 stools & POS register |
| **Hostess Reception Desk** | `x: 326, y: 432` | Reception desk with 5-star swivel task chair |
| **Banquet Table (Table 20)** | `x: 215, y: 442` | 11-seater large boardroom oval table |

---

## 🪑 4. Table Capacity Slot Matching Logic

To ensure optimal restaurant operations, the system enforces capacity slot matching via `lib/tables.ts`:

| Guest Count | Target Table Capacity | Available Tables |
| :--- | :--- | :--- |
| **1 – 4 Guests** | **4 Seats** | Tables **6, 7, 8, 9, 11, 12, 13, 14, 15, 16** |
| **5 – 6 Guests** | **6 Seats** | Tables **1, 2, 3, 4, 5** |
| **7 – 8 Guests** | **8 Seats** | Table **19** (Lounge Suite) |
| **9 – 11+ Guests** | **11 Seats** | Table **20** (Boardroom Banquet Table) |

---

## 🔔 5. Backend & Push Notification System

The backend is powered by Next.js API Routes (`app/api/bookings/route.ts`) and Firebase Cloud Messaging (`lib/firebase.ts`).

### Booking Workflow:
1. User selects date, time, guest count, and clicks a matching table on the SVG floor plan.
2. The form submits a `POST` request to `/api/bookings`.
3. The API validates required fields, verifies capacity rules, checks for double-booking conflicts, and saves the reservation.
4. The server triggers `sendBookingNotification()` via Firebase Admin SDK to push an FCM alert to topic `restaurant_bookings`.

---

## 🛠️ 6. Developer Guide: How to Edit Anything in the Frontend

### A. How to Change Table Coordinates or Capacities:
Open [`lib/tables.ts`](file:///c:/Users/Siddique/Desktop/claude/lib/tables.ts) and edit the `RESTAURANT_TABLES` array.

### B. How to Modify SVG Furniture & Textures:
- **Curved Booth Styling**: Edit [`CurvedSofa.tsx`](file:///c:/Users/Siddique/Desktop/claude/components/floor-plan/CurvedSofa.tsx).
- **Straight Banquettes**: Edit [`WallBanquette.tsx`](file:///c:/Users/Siddique/Desktop/claude/components/floor-plan/WallBanquette.tsx).
- **Lounge Seating**: Edit [`LoungeSuite.tsx`](file:///c:/Users/Siddique/Desktop/claude/components/floor-plan/LoungeSuite.tsx).
- **Restrooms / Wash Stations**: Edit [`RestroomSuite.tsx`](file:///c:/Users/Siddique/Desktop/claude/components/floor-plan/RestroomSuite.tsx) or [`WashStation.tsx`](file:///c:/Users/Siddique/Desktop/claude/components/floor-plan/WashStation.tsx).
- **Bar Counter**: Edit [`BarCounter.tsx`](file:///c:/Users/Siddique/Desktop/claude/components/floor-plan/BarCounter.tsx).

### C. How to Edit Booking Form Fields:
Open [`BookingForm.tsx`](file:///c:/Users/Siddique/Desktop/claude/components/booking/BookingForm.tsx) to add or adjust form inputs.
