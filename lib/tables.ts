
export type Section = 'restaurant' | 'garden';

export type Shape =
  | 'square'
  | 'booth'
  | 'circle'
  | 'oval'
  | 'semicircle';

export type Facing =
  | 'n'
  | 's'
  | 'e'
  | 'w'
  | 'ne'
  | 'nw'
  | 'se'
  | 'sw';

export interface FloorTable {
  id: string;

  number: number;

  capacity: number;

  section: Section;

  shape: Shape;

  x: number;

  y: number;

  w: number;

  h: number;

  isAvailable: boolean;

  facing?: Facing;

  sofaSide?: Facing;

  /** Photo shown on hover / mobile selection. */
  image: string;
}


/* =========================================================
   TABLE IMAGES
========================================================= */

const PHOTO = '/tables/dummy.jpg';

/*
 * Automatically maps:
 *
 * Restaurant Table 1  → /tables/r1.jpg
 * Restaurant Table 2  → /tables/r2.jpg
 * Restaurant Table 17 → /tables/r17.jpg
 *
 * Garden Table 1      → /tables/g1.jpg
 * Garden Table 2      → /tables/g2.jpg
 * Garden Table 11     → /tables/g11.jpg
 *
 * If an image is missing, your <img onError> fallback
 * will use dummy.jpg.
 */

const tableImage = (
  section: Section,
  number: number
): string => {
  if (section === 'restaurant') {
    return `/tables/r${number}.jpg`;
  }

  return `/tables/g${number}.jpg`;
};


/* =========================================================
   RESTAURANT TABLES
========================================================= */

/*
 * Restaurant coordinates are in viewBox 0 0 460 560.
 *
 * Tables 10–12 are the crossed-out seats on the plan
 * and are omitted.
 */

export const RESTAURANT_TABLES: FloorTable[] = [

  // -------------------------------------------------------
  // Top Row along top wall
  // Tables 1, 2, 3 and 4
  // -------------------------------------------------------

  {
    id: 'R1',
    number: 1,
    capacity: 6,
    section: 'restaurant',
    shape: 'booth',
    x: 76,
    y: 52,
    w: 68,
    h: 24,
    isAvailable: true,
    sofaSide: 'n',
    image: tableImage('restaurant', 1),
  },

  {
    id: 'R2',
    number: 2,
    capacity: 6,
    section: 'restaurant',
    shape: 'booth',
    x: 158,
    y: 52,
    w: 68,
    h: 24,
    isAvailable: true,
    sofaSide: 'n',
    image: tableImage('restaurant', 2),
  },

  {
    id: 'R3',
    number: 3,
    capacity: 6,
    section: 'restaurant',
    shape: 'booth',
    x: 238,
    y: 58,
    w: 24,
    h: 54,
    isAvailable: true,
    image: tableImage('restaurant', 3),
  },

  {
    id: 'R4',
    number: 4,
    capacity: 6,
    section: 'restaurant',
    shape: 'semicircle',
    x: 326,
    y: 58,
    w: 72,
    h: 72,
    isAvailable: true,
    facing: 'nw',
    image: tableImage('restaurant', 4),
  },


  // -------------------------------------------------------
  // Right Wall
  // Table 5
  // -------------------------------------------------------

  {
    id: 'R5',
    number: 5,
    capacity: 6,
    section: 'restaurant',
    shape: 'semicircle',
    x: 390,
    y: 145,
    w: 72,
    h: 72,
    isAvailable: true,
    facing: 'se',
    image: tableImage('restaurant', 5),
  },


  // -------------------------------------------------------
  // Above Horizontal Green Hedge
  // Tables 9, 8, 7, 6
  // -------------------------------------------------------

  {
    id: 'R9',
    number: 9,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 92,
    y: 134,
    w: 44,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 9),
  },

  {
    id: 'R8',
    number: 8,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 152,
    y: 134,
    w: 44,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 8),
  },

  {
    id: 'R7',
    number: 7,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 212,
    y: 134,
    w: 44,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 7),
  },

  {
    id: 'R6',
    number: 6,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 272,
    y: 134,
    w: 44,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 6),
  },


  // -------------------------------------------------------
  // Below Horizontal Green Hedge
  // Tables 11, 12, 13
  // -------------------------------------------------------

  {
    id: 'R11',
    number: 11,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 152,
    y: 198,
    w: 44,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 11),
  },

  {
    id: 'R12',
    number: 12,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 212,
    y: 198,
    w: 44,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 12),
  },

  {
    id: 'R13',
    number: 13,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 272,
    y: 198,
    w: 44,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 13),
  },


  // -------------------------------------------------------
  // Right of Vertical Green Hedge
  // Tables 14, 15, 16
  // -------------------------------------------------------

  {
    id: 'R14',
    number: 14,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 300,
    y: 245,
    w: 34,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 14),
  },

  {
    id: 'R15',
    number: 15,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 300,
    y: 305,
    w: 34,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 15),
  },

  {
    id: 'R16',
    number: 16,
    capacity: 4,
    section: 'restaurant',
    shape: 'booth',
    x: 300,
    y: 365,
    w: 34,
    h: 20,
    isAvailable: true,
    image: tableImage('restaurant', 16),
  },


  // -------------------------------------------------------
  // Lounge Suite
  // Table 10
  // -------------------------------------------------------

  {
    id: 'R10',
    number: 10,
    capacity: 8,
    section: 'restaurant',
    shape: 'booth',
    x: 152,
    y: 268,
    w: 58,
    h: 42,
    isAvailable: true,
    image: tableImage('restaurant', 10),
  },


  // -------------------------------------------------------
  // Boardroom / Banquet Table
  // Table 17
  // -------------------------------------------------------

  {
    id: 'R17',
    number: 17,
    capacity: 8,
    section: 'restaurant',
    shape: 'oval',
    x: 245,
    y: 482,
    w: 105,
    h: 32,
    isAvailable: true,
    image: tableImage('restaurant', 17),
  },
];


/* =========================================================
   GARDEN TABLES
========================================================= */

export const GARDEN_TABLES: FloorTable[] = [

  // -------------------------------------------------------
  // Left wall
  // Tables 1, 2, 3
  // -------------------------------------------------------

  {
    id: 'G1',
    number: 1,
    capacity: 6,
    section: 'garden',
    shape: 'booth',
    x: 177,
    y: 760,
    w: 20,
    h: 36,
    isAvailable: true,
    sofaSide: 'w',
    image: tableImage('garden', 1),
  },

  {
    id: 'G2',
    number: 2,
    capacity: 6,
    section: 'garden',
    shape: 'booth',
    x: 177,
    y: 868,
    w: 20,
    h: 36,
    isAvailable: true,
    sofaSide: 'w',
    image: tableImage('garden', 2),
  },

  {
    id: 'G3',
    number: 3,
    capacity: 6,
    section: 'garden',
    shape: 'booth',
    x: 177,
    y: 976,
    w: 20,
    h: 36,
    isAvailable: true,
    sofaSide: 'w',
    image: tableImage('garden', 3),
  },


  // -------------------------------------------------------
  // Middle-left column
  // Tables 4, 5
  // -------------------------------------------------------

  {
    id: 'G4',
    number: 4,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 237,
    y: 862,
    w: 30,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 4),
  },

  {
    id: 'G5',
    number: 5,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 237,
    y: 970,
    w: 30,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 5),
  },


  // -------------------------------------------------------
  // Center column
  // Tables 6, 7, 8
  // -------------------------------------------------------

  {
    id: 'G6',
    number: 6,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 282,
    y: 803,
    w: 30,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 6),
  },

  {
    id: 'G7',
    number: 7,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 282,
    y: 905,
    w: 30,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 7),
  },

  {
    id: 'G8',
    number: 8,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 282,
    y: 1007,
    w: 30,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 8),
  },


  // -------------------------------------------------------
  // Right column
  // Tables 9, 10, 11
  // -------------------------------------------------------

  {
    id: 'G9',
    number: 9,
    capacity: 6,
    section: 'garden',
    shape: 'square',
    x: 388,
    y: 833,
    w: 44,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 9),
  },

  {
    id: 'G10',
    number: 10,
    capacity: 6,
    section: 'garden',
    shape: 'square',
    x: 388,
    y: 900,
    w: 44,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 10),
  },

  {
    id: 'G11',
    number: 11,
    capacity: 6,
    section: 'garden',
    shape: 'square',
    x: 388,
    y: 975,
    w: 44,
    h: 24,
    isAvailable: true,
    image: tableImage('garden', 11),
  },
];


/* =========================================================
   ALL TABLES
========================================================= */

export const ALL_TABLES = [
  ...RESTAURANT_TABLES,
  ...GARDEN_TABLES,
];


/* =========================================================
   SECTION LABELS
========================================================= */

export const SECTION_LABEL: Record<Section, string> = {
  restaurant: 'Restaurant Dine',
  garden: 'Garden Dine',
};


/* =========================================================
   TIME SLOTS
========================================================= */

export const SECTION_TIME_SLOTS = [
  '7:30 – 8:30',
  '8:30 – 9:30',
  '9:30 – 10:30',
];


/* =========================================================
   BOOKING
========================================================= */

export interface Booking {
  id: string;

  guestName: string;

  phone: string;

  date: string;

  time: string;

  guestCount: number;

  tableId: string;

  tableCapacity: number;

  status: 'confirmed' | 'pending' | 'cancelled';

  createdAt: Date;

  expiresAt: Date;
}


/* =========================================================
   REQUIRED TABLE CAPACITY
========================================================= */

export function getRequiredTableCapacity(
  guestCount: number
): number {
  if (guestCount <= 2) return 2;

  if (guestCount <= 4) return 4;

  if (guestCount <= 6) return 6;

  return 8;
}


/* =========================================================
   TABLE CAPACITY CHECK
========================================================= */

export function isTableAllowedForParty(
  tableCapacity: number,
  guestCount: number
): boolean {
  const maxCapacity =
    getRequiredTableCapacity(guestCount);

  return tableCapacity <= maxCapacity;
}


/* =========================================================
   AVAILABLE TABLES
========================================================= */

export function getAvailableTables(
  tables: FloorTable[],
  guestCount: number,
  bookedTableIds: string[] = []
): FloorTable[] {
  return tables.filter(
    (t) =>
      t.isAvailable &&
      isTableAllowedForParty(
        t.capacity,
        guestCount
      ) &&
      !bookedTableIds.includes(t.id)
  );
}


/* =========================================================
   BEST TABLE ASSIGNMENT
========================================================= */

export function assignBestTable(
  availableTables: FloorTable[],
  guestCount: number
): FloorTable | undefined {
  /*
   * Sort by smallest excess capacity first
   * (best fit), then by table number.
   */

  return [...availableTables].sort(
    (a, b) => {
      const diffA =
        a.capacity - guestCount;

      const diffB =
        b.capacity - guestCount;

      if (diffA !== diffB) {
        return diffA - diffB;
      }

      return a.number - b.number;
    }
  )[0];
}
