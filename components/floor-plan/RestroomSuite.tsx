import { WALL, THIN } from './colors';

function Commode({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {/* Water tank */}
      <rect
        x={cx - 10}
        y={cy - 6.5}
        width={4.5}
        height={13}
        rx={1}
        fill="#ffffff"
        stroke={THIN}
        strokeWidth="0.9"
      />
      {/* Toilet bowl base & seat */}
      <ellipse
        cx={cx + 0.5}
        cy={cy}
        rx={7}
        ry={5.5}
        fill="#ffffff"
        stroke={THIN}
        strokeWidth="0.9"
      />
      {/* Seat inner hole */}
      <ellipse
        cx={cx + 1.5}
        cy={cy}
        rx={4.5}
        ry={3.2}
        fill="#f4f1ea"
        stroke="#aaa"
        strokeWidth="0.6"
      />
      {/* Flush button */}
      <circle cx={cx - 7.5} cy={cy} r={0.9} fill="#888" />
    </g>
  );
}

function MiniSink({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={7} height={7} rx={1.5} fill="#fff" stroke={THIN} strokeWidth="0.8" />
      <ellipse cx={x + 3.5} cy={y + 3.5} rx={2.4} ry={2.4} fill="#e9f3f7" stroke="#999" strokeWidth="0.5" />
      <circle cx={x + 3.5} cy={y + 3.5} r={0.6} fill="#777" />
      <path d={`M ${x + 3.5} ${y + 1} L ${x + 3.5} ${y + 2.5}`} stroke="#666" strokeWidth="0.7" />
    </g>
  );
}

export function RestroomSuite() {
  return (
    <g id="restroom-suite">
      {/* Tiled floor for restroom area */}
      <rect
        x={28}
        y={254}
        width={77}
        height={54}
        fill="url(#restroom-tile)"
        stroke={WALL}
        strokeWidth="2.5"
      />

      {/* Internal partition dividing the two cubicles */}
      <line x1={28} y1={281} x2={73} y2={281} stroke={WALL} strokeWidth="1.6" />

      {/* Cubicle front partition wall */}
      <line x1={73} y1={254} x2={73} y2={264} stroke={WALL} strokeWidth="1.6" />
      <line x1={73} y1={278} x2={73} y2={284} stroke={WALL} strokeWidth="1.6" />
      <line x1={73} y1={301} x2={73} y2={308} stroke={WALL} strokeWidth="1.6" />

      {/* Cubicle 1 (Top) WC commode & sink */}
      <Commode cx={41} cy={267.5} />
      <MiniSink x={63} y={256} />

      {/* Cubicle 1 Door & Swing Arc */}
      <path
        d="M 73 264 A 14 14 0 0 1 59 278"
        fill="none"
        stroke="#8e897e"
        strokeWidth="0.75"
        strokeDasharray="1.5 1.5"
      />
      <line x1={73} y1={264} x2={60} y2={277} stroke={THIN} strokeWidth="1.2" />

      {/* Cubicle 2 (Bottom) WC commode & sink */}
      <Commode cx={41} cy={294.5} />
      <MiniSink x={63} y={300} />

      {/* Cubicle 2 Door & Swing Arc */}
      <path
        d="M 73 284 A 14 14 0 0 1 59 298"
        fill="none"
        stroke="#8e897e"
        strokeWidth="0.75"
        strokeDasharray="1.5 1.5"
      />
      <line x1={73} y1={284} x2={60} y2={297} stroke={THIN} strokeWidth="1.2" />

      {/* Foyer Vanity / Handwash inside Restroom */}
      <g>
        <rect x={88} y={271} width={15} height={20} rx={1.5} fill="#ffffff" stroke={THIN} strokeWidth="0.9" />
        <ellipse cx={95.5} cy={281} rx={4.5} ry={6.5} fill="#e9f3f7" stroke="#999" strokeWidth="0.6" />
        <circle cx={95.5} cy={281} r={0.9} fill="#666" />
        <line x1={101} y1={281} x2={98} y2={281} stroke="#555" strokeWidth="0.9" />
      </g>

      {/* Restroom Entrance Door into Foyer with 90 deg swing arc */}
      <g>
        <path
          d="M 76 254 A 18 18 0 0 1 94 236"
          fill="none"
          stroke="#746f65"
          strokeWidth="0.85"
          strokeDasharray="2 1.5"
        />
        <line x1={76} y1={254} x2={93} y2={237} stroke={THIN} strokeWidth="1.4" />
      </g>

      {/* Signage text */}
      <text
        x={50}
        y={249}
        textAnchor="middle"
        fontSize="6"
        fontWeight="600"
        fill="#777166"
        letterSpacing="0.8"
      >
        RESTROOMS
      </text>
    </g>
  );
}
