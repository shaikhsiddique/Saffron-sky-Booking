export type ChairTone = 'cream' | 'teal' | 'terracotta';

const TONE = {
  cream: { seat: 'url(#seat-fabric)', back: 'url(#tuft-cream)', stroke: '#a6841a' },
  teal: { seat: 'url(#teal-leather)', back: 'url(#teal-leather)', stroke: '#143f3c' },
  terracotta: { seat: 'url(#terra-leather)', back: 'url(#terra-leather)', stroke: '#7a2e1e' },
};

/** Top-down tub chair with upholstery. */
export function Chair({
  x,
  y,
  r = 4.8,
  rotate = 0,
  tone = 'cream',
}: {
  x: number;
  y: number;
  r?: number;
  rotate?: number;
  tone?: ChairTone;
}) {
  const w = r * 2.05;
  const seatH = r * 1.35;
  const backH = r * 0.78;
  const c = TONE[tone];

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} filter="url(#soft-shadow)">
      <rect
        x={-w / 2}
        y={-seatH / 2 - backH + 1}
        width={w}
        height={backH}
        rx={2.2}
        fill={c.back}
        stroke={c.stroke}
        strokeWidth="1.15"
      />
      <rect
        x={-w / 2 + 0.4}
        y={-seatH / 2 + 1}
        width={w - 0.8}
        height={seatH}
        rx={2}
        fill={c.seat}
        stroke={c.stroke}
        strokeWidth="1.15"
      />
    </g>
  );
}
