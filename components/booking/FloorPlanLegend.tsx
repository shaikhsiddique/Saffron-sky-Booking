export function FloorPlanLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-[#756e62]">
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-[#c9a227] bg-white" /> Available for party size</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#2e7d4f]" /> Selected</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#c0392b] opacity-40" /> Booked (this slot)</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#cfcac1]" /> Other capacity tier</span>
    </div>
  );
}
