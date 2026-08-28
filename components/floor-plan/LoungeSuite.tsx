import { GOLD_DARK, TAUPE, THIN } from './colors';

export function LoungeSuite({ x = 114, y = 254 }: { x?: number; y?: number }) {
  return (
  <g
  id="lounge-suite"
  transform={`rotate(180 ${x + 32} ${y + 28})`}
>
  {/* Area Rug / Lounge Boundary */}
  <rect
    x={x}
    y={y}
    width={64}
    height={56}
    rx={4}
    fill="#f3efe6"
    stroke="#ded6c5"
    strokeWidth="0.9"
    strokeDasharray="3 2"
  />

  {/* 3-Seater Main Sofa (Top) */}
  <g>
    {/* Sofa Frame / Base */}
    <rect
      x={x + 3}
      y={y + 3}
      width={58}
      height={18}
      rx={3}
      fill="url(#tuft-lounge)"
      stroke={TAUPE}
      strokeWidth="1.1"
    />

    {/* Backrest */}
    <rect
      x={x + 4}
      y={y + 4}
      width={56}
      height={5}
      rx={1.5}
      fill="#d8cbb5"
      stroke="#b2a288"
      strokeWidth="0.8"
    />

    {/* 3 Seat Cushions */}
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={x + 6 + i * 17.5}
        y={y + 9}
        width={16.5}
        height={10.5}
        rx={2}
        fill="#f9f5ec"
        stroke="#c4b59b"
        strokeWidth="0.8"
      />
    ))}

    {/* Left & Right Armrests */}
    <rect
      x={x + 3}
      y={y + 5}
      width={3.5}
      height={15}
      rx={1.2}
      fill="#d2c3aa"
      stroke="#9e8f77"
      strokeWidth="0.7"
    />

    <rect
      x={x + 57.5}
      y={y + 5}
      width={3.5}
      height={15}
      rx={1.2}
      fill="#d2c3aa"
      stroke="#9e8f77"
      strokeWidth="0.7"
    />
  </g>

  {/* Left Armchair */}
  <g>
    <rect
      x={x + 3}
      y={y + 24}
      width={15}
      height={24}
      rx={2.5}
      fill="url(#tuft-lounge)"
      stroke={TAUPE}
      strokeWidth="1"
    />

    {/* Left Backrest */}
    <rect
      x={x + 4}
      y={y + 25}
      width={4}
      height={22}
      rx={1.2}
      fill="#d8cbb5"
      stroke="#b2a288"
      strokeWidth="0.7"
    />

    {/* Seat Cushion */}
    <rect
      x={x + 8.5}
      y={y + 26.5}
      width={8}
      height={19}
      rx={1.5}
      fill="#f9f5ec"
      stroke="#c4b59b"
      strokeWidth="0.7"
    />
  </g>

  {/* Right Armchair */}
  <g>
    <rect
      x={x + 46}
      y={y + 24}
      width={15}
      height={24}
      rx={2.5}
      fill="url(#tuft-lounge)"
      stroke={TAUPE}
      strokeWidth="1"
    />

    {/* Right Backrest */}
    <rect
      x={x + 56}
      y={y + 25}
      width={4}
      height={22}
      rx={1.2}
      fill="#d8cbb5"
      stroke="#b2a288"
      strokeWidth="0.7"
    />

    {/* Seat Cushion */}
    <rect
      x={x + 47.5}
      y={y + 26.5}
      width={8}
      height={19}
      rx={1.5}
      fill="#f9f5ec"
      stroke="#c4b59b"
      strokeWidth="0.7"
    />
  </g>

  {/* Center Coffee Table */}
  <g>
    <rect
      x={x + 22}
      y={y + 26}
      width={20}
      height={20}
      rx={2.5}
      fill="#faf7f0"
      stroke={GOLD_DARK}
      strokeWidth="1.2"
    />

    <rect
      x={x + 24}
      y={y + 28}
      width={16}
      height={16}
      rx={1.5}
      fill="#ede3ce"
      stroke="#d2be98"
      strokeWidth="0.7"
    />

    {/* Center Decorative Tray / Vase Dot */}
    <circle
      cx={x + 32}
      cy={y + 36}
      r={2.2}
      fill="#7da395"
      stroke="#48685d"
      strokeWidth="0.6"
    />
  </g>

  {/* Label */}
  <text
    x={x + 32}
    y={y + 53}
    textAnchor="middle"
    fontSize="5"
    fontWeight="600"
    fill="#827b6f"
    letterSpacing="0.6"
  >
    LOUNGE
  </text>
</g>
  );
}
