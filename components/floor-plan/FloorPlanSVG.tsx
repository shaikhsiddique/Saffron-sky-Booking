import { useRef, useState } from 'react';
import type { FloorTable, Section } from '@/lib/tables';
import { FurnitureDefs } from './FurnitureDefs';
import { GardenLayout } from './GardenLayout';
import { RenderTable } from './RenderTable';
import { RestaurantLayout } from './RestaurantLayout';

const VIEW = {
  restaurant: { box: '0 0 500 570', width: 500, height: 570 },
  garden: { box: '140 660 370 610', width: 560, height: 1380 },
} as const;

export function FloorPlanSVG({
  section,
  tables,
  selectedTable,
  guestCount,
  bookedTableIds = [],
  onSelect,
}: {
  section: Section;
  tables: FloorTable[];
  selectedTable: string;
  guestCount: number;
  bookedTableIds?: string[];
  onSelect: (id: string) => void;
}) {
  const view = VIEW[section];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<FloorTable | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-visible rounded-xl border border-[#c9c1b4] bg-[#f5f5f0] p-2"
      onMouseMove={(e) => {
        const box = wrapRef.current?.getBoundingClientRect();
        if (!box) return;
        setCursor({ x: e.clientX - box.left, y: e.clientY - box.top });
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <svg
        viewBox={view.box}
        className="mx-auto block h-auto min-w-[340px] select-none transition-all duration-300"
        style={{ width: '100%', maxWidth: 720 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <FurnitureDefs />
        <rect width={view.width} height={view.height} fill="#f5f5f0" />

        {section === 'restaurant' ? <RestaurantLayout /> : <GardenLayout />}

        {tables.map((t) => (
          <RenderTable
            key={t.id}
            t={t}
            guestCount={guestCount}
            selectedTable={selectedTable}
            isBooked={bookedTableIds.includes(t.id)}
            onSelect={onSelect}
            onHover={setHovered}
          />
        ))}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-30 w-52 overflow-hidden rounded-xl border border-[#d8d0c2] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          style={{
            left: Math.min(cursor.x + 16, (wrapRef.current?.clientWidth ?? 320) - 220),
            top: Math.max(8, cursor.y - 148),
          }}
        >
          <img
            src={hovered.image}
            alt={`Table ${hovered.number}`}
            className="h-32 w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/tables/dummy.jpg';
            }}
          />
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-[#302e2a]">Table {hovered.number}</p>
            <p className="text-xs text-[#746f65]">
              {hovered.capacity} seats
              {bookedTableIds.includes(hovered.id) && (
                <span className="ml-1 font-semibold text-[#c0392b]">· BOOKED</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
