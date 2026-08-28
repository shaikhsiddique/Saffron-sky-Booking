import { GREEN, GREEN_DARK } from './colors';

const BLOOMS = ['#e85d8a', '#c44ad0', '#ff6b5b', '#f2c14e'];

export function Bush({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-9" cy="0" r="7.5" fill="#0a6b14" />
      <circle cx="0" cy="-4" r="9.5" fill={GREEN} stroke={GREEN_DARK} strokeWidth="0.8" />
      <circle cx="9" cy="1" r="7.5" fill="#0e7a18" />
      <circle cx="2" cy="5" r="7" fill="#17b428" />
      <circle cx="-3" cy="-2" r="3.2" fill="#7cf08a" opacity="0.4" />
      <g transform="translate(-6 -6)">
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <ellipse
              key={deg}
              cx={Math.cos(rad) * 1.8}
              cy={Math.sin(rad) * 1.8}
              rx={1.3}
              ry={0.75}
              fill={BLOOMS[Math.abs(Math.round(x)) % BLOOMS.length]}
            />
          );
        })}
        <circle r="0.7" fill="#f6d45a" />
      </g>
      <g transform="translate(7 3)">
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <ellipse
              key={deg}
              cx={Math.cos(rad) * 1.5}
              cy={Math.sin(rad) * 1.5}
              rx={1.1}
              ry={0.65}
              fill="#c44ad0"
            />
          );
        })}
        <circle r="0.55" fill="#f6d45a" />
      </g>
    </g>
  );
}
