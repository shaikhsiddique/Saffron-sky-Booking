import { SECTION_LABEL, type Section } from '@/lib/tables';

export function SectionTabs({
  section,
  onSectionChange,
  selectedTable
}: {
  section: Section;
  selectedTable: String;
  onSectionChange: (next: Section) => void;
}) {
  const sectionImage =
    section === 'restaurant'
      ? 'https://res.cloudinary.com/daai6xwtd/image/upload/v1788697767/restaurant_yvohsy.jpg'
      : 'https://res.cloudinary.com/daai6xwtd/image/upload/v1788697752/garden_qe3zkg.jpg';

  const displayLabel = (s: Section) =>
    s === 'restaurant' ? 'Fine Dine' : SECTION_LABEL[s];

  return (
    <div className="mb-4 w-full">
      <div className="flex flex-wrap justify-center gap-2">
        {(['restaurant', 'garden'] as Section[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSectionChange(s)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              section === s
                ? 'bg-[#263126] text-white'
                : 'bg-[#ece8df] text-[#665f53]'
            }`}
          >
            {displayLabel(s)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex w-full justify-center">
        <img
          src={sectionImage}
          alt={`${displayLabel(section)} preview`}
          className="block h-auto max-w-full rounded-xl object-contain md:max-w-[50%]"
        />
      </div>
    </div>
  );
}