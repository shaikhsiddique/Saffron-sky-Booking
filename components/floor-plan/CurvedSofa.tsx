import { GOLD, GOLD_DARK } from './colors';

function polar(cx: number, cy: number, r: number, a: number) {
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}

function annularPath(
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  start: number,
  sweep: number,
) {
  const end = start + sweep;
  const large = sweep > Math.PI ? 1 : 0;
  const o0 = polar(cx, cy, rOut, start);
  const o1 = polar(cx, cy, rOut, end);
  const i1 = polar(cx, cy, rIn, end);
  const i0 = polar(cx, cy, rIn, start);
  return `M ${o0.x} ${o0.y} A ${rOut} ${rOut} 0 ${large} 1 ${o1.x} ${o1.y} L ${i1.x} ${i1.y} A ${rIn} ${rIn} 0 ${large} 0 ${i0.x} ${i0.y} Z`;
}

export function CurvedSofa({
  cx,
  cy,
  r,
  start,
  sweep,
  seats,
  selected,
}: {
  cx: number;
  cy: number;
  r: number;
  start: number;
  sweep: number;
  seats: number;
  selected: boolean;
}) {
  const rOut = r + 4;
  const rIn = r - 13;
  const rBack = rOut + 4.5;
  const stroke = selected ? '#14542f' : GOLD_DARK;
  const fill = selected ? '#cfe8d4' : 'url(#sofa-fabric)';
  const backFill = selected ? '#2e7d4f' : 'url(#sofa-shade)';
  const n = Math.max(seats, 2);

  const arm = (a: number) => {
    const mid = polar(cx, cy, (rOut + rIn) / 2, a);
    return (
      <ellipse
        cx={mid.x}
        cy={mid.y}
        rx={6}
        ry={5}
        fill={backFill}
        stroke={stroke}
        strokeWidth="1.4"
        transform={`rotate(${(a * 180) / Math.PI + 90} ${mid.x} ${mid.y})`}
      />
    );
  };

  return (
    <g pointerEvents="none">
      <path
        d={annularPath(cx, cy, rBack, rOut - 1, start, sweep)}
        fill={backFill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d={annularPath(cx, cy, rOut, rIn, start, sweep)}
        fill={fill}
        stroke={GOLD}
        strokeWidth="1.6"
      />
      {Array.from({ length: n - 1 }, (_, i) => {
        const a = start + (sweep * (i + 1)) / n;
        const a0 = polar(cx, cy, rIn + 1, a);
        const a1 = polar(cx, cy, rOut - 1, a);
        return (
          <line
            key={i}
            x1={a0.x}
            y1={a0.y}
            x2={a1.x}
            y2={a1.y}
            stroke={GOLD_DARK}
            strokeWidth="1"
            opacity="0.55"
          />
        );
      })}
      {arm(start)}
      {arm(start + sweep)}
    </g>
  );
}
