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
}

// Restaurant coordinates are in viewBox 0 0 460 560.
// Tables 10–12 are the crossed-out seats on the plan and are omitted.
export const RESTAURANT_TABLES: FloorTable[] = [
  // Top wall, left to right
  { id: 'R1', number: 1, capacity: 6, section: 'restaurant', shape: 'booth', x: 88, y: 54, w: 78, h: 26, isAvailable: true },
  { id: 'R2', number: 2, capacity: 6, section: 'restaurant', shape: 'booth', x: 180, y: 54, w: 78, h: 26, isAvailable: true },
  { id: 'R3', number: 3, capacity: 6, section: 'restaurant', shape: 'booth', x: 252, y: 72, w: 26, h: 62, isAvailable: true },
  { id: 'R4', number: 4, capacity: 6, section: 'restaurant', shape: 'semicircle', x: 355, y: 78, w: 86, h: 86, isAvailable: true, facing: 'sw' },

  // Right curved wall
  { id: 'R5', number: 5, capacity: 8, section: 'restaurant', shape: 'semicircle', x: 392, y: 215, w: 88, h: 88, isAvailable: true, facing: 'w' },

  // Above the L partition, right to left: 6, 7, 8, 9
  { id: 'R6', number: 6, capacity: 4, section: 'restaurant', shape: 'booth', x: 268, y: 168, w: 50, h: 24, isAvailable: true },
  { id: 'R7', number: 7, capacity: 4, section: 'restaurant', shape: 'booth', x: 204, y: 168, w: 50, h: 24, isAvailable: true },
  { id: 'R8', number: 8, capacity: 4, section: 'restaurant', shape: 'booth', x: 140, y: 168, w: 50, h: 24, isAvailable: true },
  { id: 'R9', number: 9, capacity: 4, section: 'restaurant', shape: 'booth', x: 76, y: 168, w: 50, h: 24, isAvailable: true },

  // Below the L partition, right to left: 13, 14, 15
  { id: 'R13', number: 13, capacity: 4, section: 'restaurant', shape: 'booth', x: 228, y: 250, w: 50, h: 24, isAvailable: true },
  { id: 'R14', number: 14, capacity: 4, section: 'restaurant', shape: 'booth', x: 154, y: 250, w: 50, h: 24, isAvailable: true },
  { id: 'R15', number: 15, capacity: 4, section: 'restaurant', shape: 'booth', x: 80, y: 250, w: 50, h: 24, isAvailable: true },

  // Column along the inside of the vertical partition
  { id: 'R16', number: 16, capacity: 4, section: 'restaurant', shape: 'circle', x: 252, y: 312, w: 34, h: 34, isAvailable: true },
  { id: 'R17', number: 17, capacity: 4, section: 'restaurant', shape: 'circle', x: 252, y: 362, w: 34, h: 34, isAvailable: true },
  { id: 'R18', number: 18, capacity: 4, section: 'restaurant', shape: 'circle', x: 252, y: 412, w: 34, h: 34, isAvailable: true },

  // Left interior / entrance
  { id: 'R19', number: 19, capacity: 8, section: 'restaurant', shape: 'booth', x: 98, y: 400, w: 96, h: 28, isAvailable: true },

  // Bottom enclave banquet table
  { id: 'R20', number: 20, capacity: 11, section: 'restaurant', shape: 'oval', x: 230, y: 508, w: 210, h: 38, isAvailable: true },
];

export const GARDEN_TABLES: FloorTable[] = [
  // Left 4-tops
  { id: 'G1', number: 1, capacity: 4, section: 'garden', shape: 'booth', x: 195, y: 785, w: 34, h: 22, isAvailable: true },
  { id: 'G2', number: 2, capacity: 4, section: 'garden', shape: 'booth', x: 195, y: 900, w: 34, h: 22, isAvailable: true },
  { id: 'G3', number: 3, capacity: 4, section: 'garden', shape: 'booth', x: 195, y: 1015, w: 34, h: 22, isAvailable: true },

  // Central round tables
  { id: 'G4', number: 4, capacity: 6, section: 'garden', shape: 'circle', x: 275, y: 810, w: 38, h: 38, isAvailable: true },
  { id: 'G5', number: 5, capacity: 6, section: 'garden', shape: 'circle', x: 275, y: 930, w: 38, h: 38, isAvailable: true },
  { id: 'G6', number: 6, capacity: 6, section: 'garden', shape: 'circle', x: 275, y: 1050, w: 38, h: 38, isAvailable: true },
  { id: 'G7', number: 7, capacity: 6, section: 'garden', shape: 'circle', x: 345, y: 810, w: 38, h: 38, isAvailable: true },
  { id: 'G8', number: 8, capacity: 6, section: 'garden', shape: 'circle', x: 345, y: 930, w: 38, h: 38, isAvailable: true },
  { id: 'G9', number: 9, capacity: 6, section: 'garden', shape: 'circle', x: 345, y: 1050, w: 38, h: 38, isAvailable: true },

  // Right edge / hedge booths
  { id: 'G10', number: 10, capacity: 4, section: 'garden', shape: 'booth', x: 378, y: 790, w: 36, h: 22, isAvailable: true },
  { id: 'G11', number: 11, capacity: 4, section: 'garden', shape: 'booth', x: 378, y: 905, w: 36, h: 22, isAvailable: true },
  { id: 'G12', number: 12, capacity: 4, section: 'garden', shape: 'booth', x: 378, y: 1020, w: 36, h: 22, isAvailable: true },
];

export const ALL_TABLES = [...RESTAURANT_TABLES, ...GARDEN_TABLES];
export const SECTION_LABEL: Record<Section, string> = {
  restaurant: 'Restaurant Dine',
  garden: 'Garden Dine',
};
export const SECTION_TIME_SLOTS = ['7:30 – 8:30', '8:30 – 9:30', '9:30 – 10:30'];
