import React from 'react';
import type { ChairTone } from './Chair';
import { Chair } from './Chair';
import { CurvedSofa } from './CurvedSofa';
import { WallBanquette } from './WallBanquette';
import { GOLD } from './colors';
import { isTableAllowedForParty, type Facing, type FloorTable } from '@/lib/tables';

const FACING_ARC: Record<Facing, { start: number; sweep: number }> = {
  e: { start: -Math.PI / 2, sweep: Math.PI },
  w: { start: Math.PI / 2, sweep: Math.PI },
  s: { start: 0, sweep: Math.PI },
  n: { start: Math.PI, sweep: Math.PI },
  sw: { start: (Math.PI * 0.55), sweep: Math.PI * 1.05 },
  se: { start: -Math.PI * 0.45, sweep: Math.PI * 1.05 },
  nw: { start: Math.PI * 0.80, sweep: Math.PI * 1.05 },
  ne: { start: -Math.PI * 0.55, sweep: Math.PI * 1.05 },
};

const SCALE = 0.88;

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
      y={y + 2.5}
      textAnchor="middle"
      fontSize="7.2"
      fontWeight="700"
      fill={selected ? '#fff' : '#3d3428'}
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
  gap = 8,
  startIndex = 0,
) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const tone: ChairTone = (startIndex + i) % 2 === 0 ? 'teal' : 'terracotta';
    return (
      <Chair
        key={`${rotate}-${i}`}
        x={fromX + (toX - fromX) * t + outsideNx * gap}
        y={fromY + (toY - fromY) * t + outsideNy * gap}
        r={4.2}
        rotate={rotate}
        tone={tone}
      />
    );
  });
}

export function RenderTable({
  t,
  guestCount,
  selectedTable,
  isBooked = false,
  onSelect,
  onHover,
}: {
  t: FloorTable;
  guestCount: number;
  selectedTable: string;
  isBooked?: boolean;
  onSelect: (id: string) => void;
  onHover: (table: FloorTable | null) => void;
}) {
  if (!t.isAvailable) return null;

  const allowed = !isBooked && isTableAllowedForParty(t.capacity, guestCount);
  const selected = selectedTable === t.id;
  const fill = isBooked ? '#c0392b' : selected ? '#2e7d4f' : 'url(#stone-top)';
  const stroke = isBooked ? '#922b21' : selected ? '#14542f' : GOLD;

  const click = () => {
    if (isBooked || !allowed) return;
    onSelect(t.id);
  };
  const common = {
    fill,
    stroke,
    strokeWidth: selected ? 2.4 : 1.4,
    opacity: isBooked ? 0.35 : allowed || selected ? 1 : 0.32,
    style: { cursor: allowed ? 'pointer' : 'not-allowed' as const },
    onClick: click,
    onMouseEnter: () => onHover(t),
    onMouseLeave: () => onHover(null),
    role: 'button' as const,
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') click();
    },
  };

  const tw = t.w * SCALE;
  const th = t.h * SCALE;

  if (t.id === 'R19') {
    return (
      <g {...common}>
        {selected && (
          <rect
            x={t.x - 32}
            y={t.y - 28}
            width={64}
            height={56}
            rx={4}
            fill="#2e7d4f"
            opacity="0.16"
            stroke="#14542f"
            strokeWidth="1.8"
          />
        )}
        <circle cx={t.x} cy={t.y} r={10} fill={fill} stroke={stroke} strokeWidth={common.strokeWidth} />
        <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
      </g>
    );
  }

  if (t.shape === 'circle') {
    const r = tw / 2;
    const chairR = r + 8.5;
    return (
      <g {...common}>
        {[...Array(t.capacity)].map((_, i) => {
          const a = (Math.PI * 2 * i) / t.capacity - Math.PI / 2;
          return (
            <Chair
              key={i}
              x={t.x + Math.cos(a) * chairR}
              y={t.y + Math.sin(a) * chairR}
              r={4.2}
              rotate={(a * 180) / Math.PI + 90}
              tone={i % 2 === 0 ? 'teal' : 'terracotta'}
            />
          );
        })}
        {selected && <circle cx={t.x} cy={t.y} r={r + 7} fill="#2e7d4f" opacity="0.14" pointerEvents="none" />}
        <circle cx={t.x} cy={t.y} r={r} fill={fill} stroke={stroke} strokeWidth={common.strokeWidth} />
        <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
      </g>
    );
  }

  if (t.shape === 'semicircle') {
    const r = tw / 2;
    const { start, sweep } = FACING_ARC[t.facing ?? 'w'];
    const tableR = Math.max(10, r * 0.38);

    return (
      <g {...common}>
        {selected && <circle cx={t.x} cy={t.y} r={r + 7} fill="#2e7d4f" opacity="0.12" pointerEvents="none" />}
        <CurvedSofa
          cx={t.x}
          cy={t.y}
          r={r}
          start={start}
          sweep={sweep}
          seats={t.capacity}
          selected={selected}
        />
        <circle cx={t.x} cy={t.y} r={tableR} fill={fill} stroke={stroke} strokeWidth={common.strokeWidth} />
        <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
      </g>
    );
  }

  const topCount = Math.ceil(t.capacity / 2);
  const bottomCount = Math.floor(t.capacity / 2);
  const vertical = th > tw * 1.1;
  const left = t.x - tw / 2;
  const right = t.x + tw / 2;
  const top = t.y - th / 2;
  const bottom = t.y + th / 2;
  const inset = 6;
  const sofa = t.sofaSide;

  if (t.shape === 'oval') {
    return (
      <g {...common}>
        {chairsAlongSide(topCount, left + inset, top, right - inset, top, 0, 0, -1, 8.5)}
        {chairsAlongSide(bottomCount, left + inset, bottom, right - inset, bottom, 180, 0, 1, 8.5, 1)}
        <ellipse cx={t.x} cy={t.y} rx={tw / 2} ry={th / 2} fill={fill} stroke={stroke} strokeWidth={common.strokeWidth} />
        <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
      </g>
    );
  }

  return (
    <g {...common}>
      {sofa && <WallBanquette x={t.x} y={t.y} w={tw} h={th} side={sofa} selected={selected} />}
      {vertical ? (
        <>
          {sofa !== 'w' && chairsAlongSide(topCount, left, top + inset, left, bottom - inset, -90, -1, 0, 8)}
          {sofa !== 'e' && chairsAlongSide(bottomCount, right, top + inset, right, bottom - inset, 90, 1, 0, 8, 1)}
        </>
      ) : (
        <>
          {sofa !== 'n' && chairsAlongSide(topCount, left + inset, top, right - inset, top, 0, 0, -1, 8)}
          {sofa !== 's' && chairsAlongSide(bottomCount, left + inset, bottom, right - inset, bottom, 180, 0, 1, 8, 1)}
        </>
      )}
      <rect x={left} y={top} width={tw} height={th} rx="2.5" fill={fill} stroke={stroke} strokeWidth={common.strokeWidth} />
      <TableLabel x={t.x} y={t.y} number={t.number} selected={selected} />
    </g>
  );
}
