import { GOLD, GOLD_DARK } from './colors';

/** Top-down dining chair: cushioned seat + backrest. */
export function Chair({
  x,
  y,
  r = 6,
  rotate = 0,
}: {
  x: number;
  y: number;
  r?: number;
  rotate?: number;
}) {
  const w = r * 2.15;
  const seatH = r * 1.45;
  const backH = r * 0.85;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect
        x={-w / 2}
        y={-seatH / 2 - backH + 1}
        width={w}
        height={backH}
        rx={1.8}
        fill="url(#sofa-shade)"
        stroke={GOLD_DARK}
        strokeWidth="1.35"
      />
      <rect
        x={-w / 2 + 0.5}
        y={-seatH / 2 + 1.2}
        width={w - 1}
        height={seatH}
        rx={1.6}
        fill="url(#seat-fabric)"
        stroke={GOLD}
        strokeWidth="1.45"
      />
      <line
        x1={-w / 2 + 1.8}
        y1={-seatH / 2 + 1.2}
        x2={w / 2 - 1.8}
        y2={-seatH / 2 + 1.2}
        stroke={GOLD_DARK}
        strokeWidth="0.7"
        opacity="0.55"
      />
      <rect
        x={-w / 2 - 1.1}
        y={-seatH / 2 + 2}
        width={1.6}
        height={seatH * 0.55}
        rx={0.6}
        fill="url(#sofa-shade)"
        stroke={GOLD}
        strokeWidth="0.8"
      />
      <rect
        x={w / 2 - 0.5}
        y={-seatH / 2 + 2}
        width={1.6}
        height={seatH * 0.55}
        rx={0.6}
        fill="url(#sofa-shade)"
        stroke={GOLD}
        strokeWidth="0.8"
      />
    </g>
  );
}
