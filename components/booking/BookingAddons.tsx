'use client';

import React from 'react';

interface ExtraChairToggleProps {
  guestCount: number;
  hasExtraChair: boolean;
  onChange: (value: boolean) => void;
}

export function ExtraChairToggle({
  guestCount,
  hasExtraChair,
  onChange,
}: ExtraChairToggleProps) {
  // Only visible for guest size 5 or 7
  if (guestCount !== 5 && guestCount !== 7) {
    return null;
  }

  return (
    <div className="w-full rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50/60 p-3.5 shadow-sm transition-all">
      <label className="flex items-start justify-between gap-3 cursor-pointer select-none">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-200/80 text-lg shadow-inner">
            🪑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#302e2a]">
                Add Single Extra Chair
              </span>
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase tracking-wide">
                +1 Chair
              </span>
            </div>
            <p className="mt-0.5 text-xs text-amber-800 leading-tight">
              Party of {guestCount} guests. Check this to request 1 single additional chair placed at your table.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={hasExtraChair}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 rounded border-amber-300 text-[#2e7d4f] focus:ring-[#2e7d4f] accent-[#2e7d4f] cursor-pointer"
        />
      </label>
    </div>
  );
}

interface JoinTableToggleProps {
  section: string;
  guestCount: number;
  isJoinTableEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export function JoinTableToggle({
  section,
  guestCount,
  isJoinTableEnabled,
  onToggle,
}: JoinTableToggleProps) {
  // Only for Garden Dine and party size > 8
  if (section !== 'garden' || guestCount <= 8) {
    return null;
  }

  return (
    <div className="w-full rounded-xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50 to-teal-50/60 p-3.5 shadow-sm transition-all">
      <label className="flex items-start justify-between gap-3 cursor-pointer select-none">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-200/80 text-lg shadow-inner">
            🔗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-950">
                Join Table (Combined Seating)
              </span>
              <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900 uppercase tracking-wide">
                Garden Dine
              </span>
            </div>
            <p className="mt-0.5 text-xs text-emerald-800 leading-tight">
              Party of {guestCount} (&gt;8 guests). When enabled, selecting 1 table will automatically link an adjacent table for your group.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={isJoinTableEnabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 rounded border-emerald-300 text-[#2e7d4f] focus:ring-[#2e7d4f] accent-[#2e7d4f] cursor-pointer"
        />
      </label>
    </div>
  );
}
