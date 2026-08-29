import { BarCounter } from './BarCounter';
import { sampleLine, sampleQuad, ScallopedHedge } from './Hedge';
import { HostessDesk } from './HostessDesk';
import { LoungeSuite } from './LoungeSuite';
import { RestroomSuite } from './RestroomSuite';
import { WashStation } from './WashStation';
import { GOLD, GOLD_DARK, TAUPE, THIN, WALL, WATER } from './colors';

export function Column({ x, y, size = 9 }: { x: number; y: number; size?: number }) {
  const half = size / 2;
  return (
    <g id={`column-${x}-${y}`}>
      <rect
        x={x - half}
        y={y - half}
        width={size}
        height={size}
        fill="#ffffff"
        stroke={WALL}
        strokeWidth="1.4"
      />
      {/* Structural Cross Hatch (X) */}
      <line
        x1={x - half + 1}
        y1={y - half + 1}
        x2={x + half - 1}
        y2={y + half - 1}
        stroke={WALL}
        strokeWidth="0.9"
      />
      <line
        x1={x + half - 1}
        y1={y - half + 1}
        x2={x - half + 1}
        y2={y + half - 1}
        stroke={WALL}
        strokeWidth="0.9"
      />
    </g>
  );
}

function PartitionScreen({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c5b69c" strokeWidth="2.2" strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD_DARK} strokeWidth="1" strokeLinecap="round" />
      {/* End caps */}
      <circle cx={x1} cy={y1} r={1.6} fill="#a48d61" />
      <circle cx={x2} cy={y2} r={1.6} fill="#a48d61" />
    </g>
  );
}

function ServiceCredenza({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Cabinet box */}
      <rect x={0} y={0} width={12} height={28} rx={1.5} fill="#ede5d5" stroke={THIN} strokeWidth="0.9" />
      {/* Drawer divider lines */}
      <line x1={1} y1={9} x2={11} y2={9} stroke="#b0a592" strokeWidth="0.7" />
      <line x1={1} y1={18} x2={11} y2={18} stroke="#b0a592" strokeWidth="0.7" />
      {/* Handles */}
      <line x1={4} y1={4.5} x2={8} y2={4.5} stroke="#666" strokeWidth="0.8" />
      <line x1={4} y1={13.5} x2={8} y2={13.5} stroke="#666" strokeWidth="0.8" />
      <line x1={4} y1={22.5} x2={8} y2={22.5} stroke="#666" strokeWidth="0.8" />
      <text
        x={6}
        y={33}
        textAnchor="middle"
        fontSize="4.5"
        fontWeight="600"
        fill="#827b6e"
        letterSpacing="0.5"
      >
        SERVICE
      </text>
    </g>
  );
}

export function RestaurantLayout() {
  const outerHedge = [
    ...sampleLine(32, 24, 320, 24, 6.5),
    ...sampleQuad(320, 24, 388, 22, 428, 70, 14).slice(1),
    ...sampleQuad(428, 70, 436, 115, 436, 175, 10).slice(1),
    ...sampleLine(436, 175, 436, 432, 6.5).slice(1),
  ];

  const lHedge = [
    ...sampleLine(62, 172, 328, 172, 6.5),
    ...sampleLine(328, 172, 328, 380, 6.5).slice(1),
  ];

  return (
    <g id="restaurant-dining-layout">
      {/* Background Floor Fill */}
      <rect width="590" height="570" fill="#f5f5f0" />

      {/* Main Structural Outer Black Walls according to architectural blueprint */}
      <path
        d={`
          M 0 20
          L 326 20
          Q 388 20 424 64
          Q 434 100 434 165
          L 434 546
          L 188 546
          L 188 340
          L 105 340
          L 105 308
          L 0 308
          Z
        `}
        fill="#ffffff"
        stroke={WALL}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      {/* Inner architectural partition wall for lower private/banquet dining room */}
      <path
        d="M 188 430 L 244 430"
        fill="none"
        stroke={WALL}
        strokeWidth="3.5"
      />

      <path
        d="M 300 430 L 300 548"
        fill="none"
        stroke={WALL}
        strokeWidth="3.5"
      />
      {/* Lower Room Entrance Door with 90 deg swing arc */}
      <g>
        <path
          d="M 244 430 A 24 24 0 0 1 268 454"
          fill="none"
          stroke="#746f65"
          strokeWidth="0.85"
          strokeDasharray="2 1.5"
        />
        <line x1={244} y1={430} x2={267} y2={453} stroke={THIN} strokeWidth="1.4" />
      </g>

      {/* Booth Partition Screens along the top wall (between R1, R2, R3, R4) */}
      <PartitionScreen x1={116} y1={22} x2={116} y2={74} />
      <PartitionScreen x1={202} y1={22} x2={202} y2={74} />
      <PartitionScreen x1={278} y1={22} x2={278} y2={74} />

      {/* Booth Partition Screens extending upwards from horizontal green divider */}
      <PartitionScreen x1={120} y1={120} x2={120} y2={170} />
      <PartitionScreen x1={182} y1={120} x2={182} y2={170} />
      <PartitionScreen x1={236} y1={120} x2={236} y2={170} />
      <PartitionScreen x1={300} y1={120} x2={300} y2={170} />

      {/* Scalloped green hedge — outer boundary along top and curved corner */}
      <ScallopedHedge points={outerHedge} r={6.8} />

      {/* Scalloped green hedge — central L-shaped divider */}
      <ScallopedHedge points={lHedge} r={7} />

      {/* Top-Right Circular Water Feature / Fountain Pool in the corner curve */}
      <g transform="translate(398, 54)">
        {/* Basin Outer Rim */}
        <circle cx={0} cy={0} r={19} fill="url(#water-grad)" stroke="#3894bd" strokeWidth="1.8" />
        {/* Water grid & ripple pattern */}
        <circle cx={0} cy={0} r={18.2} fill="url(#water-grid)" opacity="0.85" />
        {/* Concentric inner ripple rings */}
        <circle cx={0} cy={0} r={13} fill="none" stroke="#d5f2fc" strokeWidth="0.8" opacity="0.9" />
        <circle cx={0} cy={0} r={7.5} fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.95" />
        {/* Radial crosshair lines */}
        <line x1={-18} y1={0} x2={18} y2={0} stroke="#9fe0f6" strokeWidth="0.75" />
        <line x1={0} y1={-18} x2={0} y2={18} stroke="#9fe0f6" strokeWidth="0.75" />
        {/* Center Bubbling Jet */}
        <circle cx={0} cy={0} r={3} fill="#ffffff" stroke="#2582aa" strokeWidth="0.8" />
        <circle cx={0} cy={0} r={1.2} fill="#3fa8d4" />
        <text
          x={0}
          y={26}
          textAnchor="middle"
          fontSize="4.8"
          fontWeight="600"
          fill="#4485a3"
          letterSpacing="0.6"
        >
          FOUNTAIN
        </text>
      </g>

      {/* Ghost Crossed-Out Round Tables on Far Right matching blueprint */}
      {[245, 305, 365].map((y, i) => (
        <g key={`ghost-${i}`} opacity="0.4" pointerEvents="none">
          <circle cx={386} cy={y} r={11} fill="none" stroke="#999" strokeWidth="0.8" strokeDasharray="2 1.5" />
          <line x1={378} y1={y - 8} x2={394} y2={y + 8} stroke="#888" strokeWidth="1" />
          <line x1={394} y1={y - 8} x2={378} y2={y + 8} stroke="#888" strokeWidth="1" />
        </g>
      ))}

      {/* Right Wall Waiting Area Lounge Suite (Below Table 5) */}
      <g pointerEvents="none">
        {/* Waiting Lounge Rug / Floor Boundary */}
        <rect
          x={361}
          y={204}
          width={68}
          height={108}
          rx={4}
          fill="#f3efe6"
          stroke="#ded6c5"
          strokeWidth="0.9"
          strokeDasharray="3 2"
        />

        {/* Top 3-Seater Lounge Sofa */}
        <g>
          {/* Base frame */}
          <rect x={364} y={207} width={62} height={16} rx={3} fill="url(#tuft-lounge)" stroke={TAUPE} strokeWidth="1.1" />

          {/* Top backrest */}
          <rect x={365} y={208} width={60} height={4.5} rx={1.2} fill="#d8cbb5" stroke="#b2a288" strokeWidth="0.8" />

          {/* 3 Plush Cushions */}
          {[0, 1, 2].map((i) => (
            <rect
              key={`top-cush-${i}`}
              x={367.5 + i * 18}
              y={213}
              width={17}
              height={9.5}
              rx={1.5}
              fill="#f9f5ec"
              stroke="#c4b59b"
              strokeWidth="0.8"
            />
          ))}

          {/* Armrests */}
          <rect x={364} y={209} width={3.5} height={13.5} rx={1.2} fill="#d2c3aa" stroke="#9e8f77" strokeWidth="0.7" />
          <rect x={422.5} y={209} width={3.5} height={13.5} rx={1.2} fill="#d2c3aa" stroke="#9e8f77" strokeWidth="0.7" />
        </g>

        {/* Center Lounge Coffee Table */}
        <g>
          <ellipse cx={395} cy={258} rx={24} ry={14} fill="#faf7f0" stroke={GOLD_DARK} strokeWidth="1.2" />
          <ellipse cx={395} cy={258} rx={20} ry={11} fill="#ede3ce" stroke="#d2be98" strokeWidth="0.7" />
          <circle cx={395} cy={258} r={2.2} fill="#7da395" stroke="#48685d" strokeWidth="0.6" />
        </g>

        {/* Bottom 3-Seater Lounge Sofa */}
        <g>
          {/* Base frame */}
          <rect x={364} y={293} width={62} height={16} rx={3} fill="url(#tuft-lounge)" stroke={TAUPE} strokeWidth="1.1" />

          {/* Bottom backrest */}
          <rect x={365} y={303.5} width={60} height={4.5} rx={1.2} fill="#d8cbb5" stroke="#b2a288" strokeWidth="0.8" />

          {/* 3 Plush Cushions */}
          {[0, 1, 2].map((i) => (
            <rect
              key={`bot-cush-${i}`}
              x={367.5 + i * 18}
              y={294}
              width={17}
              height={9.5}
              rx={1.5}
              fill="#f9f5ec"
              stroke="#c4b59b"
              strokeWidth="0.8"
            />
          ))}

          {/* Armrests */}
          <rect x={364} y={294} width={3.5} height={13.5} rx={1.2} fill="#d2c3aa" stroke="#9e8f77" strokeWidth="0.7" />
          <rect x={422.5} y={294} width={3.5} height={13.5} rx={1.2} fill="#d2c3aa" stroke="#9e8f77" strokeWidth="0.7" />
        </g>
      </g>

      {/* Service Station Credenza along the vertical divider */}
      {/* <ServiceCredenza x={325} y={185} /> */}

      {/* Wash Station (Double basin vanity above restroom on left wall) */}
      <WashStation x={46} y={195} />

      {/* Dual-cubicle Restroom Suite */}
      <RestroomSuite />

      {/* Lounge Seating Suite in the corner alcove (Table 19 base) */}
      <LoungeSuite x={120} y={245} />

      {/* Cocktail Bar & Beverage Counter */}
      <BarCounter x={192} y={236} />

      {/* Hostess & Cashier Desk at bottom right */}
      <HostessDesk x={326} y={470} />

      {/* Architectural Structural Columns with Diagonal 'X' Cross (CAD Standard) */}
      {/* Top Wall Columns */}
      {/* <Column x={28} y={22} /> */}
      {/* <Column x={232} y={22} /> */}
      {/* <Column x={326} y={22} /> */}

      {/* Left Wall Columns */}
      {/* <Column x={28} y={140} />
      <Column x={28} y={254} />
      <Column x={28} y={308} /> */}

      {/* Restroom Inner Corner Columns */}
      {/* <Column x={105} y={254} />
      <Column x={105} y={340} /> */}

      {/* Bar Counter Perimeter Columns */}
      {/* <Column x={188} y={254} />
      <Column x={188} y={340} />
      <Column x={188} y={430} /> */}

      {/* Lower Banquet Room Columns */}
      {/* <Column x={188} y={546} />
      <Column x={434} y={546} />
      <Column x={400} y={430} /> */}

      {/* Right Perimeter Column */}
      {/* <Column x={434} y={380} /> */}

      {/* Floor Plan Header Label */}
      <text
        x="230"
        y="13"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill="#7b7b72"
        letterSpacing="2"
      >
        RESTAURANT DINE
      </text>
    </g>
  );
}
