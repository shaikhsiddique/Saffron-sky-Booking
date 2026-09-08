export function FloorPlanLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-[#f5f2ec] px-3 py-2.5 text-xs text-[#756e62]">
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span className="h-3 w-3 rounded-full border-2 border-[#c9a227] bg-white" />
        Available
      </span>
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span className="h-3 w-3 rounded-full bg-[#2e7d4f]" />
        Selected
      </span>
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span className="h-3 w-3 rounded-full bg-[#c0392b] opacity-50" />
        Booked
      </span>
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span className="h-3 w-3 rounded-full bg-[#cfcac1]" />
        Wrong size
      </span>
    </div>
  );
}
