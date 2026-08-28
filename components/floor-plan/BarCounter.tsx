import { GOLD, GOLD_DARK, THIN, WALL } from './colors';

function BarStool({ cx, cy, rotate = 0 }: { cx: number; cy: number; rotate?: number }) {
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      {/* Outer seat ring */}
      <circle cx={cx} cy={cy} r={5} fill="#f4ece1" stroke={GOLD_DARK} strokeWidth="0.9" />
      {/* Tufted cushion */}
      <circle cx={cx} cy={cy} r={3.6} fill="#cca854" stroke="#a38234" strokeWidth="0.6" />
      {/* Backrest curved arc */}
      <path
        d={`M ${cx - 4.2} ${cy + 2.2} A 4.8 4.8 0 0 0 ${cx + 4.2} ${cy + 2.2}`}
        fill="none"
        stroke="#4a3e2a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
}

export function BarCounter({ x = 188, y = 254 }: { x?: number; y?: number }) {
  return (
    <g id="bar-counter">
      {/* Inner service floor area */}
      <rect
        x={x}
        y={y}
        width={56}
        height={132}
        fill="#f7f6f2"
        stroke="none"
      />

      {/* Back bar counter / Prep work surface along the left wall */}
      <rect
        x={x}
        y={y + 18}
        width={13}
        height={114}
        fill="#ede4d4"
        stroke={THIN}
        strokeWidth="1"
      />
      {/* Bar prep sink */}
      <rect x={x + 2} y={y + 36} width={9} height={12} rx={1.5} fill="#fff" stroke="#999" strokeWidth="0.7" />
      <ellipse cx={x + 6.5} cy={y + 42} rx={3} ry={4.2} fill="#dff0f7" stroke="#b2c8d2" strokeWidth="0.5" />
      <circle cx={x + 6.5} cy={y + 42} r={0.7} fill="#555" />

      {/* POS / Register on back bar */}
      <rect x={x + 2} y={y + 80} width={9} height={8} rx={1} fill="#504c46" stroke="#2b2824" strokeWidth="0.7" />
      <rect x={x + 3.5} y={y + 81.5} width={6} height={5} fill="#94d0b8" />

      {/* Beverage Taps / Espresso unit */}
      <rect x={x + 3} y={y + 104} width={7} height={14} rx={1.5} fill="#e4dbcc" stroke="#777" strokeWidth="0.7" />
      <circle cx={x + 6.5} cy={y + 108} r={1.2} fill="#888" />
      <circle cx={x + 6.5} cy={y + 114} r={1.2} fill="#888" />

      {/* Main Front Bar Countertop - L-shape with rounded outer corner */}
      {/* Path tracing the thick polished countertop */}
      <path
        d={`
          M ${x} ${y}
          L ${x + 40} ${y}
          Q ${x + 54} ${y} ${x + 54} ${y + 14}
          L ${x + 54} ${y + 128}
          Q ${x + 54} ${y + 132} ${x + 50} ${y + 132}
          L ${x + 38} ${y + 132}
          Q ${x + 38} ${y + 128} ${x + 38} ${y + 124}
          L ${x + 38} ${y + 28}
          Q ${x + 38} ${y + 16} ${x + 26} ${y + 16}
          L ${x} ${y + 16}
          Z
        `}
        fill="url(#bar-top)"
        stroke={GOLD_DARK}
        strokeWidth="1.4"
      />

      {/* Inner highlight line along front edge */}
      <path
        d={`
          M ${x + 2} ${y + 3}
          L ${x + 38} ${y + 3}
          Q ${x + 51} ${y + 3} ${x + 51} ${y + 16}
          L ${x + 51} ${y + 126}
        `}
        fill="none"
        stroke="#fff"
        strokeWidth="0.8"
        opacity="0.8"
      />

      {/* Bar Stools along the outer edge */}
      {/* Top Stools */}
      <BarStool cx={x + 16} cy={y - 7} rotate={180} />
      <BarStool cx={x + 34} cy={y - 7} rotate={180} />

      {/* Corner Stool */}
      <BarStool cx={x + 58} cy={y + 3} rotate={-135} />

      {/* Vertical Stools facing left toward bar */}
      <BarStool cx={x + 61} cy={y + 26} rotate={-90} />
      <BarStool cx={x + 61} cy={y + 48} rotate={-90} />
      <BarStool cx={x + 61} cy={y + 70} rotate={-90} />
      <BarStool cx={x + 61} cy={y + 92} rotate={-90} />
      <BarStool cx={x + 61} cy={y + 114} rotate={-90} />

      {/* Service Swing Gate Door into Bar at bottom */}
      <g>
        <path
          d={`M ${x + 13} ${y + 132} A 18 18 0 0 1 ${x + 31} ${y + 150}`}
          fill="none"
          stroke="#746f65"
          strokeWidth="0.75"
          strokeDasharray="1.5 1.5"
        />
        <line x1={x + 13} y1={y + 132} x2={x + 30} y2={y + 149} stroke={THIN} strokeWidth="1.2" />
      </g>

      {/* Bar Text Label */}
      <text
        x={x + 46}
        y={y + 76}
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="700"
        fill="#5a4928"
        letterSpacing="1.2"
        transform={`rotate(90 ${x + 46} ${y + 76})`}
      >
        COCKTAIL BAR
      </text>
    </g>
  );
}
