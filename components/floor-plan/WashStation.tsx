import { THIN } from './colors';

export function WashStation({ x = 50, y = 205 }: { x?: number; y?: number }) {
  const w = 40;
  const h = 18;

  return (
    <g id="wash-station">
      {/* Vanity Counter Top */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2.5}
        fill="url(#marble-vanity)"
        stroke={THIN}
        strokeWidth="1.2"
      />
      {/* Mirror / Splashback line */}
      <line x1={x + 2} y1={y + 1.5} x2={x + w - 2} y2={y + 1.5} stroke="#a3998b" strokeWidth="1" />

      {/* Basin 1 (Left) */}
      <g>
        <ellipse cx={x + 11} cy={y + 9} rx={7.5} ry={5.5} fill="#ffffff" stroke="#908678" strokeWidth="0.8" />
        <ellipse cx={x + 11} cy={y + 9} rx={5.5} ry={3.8} fill="#e9f3f7" stroke="#b2c8d2" strokeWidth="0.5" />
        <circle cx={x + 11} cy={y + 9} r={0.8} fill="#555" />
        {/* Faucet */}
        <line x1={x + 11} y1={y + 2.5} x2={x + 11} y2={y + 5.5} stroke="#444" strokeWidth="1.2" />
        <circle cx={x + 11} cy={y + 2.5} r={1.1} fill="#888" />
      </g>

      {/* Basin 2 (Right) */}
      <g>
        <ellipse cx={x + 29} cy={y + 9} rx={7.5} ry={5.5} fill="#ffffff" stroke="#908678" strokeWidth="0.8" />
        <ellipse cx={x + 29} cy={y + 9} rx={5.5} ry={3.8} fill="#e9f3f7" stroke="#b2c8d2" strokeWidth="0.5" />
        <circle cx={x + 29} cy={y + 9} r={0.8} fill="#555" />
        {/* Faucet */}
        <line x1={x + 29} y1={y + 2.5} x2={x + 29} y2={y + 5.5} stroke="#444" strokeWidth="1.2" />
        <circle cx={x + 29} cy={y + 2.5} r={1.1} fill="#888" />
      </g>

      {/* Subtle label */}
      <text
        x={x + w / 2}
        y={y + h + 6.5}
        textAnchor="middle"
        fontSize="5"
        fontWeight="600"
        fill="#8a8376"
        letterSpacing="0.6"
      >
        HAND WASH
      </text>
    </g>
  );
}
