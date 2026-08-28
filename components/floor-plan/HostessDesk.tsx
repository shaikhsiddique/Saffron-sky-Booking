import { GOLD_DARK, THIN, TAUPE } from './colors';

export function HostessDesk({ x = 336, y = 475 }: { x?: number; y?: number }) {
  return (
    <g id="hostess-desk">
      {/* Desk Shape - L-shaped reception counter */}
      <path
        d={`
          M ${x} ${y}
          L ${x + 50} ${y}
          Q ${x + 58} ${y} ${x + 58} ${y + 8}
          L ${x + 58} ${y + 36}
          Q ${x + 58} ${y + 42} ${x + 52} ${y + 42}
          L ${x + 38} ${y + 42}
          Q ${x + 38} ${y + 36} ${x + 38} ${y + 30}
          L ${x + 38} ${y + 14}
          Q ${x + 38} ${y + 12} ${x + 36} ${y + 12}
          L ${x} ${y + 12}
          Z
        `}
        fill="url(#wood-light)"
        stroke={GOLD_DARK}
        strokeWidth="1.3"
      />

      {/* Counter raised upper ledge */}
      <path
        d={`
          M ${x} ${y + 1}
          L ${x + 48} ${y + 1}
          Q ${x + 56} ${y + 1} ${x + 56} ${y + 9}
          L ${x + 56} ${y + 35}
        `}
        fill="none"
        stroke="#faf6ee"
        strokeWidth="1"
      />

      {/* POS Register / Monitor on Desk */}
      <rect x={x + 18} y={y + 3} width={10} height={7} rx={1} fill="#403c37" stroke="#252320" strokeWidth="0.7" />
      <rect x={x + 19.5} y={y + 4.5} width={7} height={4} fill="#82b8a2" />

      {/* Guest Check-in Book */}
      <rect x={x + 32} y={y + 3} width={9} height={6} rx={0.8} fill="#ffffff" stroke="#a09483" strokeWidth="0.6" />
      <line x1={x + 36.5} y1={y + 3} x2={x + 36.5} y2={y + 9} stroke="#c5b7a5" strokeWidth="0.5" />

      {/* Hostess / Manager Swivel Chair */}
      <g transform={`translate(${x + 22}, ${y + 24})`}>
        {/* 5-Star Caster Base */}
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={0}
              y1={0}
              x2={Math.cos(rad) * 6}
              y2={Math.sin(rad) * 6}
              stroke="#555"
              strokeWidth="0.9"
            />
          );
        })}
        {/* Chair Seat Cushion */}
        <circle cx={0} cy={0} r={5} fill="#44413c" stroke="#2b2824" strokeWidth="0.8" />
        {/* Ergonomic Curved Backrest */}
        <path
          d="M -5.2 2.5 A 5.5 5.5 0 0 0 5.2 2.5"
          fill="none"
          stroke="#1e1c19"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      {/* Label */}
      <text
        x={x + 29}
        y={y + 51}
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="600"
        fill="#776f63"
        letterSpacing="0.8"
      >
        HOST & CASHIER
      </text>
    </g>
  );
}
