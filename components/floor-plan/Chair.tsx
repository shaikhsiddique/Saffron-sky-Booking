export function Chair({ x, y, r = 5, rotate = 0 }: { x: number; y: number; r?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={0.95}>
      <ellipse cx="0" cy="0" rx={r + 1} ry={r - 1} fill="none" stroke="#898989" strokeWidth="1.5" />
      <line x1={-r - 1} y1={r + 1} x2={r + 1} y2={r + 1} stroke="#898989" strokeWidth="1.3" />
    </g>
  );
}
