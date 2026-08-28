import { WALL } from './colors';

export function RestaurantLayout() {
  return (
    <g>
      {/* Outer walls — rectangle with rounded top-right corner */}
      <path
        d="M 28 20 L 300 20 Q 360 20 400 70 Q 430 118 430 175 L 430 430 L 360 430 L 360 545 L 100 545 L 100 430 L 28 430 Z"
        fill="none"
        stroke={WALL}
        strokeWidth="6"
      />

      {/* L-shaped central partition */}
      <path
        d="M 48 198 L 302 198 L 302 428"
        fill="none"
        stroke="#9a9a9a"
        strokeWidth="16"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      <path
        d="M 48 198 L 302 198 L 302 428"
        fill="none"
        stroke="#d0d0d0"
        strokeWidth="8"
        strokeLinejoin="miter"
      />

      {/* Left entrance cut */}
      <line x1="28" y1="348" x2="28" y2="392" stroke="#fffdf8" strokeWidth="10" />
      <path d="M 28 348 Q 52 370 28 392" fill="none" stroke="#4b4b4b" strokeWidth="1.5" />

      <text x="230" y="36" textAnchor="middle" fontSize="10" fill="#7b7b72" letterSpacing="1.7">
        RESTAURANT DINE
      </text>
    </g>
  );
}
