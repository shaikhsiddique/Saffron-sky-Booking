export type Section = 'restaurant' | 'garden';
export type Shape = 'square' | 'booth' | 'circle' | 'oval' | 'semicircle';
export type Facing = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

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
  /** Photo shown on hover. Replace this file (or the path) with the real table photo. */
  image: string;
}

// Restaurant coordinates are in viewBox 0 0 460 560.
// Tables 10–12 are the crossed-out seats on the plan and are omitted.
const PHOTO = '/tables/dummy.jpg';

export const RESTAURANT_TABLES: FloorTable[] = [
  // Top Row along top wall: Tables 1, 2, 3 (6 seats each), Table 4 (6 seats curved)
  { id: 'R1', number: 1, capacity: 6, section: 'restaurant', shape: 'booth', x: 76, y: 52, w: 68, h: 24, isAvailable: true, sofaSide: 'n', image: PHOTO },
  { id: 'R2', number: 2, capacity: 6, section: 'restaurant', shape: 'booth', x: 158, y: 52, w: 68, h: 24, isAvailable: true, sofaSide: 'n', image: PHOTO },
  { id: 'R3', number: 3, capacity: 6, section: 'restaurant', shape: 'booth', x: 238, y: 58, w: 24, h: 54, isAvailable: true, image: PHOTO },
  { id: 'R4', number: 4, capacity: 6, section: 'restaurant', shape: 'semicircle', x: 326, y: 58, w: 72, h: 72, isAvailable: true, facing: 'nw', image: PHOTO },

  // Right Wall: Table 5 (6 seats curved)
  { id: 'R5', number: 5, capacity: 6, section: 'restaurant', shape: 'semicircle', x: 390, y: 145, w: 72, h: 72, isAvailable: true, facing: 'se', image: PHOTO },

  // Above Horizontal Green Hedge: Tables 9, 8, 7, 6 (4 seats each)
  { id: 'R9', number: 9, capacity: 4, section: 'restaurant', shape: 'booth', x: 92, y: 134, w: 44, h: 20, isAvailable: true, image: PHOTO },
  { id: 'R8', number: 8, capacity: 4, section: 'restaurant', shape: 'booth', x: 152, y: 134, w: 44, h: 20, isAvailable: true, image: PHOTO },
  { id: 'R7', number: 7, capacity: 4, section: 'restaurant', shape: 'booth', x: 212, y: 134, w: 44, h: 20, isAvailable: true, image: PHOTO },
  { id: 'R6', number: 6, capacity: 4, section: 'restaurant', shape: 'booth', x: 272, y: 134, w: 44, h: 20, isAvailable: true, image: PHOTO },

  // Below Horizontal Green Hedge: Tables 11, 12, 13 (4 seats each)
  { id: 'R11', number: 11, capacity: 4, section: 'restaurant', shape: 'booth', x: 152, y: 198, w: 44, h: 20, isAvailable: true, image: PHOTO },
  { id: 'R12', number: 12, capacity: 4, section: 'restaurant', shape: 'booth', x: 212, y: 198, w: 44, h: 20, isAvailable: true, image: PHOTO },
  { id: 'R13', number: 13, capacity: 4, section: 'restaurant', shape: 'booth', x: 272, y: 198, w: 44, h: 20, isAvailable: true, image: PHOTO },

  // To the Right of Vertical Green Hedge: Tables 14, 15, 16 (4 seats each)
  { id: 'R14', number: 14, capacity: 4, section: 'restaurant', shape: 'booth', x: 300, y: 245, w: 34, h: 20, isAvailable: true, image: PHOTO },
  { id: 'R15', number: 15, capacity: 4, section: 'restaurant', shape: 'booth', x: 300, y: 305, w: 34, h: 20, isAvailable: true, image: PHOTO },
  { id: 'R16', number: 16, capacity: 4, section: 'restaurant', shape: 'booth', x: 300, y: 365, w: 34, h: 20, isAvailable: true, image: PHOTO },

  // Lounge Suite in Corner Alcove: Table 19 (8 seats)
  { id: 'R19', number: 19, capacity: 8, section: 'restaurant', shape: 'booth', x: 152, y: 268, w: 58, h: 42, isAvailable: true, image: PHOTO },

  // Boardroom / Banquet Table at Bottom: Table 20 (11 seats)
  { id: 'R17', number: 17, capacity: 8, section: 'restaurant', shape: 'oval', x: 245, y: 482, w: 105, h: 32, isAvailable: true, image: PHOTO },
];

export const GARDEN_TABLES: FloorTable[] = [
  { id: 'G1', number: 1, capacity: 4, section: 'garden', shape: 'booth', x: 195, y: 785, w: 34, h: 22, isAvailable: true, image: PHOTO },
  { id: 'G2', number: 2, capacity: 4, section: 'garden', shape: 'booth', x: 195, y: 900, w: 34, h: 22, isAvailable: true, image: PHOTO },
  { id: 'G3', number: 3, capacity: 4, section: 'garden', shape: 'booth', x: 195, y: 1015, w: 34, h: 22, isAvailable: true, image: PHOTO },

  { id: 'G4', number: 4, capacity: 6, section: 'garden', shape: 'circle', x: 275, y: 810, w: 38, h: 38, isAvailable: true, image: PHOTO },
  { id: 'G5', number: 5, capacity: 6, section: 'garden', shape: 'circle', x: 275, y: 930, w: 38, h: 38, isAvailable: true, image: PHOTO },
  { id: 'G6', number: 6, capacity: 6, section: 'garden', shape: 'circle', x: 275, y: 1050, w: 38, h: 38, isAvailable: true, image: PHOTO },
  { id: 'G7', number: 7, capacity: 6, section: 'garden', shape: 'circle', x: 345, y: 810, w: 38, h: 38, isAvailable: true, image: PHOTO },
  { id: 'G8', number: 8, capacity: 6, section: 'garden', shape: 'circle', x: 345, y: 930, w: 38, h: 38, isAvailable: true, image: PHOTO },
  { id: 'G9', number: 9, capacity: 6, section: 'garden', shape: 'circle', x: 345, y: 1050, w: 38, h: 38, isAvailable: true, image: PHOTO },

  { id: 'G10', number: 10, capacity: 4, section: 'garden', shape: 'booth', x: 378, y: 790, w: 36, h: 22, isAvailable: true, image: PHOTO },
  { id: 'G11', number: 11, capacity: 4, section: 'garden', shape: 'booth', x: 378, y: 905, w: 36, h: 22, isAvailable: true, image: PHOTO },
  { id: 'G12', number: 12, capacity: 4, section: 'garden', shape: 'booth', x: 378, y: 1020, w: 36, h: 22, isAvailable: true, image: PHOTO },
];

export const ALL_TABLES = [...RESTAURANT_TABLES, ...GARDEN_TABLES];
export const SECTION_LABEL: Record<Section, string> = {
  restaurant: 'Restaurant Dine',
  garden: 'Garden Dine',
};
export const SECTION_TIME_SLOTS = ['7:30 – 8:30', '8:30 – 9:30', '9:30 – 10:30'];

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


export function getRequiredTableCapacity(guestCount: number): number {
  if (guestCount <= 2) return 2;
  if (guestCount <= 4) return 4;
  if (guestCount <= 6) return 6;
  return 8;
}

export function isTableAllowedForParty(
  tableCapacity: number,
  guestCount: number
): boolean {
  const maxCapacity = getRequiredTableCapacity(guestCount);

  return tableCapacity <= maxCapacity;
}

export function getAvailableTables(
  tables: FloorTable[],
  guestCount: number,
  bookedTableIds: string[] = []
): FloorTable[] {
  return tables.filter(
    (t) =>
      t.isAvailable &&
      isTableAllowedForParty(t.capacity, guestCount) &&
      !bookedTableIds.includes(t.id)
  );
}



export function assignBestTable(
  availableTables: FloorTable[],
  guestCount: number
): FloorTable | undefined {
  // Sort by smallest excess capacity first (best fit), then by table number
  return [...availableTables].sort((a, b) => {
    const diffA = a.capacity - guestCount;
    const diffB = b.capacity - guestCount;
    if (diffA !== diffB) return diffA - diffB;
    return a.number - b.number;
  })[0];
}


