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

const LEAF = ['#0a6b14', '#128c1e', '#17b428', '#2ad63c', '#0e7a18'];
const BLOOMS = ['#e85d8a', '#c44ad0', '#ff6b5b', '#f2c14e', '#ff8fab', '#9b59d0', '#fff1c9'];

function FoliageClump({ x, y, r, i }: { x: number; y: number; r: number; i: number }) {
  const a = (i * 2.4) % (Math.PI * 2);
  const dx = Math.cos(a) * r * 0.35;
  const dy = Math.sin(a * 1.3) * r * 0.28;
  return (
    <g>
      <ellipse
        cx={x + dx * 0.4}
        cy={y + dy * 0.3}
        rx={r + 1.2}
        ry={r * 0.82}
        fill={LEAF[i % 2]}
        stroke={GREEN_DARK}
        strokeWidth="0.7"
        transform={`rotate(${(i * 17) % 50 - 25} ${x} ${y})`}
      />
      <circle cx={x} cy={y} r={r * 0.78} fill={LEAF[(i + 2) % LEAF.length]} />
      <circle cx={x - dx} cy={y - dy} r={r * 0.55} fill={LEAF[(i + 4) % LEAF.length]} opacity="0.9" />
      <circle cx={x + r * 0.25} cy={y - r * 0.2} r={r * 0.28} fill="#7cf08a" opacity="0.45" />
    </g>
  );
}

function Flower({ x, y, i }: { x: number; y: number; i: number }) {
  const color = BLOOMS[i % BLOOMS.length];
  const s = 1.7 + (i % 3) * 0.25;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={deg}
            cx={Math.cos(rad) * s}
            cy={Math.sin(rad) * s}
            rx={s * 0.7}
            ry={s * 0.42}
            fill={color}
            stroke="#fff8"
            strokeWidth="0.15"
            transform={`rotate(${deg} ${Math.cos(rad) * s} ${Math.sin(rad) * s})`}
          />
        );
      })}
      <circle r={s * 0.45} fill="#f6d45a" stroke="#d4a017" strokeWidth="0.25" />
    </g>
  );
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
        <FoliageClump key={`l-${i}`} x={p.x} y={p.y} r={r} i={i} />
      ))}
      {points.map((p, i) => {
        if (i % 3 !== 0) return null;
        const wobble = ((i * 13) % 7) - 3;
        return (
          <Flower
            key={`f-${i}`}
            x={p.x + (i % 2 === 0 ? -2.2 : 2.4)}
            y={p.y - 3.2 + wobble * 0.3}
            i={i}
          />
        );
      })}
    </g>
  );
}
