import { useMemo } from 'react';
import { sampleLine, ScallopedHedge } from './Hedge';
import { WallDoor } from './WallDoor';
import { WALL, THIN, GOLD_DARK } from './colors';
import { Column } from './RestaurantLayout';

/* ── thin partition screen exactly like RestaurantLayout ── */
function PartitionScreen({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c5b69c" strokeWidth="2.2" strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD_DARK} strokeWidth="1" strokeLinecap="round" />
      <circle cx={x1} cy={y1} r={1.6} fill="#a48d61" />
      <circle cx={x2} cy={y2} r={1.6} fill="#a48d61" />
    </g>
  );
}

/* ── toilet bowl icon ── */
function Toilet({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 3} rx={4.5} ry={6} fill="#f4f0e7" stroke="#555" strokeWidth="0.9" />
      <ellipse cx={cx} cy={cy - 2.5} rx={3} ry={2} fill="#e0dbd2" stroke="#555" strokeWidth="0.8" />
    </g>
  );
}

/* ── playground seesaw ── */
function Seesaw({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <polygon points="14,0 10,7 18,7" fill={THIN} />
      <line x1={0} y1={5} x2={28} y2={-1} stroke={THIN} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={1} cy={4} r={2.5} fill="#f4f0e7" stroke={THIN} strokeWidth="0.8" />
      <circle cx={27} cy={-2} r={2.5} fill="#f4f0e7" stroke={THIN} strokeWidth="0.8" />
    </g>
  );
}

/* ── playground slide ── */
function Slide({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={0} y={0} width={7} height={16} fill="#f4f0e7" stroke={THIN} strokeWidth="0.8" />
      <line x1={0} y1={5} x2={7} y2={5} stroke={THIN} strokeWidth="0.6" />
      <line x1={0} y1={10} x2={7} y2={10} stroke={THIN} strokeWidth="0.6" />
      <path d="M 7 1 Q 20 1 26 18 L 22 18 Q 17 5 7 5 Z" fill="#d9c398" stroke={THIN} strokeWidth="0.8" />
    </g>
  );
}

export function GardenLayout() {
  /* horizontal hedge strips in the right bay (between counter stools) */
  const hR1 = useMemo(() => sampleLine(330, 800, 418, 800, 5.5), []);
  const hR2 = useMemo(() => sampleLine(330, 870, 418, 870, 5.5), []);
  const hR3 = useMemo(() => sampleLine(330, 940, 418, 940, 5.5), []);
  const hR4 = useMemo(() => sampleLine(330, 1010, 418, 1010, 5.5), []);

  return (
    <g id="garden-dine-layout">

      {/* ── OUTER WALLS (same weight as restaurant) ── */}
      <path d="M 157 680 L 420 680" stroke={WALL} strokeWidth="5.5" />
      <path d="M 157 680 L 157 1248" stroke={WALL} strokeWidth="5.5" />
      <path d="M 420 680 L 420 1248" stroke={WALL} strokeWidth="5.5" />
      <path d="M 157 1248 L 420 1248" stroke={WALL} strokeWidth="5.5" />

      {/* ── FLOOR FILL ── */}
      <rect x="160" y="683" width="257" height="562" fill="#ffffff" opacity="0.55" />

      {/* ── STAGE (top-centre) ── */}
      <rect x="205" y="682" width="150" height="20" rx="3" fill="#ffffff" stroke={WALL} strokeWidth="1.4" />
      <text x="280" y="695" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#3d3428" letterSpacing="1.3">STAGE</text>

      {/* ── Left accent box (top-left corner – matches sketch) ── */}
      <rect x="159" y="683" width="22" height="14" rx="1.5" fill="#faf7f0" stroke="#b2a288" strokeWidth="1" />

      {/* ── VERTICAL DIVIDER separating right bay from main dining ── */}
      {/* <line x1="330" y1="720" x2="330" y2="1080" stroke={THIN} strokeWidth="1.4" strokeDasharray="4 3" /> */}

      {/* ── RIGHT BAY: horizontal hedge strips (like restaurant hedges) ── */}
      <ScallopedHedge points={hR1} r={4} />
      <ScallopedHedge points={hR2} r={4} />
      <ScallopedHedge points={hR3} r={4} />
      <ScallopedHedge points={hR4} r={4} />

      {/* ── PARTITION SCREENS between left booths ── */}
      <PartitionScreen x1={162} y1={720} x2={162} y2={797} />
      <PartitionScreen x1={162} y1={825} x2={162} y2={908} />
      <PartitionScreen x1={162} y1={934} x2={162} y2={1010} />

      {/* ── BOTTOM ZONE wall / divider line ── */}
      <line x1="160" y1="1080" x2="418" y2="1080" stroke={WALL} strokeWidth="3" />

      {/* ── BOTTOM-LEFT: Washrooms ── */}
      <g id="garden-washrooms">
        <rect x="160" y="1083" width="68" height="163" rx="0" fill="#f4f0e7" stroke={WALL} strokeWidth="2.5" />
        <line x1="160" y1="1137" x2="228" y2="1137" stroke={THIN} strokeWidth="1.4" />
        <line x1="160" y1="1191" x2="228" y2="1191" stroke={THIN} strokeWidth="1.4" />


        <text x="194" y="1252" textAnchor="middle" fontSize="5.5" fill="#666" letterSpacing="0.5">WC</text>
      </g>

      {/* ── BOTTOM-CENTRE: Kids / Play area (tiled green lawn) ── */}
      <g id="garden-play-area">
        <rect x="229" y="1083" width="104" height="163" fill="#daecc3" stroke={WALL} strokeWidth="2.5" />
        {/* tile grid */}
        {[1097, 1111, 1125, 1139, 1153, 1167, 1181, 1195, 1209, 1223, 1237].map(y => (
          <line key={y} x1="229" y1={y} x2="333" y2={y} stroke="#b8d49a" strokeWidth="0.6" />
        ))}
        {[242, 255, 268, 281, 294, 307, 320].map(x => (
          <line key={x} x1={x} y1="1083" x2={x} y2="1246" stroke="#b8d49a" strokeWidth="0.6" />
        ))}
        {/* equipment icons */}
        <Seesaw x={238} y={1200} />
        <Slide x={262} y={1100} />
        <Slide x={290} y={1165} />
        <text x="281" y="1252" textAnchor="middle" fontSize="5.5" fill="#558b2f" letterSpacing="0.5">PLAY AREA</text>
      </g>

      {/* ── BOTTOM-RIGHT: Office / Storage room ── */}
      <g id="garden-office">
        <rect x="334" y="1083" width="84" height="163" fill="#f5f1e9" stroke={WALL} strokeWidth="2.5" />
        <Column x={334} y={1083} />
        <Column x={418} y={1083} />
        <WallDoor x={334} y={1098} w={24} side="right" />
        {/* desk */}
        <rect x="350" y="1140" width="50" height="26" rx="2" fill="#faf7f0" stroke="#b2a288" strokeWidth="1" />
        {/* chairs around desk */}
        <circle cx="375" cy="1132" r="4" fill="#d2c3aa" stroke="#9e8f77" strokeWidth="0.8" />
        <circle cx="344" cy="1153" r="4" fill="#d2c3aa" stroke="#9e8f77" strokeWidth="0.8" />
        <circle cx="406" cy="1153" r="4" fill="#d2c3aa" stroke="#9e8f77" strokeWidth="0.8" />
        <text x="376" y="1222" textAnchor="middle" fontSize="5.5" fill="#6b6152" letterSpacing="0.5">OFFICE</text>
      </g>

      {/* ── GARDEN DINE label ── */}
      <text x="248" y="708" textAnchor="middle" fontSize="9" fill="#7b7b72" letterSpacing="1.8">GARDEN DINE</text>
    </g>
  );
}


