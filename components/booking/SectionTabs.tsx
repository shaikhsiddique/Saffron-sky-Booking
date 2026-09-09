import { type Section } from '@/lib/tables';

export function SectionTabs({
  section,
  onSectionChange,
  selectedTable,
  isRestaurantEnabled = true,
  isGardenEnabled = true,
}: {
  section: Section;
  selectedTable: String;
  onSectionChange: (next: Section) => void;
  isRestaurantEnabled?: boolean;
  isGardenEnabled?: boolean;
}) {
  const bothDisabled = !isRestaurantEnabled && !isGardenEnabled;

  const SECTIONS = [
    {
      id: 'restaurant' as Section,
      label: 'Fine Dine In',
      emoji: '🍽️',
      enabled: isRestaurantEnabled,
      image: 'https://res.cloudinary.com/daai6xwtd/image/upload/v1788697767/restaurant_yvohsy.jpg',
      closedMsg: 'Fine Dine In is temporarily closed',
    },
    {
      id: 'garden' as Section,
      label: 'Garden Dine',
      emoji: '🌿',
      enabled: isGardenEnabled,
      image: 'https://res.cloudinary.com/daai6xwtd/image/upload/v1788697752/garden_qe3zkg.jpg',
      closedMsg: 'Garden Dine is temporarily closed',
    },
  ];

  const enabledSections = SECTIONS.filter((s) => s.enabled);
  const onlyOneEnabled = enabledSections.length === 1;
  const activeSectionData = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];

  return (
    <div className="mb-4 w-full space-y-3">

      {/* ── Section Header ── */}
      <div className="flex items-center gap-2 pb-2 border-b border-[#ede8df]">
        <span className="text-base">🏛️</span>
        <span className="text-xs font-bold uppercase tracking-widest text-[#8b8070]">
          Choose Your Dining Area
        </span>
      </div>

      {/* ── If both sections are closed ── */}
      {bothDisabled && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="text-lg">⏸️</span>
          <span>All dining areas are currently unavailable. Please check back soon.</span>
        </div>
      )}

      {/* ── Tab Switcher (only when both are available or one is disabled) ── */}
      {!bothDisabled && (
        <div>
          {/* Show tabs only when both sections exist (even if one is disabled) */}
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map((s) => {
              const isActive = section === s.id;
              const isDisabled = !s.enabled;

              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onSectionChange(s.id)}
                  className={`
                    relative flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3
                    text-sm font-semibold transition-all duration-200
                    ${isActive && !isDisabled
                      ? 'border-[#2e7d4f] bg-gradient-to-b from-[#263126] to-[#2e7d4f] text-white shadow-md'
                      : isDisabled
                        ? 'cursor-not-allowed border-[#e0d9ce] bg-[#f5f2ed] text-[#b0a898] opacity-70'
                        : 'border-[#d8d0c2] bg-[#f0ece3] text-[#665f53] hover:border-[#c2b8a8] hover:bg-[#e8e3d8]'
                    }
                  `}
                >
                  <span className="text-xl leading-none">{s.emoji}</span>
                  <span className="text-xs font-bold">{s.label}</span>

                  {/* Active indicator dot */}
                  {isActive && !isDisabled && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#5dba7e] ring-2 ring-white" />
                  )}

                  {/* Closed badge */}
                  {isDisabled && (
                    <span className="mt-0.5 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-semibold text-amber-700 leading-none">
                      Closed
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Section Preview Card ── */}
          <div className="mt-3 overflow-hidden rounded-xl border border-[#d8d0c2] shadow-sm">
            <div className="relative">
              <img
                src={activeSectionData.image}
                alt={`${activeSectionData.label} preview`}
                className="block h-auto w-full object-cover  sm:h-[450px] transition-all duration-500"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Label badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-xs font-bold text-white">
                  {activeSectionData.emoji} {activeSectionData.label}
                </span>

                {/* Closed notice overlay on preview if current section closed */}
                {!activeSectionData.enabled && (
                  <span className="rounded-full bg-amber-500/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white">
                    ⏸ Closed
                  </span>
                )}

                {activeSectionData.enabled && (
                  <span className="rounded-full bg-emerald-600/80 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold text-white">
                    ✓ Available
                  </span>
                )}
              </div>
            </div>

            {/* Closed section notice under preview */}
            {!activeSectionData.enabled && (
              <div className="flex items-center gap-2 bg-amber-50 border-t border-amber-200 px-3 py-2 text-xs text-amber-800">
                <span>⏸️</span>
                <span>{activeSectionData.closedMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}