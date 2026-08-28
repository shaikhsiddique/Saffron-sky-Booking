import { SECTION_LABEL, type Section } from '@/lib/tables';

export function SectionTabs({
  section,
  onSectionChange,
}: {
  section: Section;
  onSectionChange: (next: Section) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2">
      {(['restaurant', 'garden'] as Section[]).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSectionChange(s)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${section === s ? 'bg-[#263126] text-white' : 'bg-[#ece8df] text-[#665f53]'}`}
        >
          {SECTION_LABEL[s]}
        </button>
      ))}
    </div>
  );
}
