
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
  
  return (
    <div className="mb-4 w-full">
      {/* SECTION BUTTONS */}
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
            {SECTION_LABEL[s]}
          </button>
        ))}
      </div>

      {/* SECTION IMAGE */}
      <div className="mt-4 flex w-full  justify-center">
        <img
          src={sectionImage}
          alt={`${SECTION_LABEL[section]} preview`}
          className="block h-auto max-w-full md:max-w-[50%] rounded-xl object-contain"
        />
      </div>
    </div>
  );
}
