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
  const rOut = r + 2;
  const rIn = r - 11;
  const rBack = rOut + 4.2;
  const stroke = selected ? '#14542f' : '#8d7b6a';
  const n = Math.max(seats, 2);

  const arm = (a: number) => {
    const mid = polar(cx, cy, (rOut + rIn) / 2, a);
    return (
      <ellipse
        cx={mid.x}
        cy={mid.y}
        rx={5}
        ry={4.2}
        fill={selected ? '#cfe8d4' : '#d2c3aa'}
        stroke={selected ? stroke : '#9e8f77'}
        strokeWidth="1.1"
        transform={`rotate(${(a * 180) / Math.PI + 90} ${mid.x} ${mid.y})`}
      />
    );
  };

  return (
    <g pointerEvents="none">
      {/* Lounge Sofa Outer Base Frame */}
      <path
        d={annularPath(cx, cy, rBack, rIn - 0.5, start, sweep)}
        fill={selected ? '#2e7d4f' : 'url(#tuft-lounge)'}
        stroke={stroke}
        strokeWidth="1.2"
      />

      {/* Raised Backrest Arc */}
      <path
        d={annularPath(cx, cy, rBack - 0.4, rOut, start, sweep)}
        fill={selected ? '#2e7d4f' : '#d8cbb5'}
        stroke={selected ? '#14542f' : '#b2a288'}
        strokeWidth="0.9"
      />

      {/* Plush Lounge Seat Cushion Surface */}
      <path
        d={annularPath(cx, cy, rOut - 0.4, rIn + 0.4, start, sweep)}
        fill={selected ? '#cfe8d4' : '#f9f5ec'}
        stroke={selected ? '#14542f' : '#c4b59b'}
        strokeWidth="0.9"
      />

      {/* Individual Cushion Dividing Lines */}
      {Array.from({ length: n - 1 }, (_, i) => {
        const a = start + (sweep * (i + 1)) / n;
        const a0 = polar(cx, cy, rIn + 0.5, a);
        const a1 = polar(cx, cy, rBack - 0.5, a);
        return (
          <line
            key={i}
            x1={a0.x}
            y1={a0.y}
            x2={a1.x}
            y2={a1.y}
            stroke={selected ? '#14542f' : '#c4b59b'}
            strokeWidth="0.9"
          />
        );
      })}

      {/* Lounge Armrests */}
      {arm(start)}
      {arm(start + sweep)}
    </g>
  );
}
