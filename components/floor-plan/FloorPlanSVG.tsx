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
  const handleClosePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const panel = mobilePanelRef.current;

    if (!panel) {
      setMobilePanelOpen(false);
      setMobileTable(null);
      return;
    }

    /*
     * Prevent multiple close animations.
     */
    gsap.killTweensOf(panel);

    /*
     * Tell React it is closing.
     */
    setMobilePanelOpen(false);

    /*
     * Animate out.
     */
    gsap.to(panel, {
      autoAlpha: 0,
      y: 40,
      duration: 0.3,
      ease: "expo.in",
      pointerEvents: "none",
      onComplete: () => {
        /*
         * Only clear the stored table AFTER
         * the animation has finished.
         */
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
    width={500}
    height={570}
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
          max-w-[360px]
          -translate-x-1/2
          overflow-hidden
          rounded-2xl
          border
          border-[#d8d0c2]
          bg-white
          shadow-[0_16px_45px_rgba(0,0,0,0.25)]
          md:hidden
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
                IMAGE
            ================================================= */}

           
<div className="relative flex h-[160px] w-full items-center justify-center overflow-hidden">
  <img
    src={mobileTable.image}
    alt={`Table ${mobileTable.number}`}
    className="block h-[160px] w-auto max-w-full object-contain"
    onError={(e) => {
      e.currentTarget.src = "/tables/dummy.jpg";
    }}
  />

  {/* =================================================
      CLOSE BUTTON
  ================================================= */}

  <button
    type="button"
    aria-label="Close table information"
    onClick={handleClosePanel}
    className="
      absolute
      right-2
      top-2
      z-20
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      bg-black/70
      text-2xl
      font-normal
      leading-none
      text-white
      shadow-lg
      backdrop-blur-sm
      transition-all
      hover:bg-black/85
      active:scale-90
    "
  >
    ×
  </button>
</div>



            {/* =================================================
                TABLE INFORMATION
            ================================================= */}

            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#302e2a]">
                    Table {mobileTable.number}
                  </p>

                  <p className="mt-0.5 text-xs text-[#746f65]">
                    {mobileTable.capacity} seats
                  </p>
                </div>

                {bookedTableIds.includes(mobileTable.id) && (
                  <span
                    className="
                      shrink-0
                      rounded-full
                      bg-[#fbe9e7]
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-[#c0392b]
                    "
                  >
                    BOOKED
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
