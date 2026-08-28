import type { FloorTable, Section } from '@/lib/tables';
import { FurnitureDefs } from './FurnitureDefs';
import { GardenLayout } from './GardenLayout';
import { RenderTable } from './RenderTable';
import { RestaurantLayout } from './RestaurantLayout';

const VIEW = {
  restaurant: { box: '0 0 460 570', width: 460, height: 570 },
  garden: { box: '140 660 370 610', width: 560, height: 1380 },
} as const;

export function FloorPlanSVG({
  section,
  tables,
  selectedTable,
  guestCount,
  onSelect,
}: {
  section: Section;
  tables: FloorTable[];
  selectedTable: string;
  guestCount: number;
  onSelect: (id: string) => void;
}) {
  const view = VIEW[section];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#c9c1b4] bg-white p-2">
      <svg
        viewBox={view.box}
        className="mx-auto block h-auto min-w-[320px] select-none"
        style={{ width: '100%', maxWidth: 620 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <FurnitureDefs />
        <rect width={view.width} height={view.height} fill="#ffffff" />

        {section === 'restaurant' ? <RestaurantLayout /> : <GardenLayout />}

        {tables.map((t) => (
          <RenderTable key={t.id} t={t} guestCount={guestCount} selectedTable={selectedTable} onSelect={onSelect} />
        ))}
      </svg>
    </div>
  );
}
