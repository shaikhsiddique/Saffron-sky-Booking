import { GREEN, GREEN_DARK } from './colors';

type Point = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function sampleLine(x1: number, y1: number, x2: number, y2: number, spacing = 7): Point[] {
  const d = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(1, Math.round(d / spacing));
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return { x: lerp(x1, x2, t), y: lerp(y1, y2, t) };
  });
}

export function sampleQuad(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  steps = 18,
): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const u = 1 - t;
    return {
      x: u * u * x0 + 2 * u * t * cx + t * t * x1,
      y: u * u * y0 + 2 * u * t * cy + t * t * y1,
    };
  });
}

export function ScallopedHedge({
  points,
  r = 7,
}: {
  points: Point[];
  r?: number;
}) {
  return (
    <g>
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={r}
          fill={GREEN}
          stroke={GREEN_DARK}
          strokeWidth="1.15"
        />
      ))}
    </g>
  );
}
