import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import type { FloorTable, Section } from "@/lib/tables";
import { FurnitureDefs } from "./FurnitureDefs";
import { GardenLayout } from "./GardenLayout";
import { RenderTable } from "./RenderTable";
import { RestaurantLayout } from "./RestaurantLayout";

const VIEW = {
  restaurant: { box: "0 0 500 570", width: 500, height: 570 },
  garden: { box: "140 660 370 610", width: 560, height: 1380 },
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
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState<FloorTable | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  /*
   * IMPORTANT:
   *
   * Do NOT use selectedTable to control the mobile panel.
   *
   * This state owns the table displayed inside the mobile panel.
   */
  const [mobileTable, setMobileTable] = useState<FloorTable | null>(null);

  /*
   * Controls whether the mobile panel is supposed to be visible.
   */
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  /*
   * Keep GSAP animations under control.
   *
   * The panel is NEVER conditionally mounted based on selectedTable.
   * This prevents React from destroying the element while GSAP is animating.
   */
  useEffect(() => {
    const panel = mobilePanelRef.current;

    if (!panel) return;

    // Kill any previous animation first.
    gsap.killTweensOf(panel);

    if (mobilePanelOpen && mobileTable) {
      gsap.set(panel, {
        autoAlpha: 1,
        y: 0,
        pointerEvents: "auto",
      });

      return;
    }

    // Closed state
    gsap.set(panel, {
      autoAlpha: 0,
      y: 40,
      pointerEvents: "none",
    });
  }, [mobilePanelOpen, mobileTable]);

  /*
   * Open animation.
   *
   * This runs AFTER the mobile table has been stored.
   */
  useEffect(() => {
    const panel = mobilePanelRef.current;

    if (!panel || !mobilePanelOpen || !mobileTable) return;

    gsap.killTweensOf(panel);

    gsap.fromTo(
      panel,
      {
        autoAlpha: 0,
        y: 40,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "expo.out",
        pointerEvents: "auto",
      },
    );
  }, [mobilePanelOpen, mobileTable]);

  /*
   * TABLE SELECT
   *
   * First store the actual table object.
   * Then notify the parent.
   *
   * The mobile panel is now completely independent
   * from future selectedTable changes.
   */
  const handleTableSelect = (id: string) => {
    const table = tables.find((t) => t.id === id);

    if (!table) return;

    /*
     * Store a snapshot of the table.
     *
     * This is the critical fix.
     */
    setMobileTable(table);

    /*
     * Open panel.
     */
    setMobilePanelOpen(true);

    /*
     * Keep existing parent selection logic.
     */
    onSelect(id);
  };

  /*
   * CLOSE MOBILE PANEL
   *
   * This is the ONLY normal way the mobile panel closes.
   */
  const handleClosePanel = (e?: { preventDefault: () => void; stopPropagation: () => void }) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const panel = mobilePanelRef.current;

    if (!panel) {
      setMobilePanelOpen(false);
      setMobileTable(null);
      return;
    }

    gsap.killTweensOf(panel);

    setMobilePanelOpen(false);

    gsap.to(panel, {
      autoAlpha: 0,
      y: 40,
      duration: 0.3,
      ease: "expo.in",
      pointerEvents: "none",
      onComplete: () => {
        setMobileTable(null);
      },
    });
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-xl border border-[#c9c1b4] bg-[#f5f5f0] p-2"
      onMouseMove={(e) => {
        const box = wrapRef.current?.getBoundingClientRect();

        if (!box) return;

        setCursor({
          x: e.clientX - box.left,
          y: e.clientY - box.top,
        });
      }}
      onMouseLeave={() => {
        setHovered(null);
      }}
    >
     

 {/* =====================================================
    FLOOR PLAN
===================================================== */}

<div className="w-full overflow-hidden">
  <svg
    viewBox={view.box}
    width={800}
    height={870}
    className="mx-auto block select-none "
    style={{
      maxWidth: "100%",
      height: "auto",
    }}
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <FurnitureDefs />

    <rect
      x={0}
      y={0}
      width={view.width}
      height={view.height}
      fill="#f5f5f0"
    />

    {section === "restaurant" ? (
      <RestaurantLayout />
    ) : (
      <GardenLayout />
    )}

    {tables.map((t) => (
      <RenderTable
        key={t.id}
        t={t}
        guestCount={guestCount}
        selectedTable={selectedTable}
        isBooked={bookedTableIds.includes(t.id)}
        onSelect={handleTableSelect}
        onHover={setHovered}
      />
    ))}
  </svg>
</div>

      {/* =====================================================
          DESKTOP HOVER PANEL
      ===================================================== */}

      {hovered && (
        <div
          className="
            pointer-events-none
            absolute
            z-30
            hidden
            w-52
            overflow-hidden
            rounded-xl
            border
            border-[#d8d0c2]
            bg-white
            shadow-[0_16px_40px_rgba(0,0,0,0.18)]
            md:block
          "
          style={{
            left: Math.min(
              cursor.x + 16,
              (wrapRef.current?.clientWidth ?? 320) - 220,
            ),
            top: Math.max(8, cursor.y - 148),
          }}
        >
          <img
            src={hovered.image}
            alt={`Table ${hovered.number}`}
            className="h-32 w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/tables/dummy.jpg";
            }}
          />

          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-[#302e2a]">
              Table {hovered.number}
            </p>

            <p className="text-xs text-[#746f65]">
              {hovered.capacity} seats
              {bookedTableIds.includes(hovered.id) && (
                <span className="ml-1 font-semibold text-[#c0392b]">
                  · BOOKED
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE TABLE PANEL
          
          IMPORTANT:
          This is ALWAYS mounted.
          
          It is NOT:
          
          {selectedTableData && (...)}
          
          React therefore cannot randomly unmount it because
          selectedTable changes.
      ===================================================== */}

      <div
        ref={mobilePanelRef}
        aria-hidden={!mobilePanelOpen}
        className="
          absolute
          bottom-3
          left-1/2
          z-50
          w-[calc(100%-24px)]
          max-w-[380px]
          -translate-x-1/2
          overflow-hidden
          rounded-2xl
          border
          border-[#d8d0c2]
          bg-white
          shadow-[0_16px_45px_rgba(0,0,0,0.28)]
        "
        style={{
          opacity: 0,
          transform: "translate(-50%, 40px)",
          pointerEvents: "none",
        }}
      >
        {mobileTable && (
          <>
            {/* =================================================
                IMAGE WITH OVERLAY
            ================================================= */}
            <div className="relative h-[150px] w-full overflow-hidden">
              <img
                src={mobileTable.image}
                alt={`Table ${mobileTable.number}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/tables/dummy.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Close button */}
              <button
                type="button"
                aria-label="Close table information"
                onClick={handleClosePanel}
                className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl font-normal leading-none text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 active:scale-90"
              >
                ×
              </button>

              {/* Table label overlay */}
              <div className="absolute bottom-3 left-3">
                <p className="text-base font-bold text-white drop-shadow">Table {mobileTable.number}</p>
                <p className="text-xs text-white/80">{mobileTable.capacity} seats</p>
              </div>

              {bookedTableIds.includes(mobileTable.id) && (
                <span className="absolute top-2 left-2 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                  BOOKED
                </span>
              )}
            </div>

            {/* =================================================
                ACTION AREA
            ================================================= */}
            <div className="px-4 py-3">
              {bookedTableIds.includes(mobileTable.id) ? (
                <p className="text-center text-sm font-medium text-red-600">
                  This table is already booked for this slot.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onSelect(mobileTable.id);
                    handleClosePanel({ preventDefault: () => {}, stopPropagation: () => {} } as any);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-[#263126] to-[#2e7d4f] py-3 text-sm font-semibold text-white shadow transition hover:from-[#1e271e] hover:to-[#256843] active:scale-[0.98]"
                >
                  ✓ Select Table {mobileTable.number}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
