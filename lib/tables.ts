
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695014/r1_oclpxr.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695916/r2_xyvxer.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695910/r3_d5jyvn.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788696094/r4_ztzeni.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788696113/r5_zmsk0y.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788697034/r9_pjtwnm.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788696108/r8_urjgx5.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788696114/r7_mqjzz2.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788697034/r6_u0mel6.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695452/r11_q0dtjr.jpg",
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
    image:"https://res.cloudinary.com/daai6xwtd/image/upload/v1788697023/r12_qkabmv.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788697021/r13_uod4uq.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695294/r14_qgklbl.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788697077/r15_v03dry.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788696920/r16_qs8470.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788696114/r7_mqjzz2.jpg",
  },


  // -------------------------------------------------------
  // Boardroom / Banquet Table
  // Table 17
  // -------------------------------------------------------

  {
    id: 'R20',
    number: 20,
    capacity: 8,
    section: 'restaurant',
    shape: 'oval',
    x: 245,
    y: 482,
    w: 105,
    h: 32,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695357/r10_szsxle.jpg",
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
    id: 'G11',
    number: 11,
    capacity: 6,
    section: 'garden',
    shape: 'booth',
    x: 177,
    y: 760,
    w: 20,
    h: 36,
    isAvailable: true,
    sofaSide: 'w',
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788694435/g1_akxi5p.jpg",
  },

  {
    id: 'G10',
    number: 10,
    capacity: 6,
    section: 'garden',
    shape: 'booth',
    x: 177,
    y: 868,
    w: 20,
    h: 36,
    isAvailable: true,
    sofaSide: 'w',
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788694991/g2_kt24zv.jpg",
  },

  {
    id: 'G9',
    number: 9,
    capacity: 6,
    section: 'garden',
    shape: 'booth',
    x: 177,
    y: 976,
    w: 20,
    h: 36,
    isAvailable: true,
    sofaSide: 'w',
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695008/g3_vznkym.jpg",
  },


  // -------------------------------------------------------
  // Middle-left column
  // Tables 4, 5
  // -------------------------------------------------------

  {
    id: 'G7',
    number: 7,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 237,
    y: 862,
    w: 30,
    h: 24,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788694950/g4_aceiab.jpg",
  },

  {
    id: 'G8',
    number: 8,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 237,
    y: 970,
    w: 30,
    h: 24,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695006/g5_l2wd5l.jpg",
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
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788694812/g6_xeb2yp.jpg",
  },

  {
    id: 'G5',
    number: 5,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 282,
    y: 905,
    w: 30,
    h: 24,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788696066/g7_ymvfmf.jpg",
  },

  {
    id: 'G4',
    number: 4,
    capacity: 4,
    section: 'garden',
    shape: 'square',
    x: 282,
    y: 1007,
    w: 30,
    h: 24,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695015/g8_ytemhk.jpg",
  },


  // -------------------------------------------------------
  // Right column
  // Tables 9, 10, 11
  // -------------------------------------------------------

  {
    id: 'G1',
    number: 1,
    capacity: 6,
    section: 'garden',
    shape: 'square',
    x: 388,
    y: 833,
    w: 44,
    h: 24,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695963/g9_vc77ga.jpg",
  },

  {
    id: 'G2',
    number: 2,
    capacity: 6,
    section: 'garden',
    shape: 'square',
    x: 388,
    y: 900,
    w: 44,
    h: 24,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695996/g10_dh6fmg.jpg",
  },

  {
    id: 'G3',
    number: 3,
    capacity: 6,
    section: 'garden',
    shape: 'square',
    x: 388,
    y: 975,
    w: 44,
    h: 24,
    isAvailable: true,
    image: "https://res.cloudinary.com/daai6xwtd/image/upload/v1788695923/g11_d2vzg4.jpg",
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
  restaurant: 'Fine Dine',
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
  if (guestCount <= 4) return 4;

  if (guestCount <= 6) return 6;

  return Infinity;
}


/* =========================================================
   TABLE CAPACITY CHECK
========================================================= */

export function isTableAllowedForParty(
  tableCapacity: number,
  guestCount: number
): boolean {
  // 1-4 guests → show table with capacity 4
  if (guestCount <= 4) {
    return tableCapacity === 4;
  }

  // 5-6 guests → show table of capacity 4 and 6
  if (guestCount <= 6) {
    return tableCapacity === 4 || tableCapacity === 6;
  }

  // 7+ guests → show all tables
  return true;
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
