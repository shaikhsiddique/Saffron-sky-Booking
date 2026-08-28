import { sampleLine, sampleQuad, ScallopedHedge } from './Hedge';
import { WALL, WATER } from './colors';

function Column({ x, y }: { x: number; y: number }) {
  const s = 9;
  return (
    <g>
      <rect x={x - s / 2} y={y - s / 2} width={s} height={s} fill="#fff" stroke={WALL} strokeWidth="1.4" />
      <line x1={x - s / 2 + 1} y1={y - s / 2 + 1} x2={x + s / 2 - 1} y2={y + s / 2 - 1} stroke={WALL} strokeWidth="1" />
      <line x1={x + s / 2 - 1} y1={y - s / 2 + 1} x2={x - s / 2 + 1} y2={y + s / 2 - 1} stroke={WALL} strokeWidth="1" />
    </g>
  );
}

export function RestaurantLayout() {
  const outerHedge = [
    ...sampleLine(32, 26, 298, 26, 6.5),
    ...sampleQuad(298, 26, 362, 22, 404, 72, 16).slice(1),
    ...sampleQuad(404, 72, 434, 122, 434, 178, 12).slice(1),
    ...sampleLine(434, 178, 434, 428, 6.5).slice(1),
  ];

  const lHedge = [
    ...sampleLine(50, 198, 302, 198, 6.5),
    ...sampleLine(302, 198, 302, 424, 6.5).slice(1),
  ];

  return (
    <g>
      <defs>
        <pattern id="water-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#c5e8f4" strokeWidth="0.7" />
        </pattern>
      </defs>

      <rect width="460" height="570" fill="#ffffff" />

      {/* Outer black walls */}
      <path
        d="M 28 20 L 300 20 Q 360 20 400 70 Q 430 118 430 175 L 430 430 L 360 430 L 360 545 L 100 545 L 100 430 L 28 430 Z"
        fill="#ffffff"
        stroke={WALL}
        strokeWidth="5"
      />

      {/* Scalloped green hedge — outer curve */}
      <ScallopedHedge points={outerHedge} r={7} />

      {/* Scalloped green L-shaped divider */}
      <ScallopedHedge points={lHedge} r={7.2} />

      {/* Blue water / fountain in the curved corner */}
      <g transform="rotate(32 408 56)">
        <ellipse cx="408" cy="56" rx="24" ry="13" fill={WATER} stroke="#6eb4d4" strokeWidth="1.4" />
        <ellipse cx="408" cy="56" rx="24" ry="13" fill="url(#water-grid)" />
      </g>

      {/* Left entrance cut */}
      <line x1="28" y1="348" x2="28" y2="392" stroke="#ffffff" strokeWidth="10" />
      <path d="M 28 348 Q 52 370 28 392" fill="none" stroke="#4b4b4b" strokeWidth="1.5" />

      {/* Structural columns */}
      <Column x={54} y={118} />
      <Column x={210} y={118} />
      <Column x={54} y={330} />
      <Column x={210} y={330} />
      <Column x={362} y={330} />

      <text x="230" y="14" textAnchor="middle" fontSize="9" fill="#7b7b72" letterSpacing="1.7">
        RESTAURANT DINE
      </text>
    </g>
  );
}
