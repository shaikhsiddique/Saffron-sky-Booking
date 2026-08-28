import { GREEN, GREEN_DARK } from './colors';

export function Bush({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-9" cy="0" r="7" fill={GREEN_DARK} />
      <circle cx="0" cy="-4" r="9" fill={GREEN} />
      <circle cx="9" cy="1" r="7" fill={GREEN_DARK} />
      <circle cx="2" cy="5" r="7" fill={GREEN} />
    </g>
  );
}
