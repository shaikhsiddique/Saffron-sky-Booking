import React from 'react';
import type { Facing, FloorTable } from '@/lib/tables';
import { Chair } from './Chair';
import { CurvedSofa } from './CurvedSofa';
import { FURNITURE_FILL, GOLD, GOLD_DARK } from './colors';

const FACING_ARC: Record<Facing, { start: number; sweep: number }> = {
  e: { start: -Math.PI / 2, sweep: Math.PI },
  w: { start: Math.PI / 2, sweep: Math.PI },
  s: { start: 0, sweep: Math.PI },
  n: { start: Math.PI, sweep: Math.PI },
  sw: { start: (Math.PI * 0.55), sweep: Math.PI * 1.05 },
  se: { start: -Math.PI * 0.05, sweep: Math.PI * 1.05 },
  nw: { start: Math.PI * 0.95, sweep: Math.PI * 1.05 },
  ne: { start: -Math.PI * 0.55, sweep: Math.PI * 1.05 },
};

function TableLabel({
  x,
  y,
  number,
  selected,
}: {
  x: number;
  y: number;
  number: number;
  selected: boolean;
}) {
  return (
    <text
      x={x}
      y={y + 4}
      textAnchor="middle"
      fontSize="9"
      fontWeight="700"
      fill={selected ? '#fff' : GOLD_DARK}
      pointerEvents="none"
    >
      {number}
    </text>
  );
}

function chairsAlongSide(
  count: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  rotate: number,
  outsideNx: number,
  outsideNy: number,
  gap = 12,
) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    return (
      <Chair
        key={`${rotate}-${i}`}
        x={fromX + (toX - fromX) * t + outsideNx * gap}
        y={fromY + (toY - fromY) * t + outsideNy * gap}
        rotate={rotate}
      />
    );
  });
}

export function RenderTable({
  t,
  guestCount,
  selectedTable,
  onSelect,
}: {
  t: FloorTable;
  guestCount: number;
  selectedTable: string;
  onSelect: (id: string) => void;
}) {
  if (!t.isAvailable) return null;

  const allowed = t.capacity >= guestCount;
  const selected = selectedTable === t.id;
  const fill = selected ? '#2e7d4f' : FURNITURE_FILL;
  const stroke = selected ? '#14542f' : GOLD;

  const click = () => allowed && onSelect(t.id);
  const common = {
    fill,
    stroke,
    strokeWidth: selected ? 3 : 1.8,
    opacity: allowed || selected ? 1 : 0.28,
    style: { cursor: allowed ? 'pointer' : 'not-allowed' as const },
    onClick: click,
    role: 'button' as const,
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') click();
    },
  };

  if (t.shape === 'circle') {
    const r = t.w / 2;
    const chairR = r + 14;
    return (
      <g key={t.id} {...common}>
        {[...Array(t.capacity)].map((_, i) => {
          const a = (Math.PI * 2 * i) / t.capacity - Math.PI / 2;
          return (
            <Chair
              key={i}
              x={t.x + Math.cos(a) * chairR}
              y={t.y + Math.sin(a) * chairR}
              rotate={(a * 180) / Math.PI + 90}
            />
          );
        })}
        {selected && <circle cx={t.x} cy={t.y} r={r + 12} fill="#2e7d4f" opacity="0.16" pointerEvents="none" />}
        <circle cx={t.x} cy={t.y} r={r} {...common} />
        <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
      </g>
    );
  }

  if (t.shape === 'semicircle') {
    const r = t.w / 2;
    const { start, sweep } = FACING_ARC[t.facing ?? 'w'];
    const tableR = Math.max(14, r * 0.42);

    return (
      <g key={t.id} {...common}>
        {selected && <circle cx={t.x} cy={t.y} r={r + 10} fill="#2e7d4f" opacity="0.14" pointerEvents="none" />}
        <CurvedSofa
          cx={t.x}
          cy={t.y}
          r={r}
          start={start}
          sweep={sweep}
          seats={t.capacity}
          selected={selected}
        />
        <circle cx={t.x} cy={t.y} r={tableR} {...common} />
        <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
      </g>
    );
  }

  const topCount = Math.ceil(t.capacity / 2);
  const bottomCount = Math.floor(t.capacity / 2);
  const vertical = t.h > t.w * 1.1;
  const left = t.x - t.w / 2;
  const right = t.x + t.w / 2;
  const top = t.y - t.h / 2;
  const bottom = t.y + t.h / 2;
  const inset = 8;

  if (t.shape === 'oval') {
    return (
      <g key={t.id} {...common}>
        {chairsAlongSide(topCount, left + inset, top, right - inset, top, 0, 0, -1)}
        {chairsAlongSide(bottomCount, left + inset, bottom, right - inset, bottom, 180, 0, 1)}
        <ellipse cx={t.x} cy={t.y} rx={t.w / 2} ry={t.h / 2} {...common} />
        <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
      </g>
    );
  }

  return (
    <g key={t.id} {...common}>
      {vertical ? (
        <>
          {chairsAlongSide(topCount, left, top + inset, left, bottom - inset, -90, -1, 0)}
          {chairsAlongSide(bottomCount, right, top + inset, right, bottom - inset, 90, 1, 0)}
        </>
      ) : (
        <>
          {chairsAlongSide(topCount, left + inset, top, right - inset, top, 0, 0, -1)}
          {chairsAlongSide(bottomCount, left + inset, bottom, right - inset, bottom, 180, 0, 1)}
        </>
      )}
      <rect x={left} y={top} width={t.w} height={t.h} rx="2" {...common} />
      <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
    </g>
  );
}
