import { TAUPE } from './colors';
import type { Facing } from '@/lib/tables';

export function WallBanquette({
  x,
  y,
  w,
  h,
  side,
  selected,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  side: Facing;
  selected: boolean;
}) {
  const depth = 11;
  const fill = selected ? '#cfe8d4' : 'url(#tuft-cream)';
  const stroke = selected ? '#14542f' : TAUPE;
  let bx = x;
  let by = y;
  let bw = w;
  let bh = depth;
  let rotate = 0;

  if (side === 'n') {
    bx = x - w / 2;
    by = y - h / 2 - depth + 1;
    bw = w;
    bh = depth;
  } else if (side === 's') {
    bx = x - w / 2;
    by = y + h / 2 - 1;
    bw = w;
    bh = depth;
  } else if (side === 'w') {
    bx = x - w / 2 - depth + 1;
    by = y - h / 2;
    bw = depth;
    bh = h;
    rotate = 90;
  } else {
    bx = x + w / 2 - 1;
    by = y - h / 2;
    bw = depth;
    bh = h;
    rotate = 90;
  }

  const channels = Math.max(3, Math.round((rotate ? bh : bw) / 7));

  return (
    <g pointerEvents="none">
      <rect x={bx} y={by} width={bw} height={bh} rx="2.2" fill={fill} stroke={stroke} strokeWidth="1.2" />
      {Array.from({ length: channels - 1 }, (_, i) => {
        const t = (i + 1) / channels;
        if (rotate) {
          return (
            <line
              key={i}
              x1={bx}
              y1={by + bh * t}
              x2={bx + bw}
              y2={by + bh * t}
              stroke="#cbb892"
              strokeWidth="0.7"
              opacity="0.7"
            />
          );
        }
        return (
          <line
            key={i}
            x1={bx + bw * t}
            y1={by}
            x2={bx + bw * t}
            y2={by + bh}
            stroke="#cbb892"
            strokeWidth="0.7"
            opacity="0.7"
          />
        );
      })}
    </g>
  );
}
