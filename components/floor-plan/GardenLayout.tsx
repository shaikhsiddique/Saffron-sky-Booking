import { useMemo } from 'react';
import { Bush } from './Bush';
import { WallDoor } from './WallDoor';
import { GREEN, GREEN_DARK, WALL } from './colors';

export function GardenLayout() {
  const gardenBushes = useMemo(() => [
    [484, 784, .85], [484, 866, .85], [484, 948, .85], [484, 1030, .85], [484, 1112, .85], [484, 1194, .85],
  ] as const, []);

  return (
    <g>
      {/* ===== GARDEN DINING ===== */}
      <path d="M 157 680 L 420 680" stroke={WALL} strokeWidth="6" />
      <path d="M 157 680 L 157 1248" stroke={WALL} strokeWidth="6" />
      <path d="M 420 680 L 420 1248" stroke={WALL} strokeWidth="6" />
      <path d="M 157 1248 L 420 1248" stroke={WALL} strokeWidth="6" />

      {/* right green hedge */}
      <path d="M 401 682 L 401 1240" fill="none" stroke={GREEN_DARK} strokeWidth="8" />
      <path d="M 397 682 L 397 1240" fill="none" stroke={GREEN} strokeWidth="3" />
      {gardenBushes.map(([x, y, s], i) => <Bush key={i} x={x} y={y} s={s} />)}

      <text x="285" y="705" textAnchor="middle" fontSize="10" fill="#7b7b72" letterSpacing="1.7">GARDEN DINE</text>

      {/* garden entry / utility */}
      <path d="M 157 1050 L 157 1095 L 185 1095" fill="none" stroke={WALL} strokeWidth="4" />
      <path d="M 420 1084 L 394 1084" fill="none" stroke={WALL} strokeWidth="4" />
      <WallDoor x={157} y={1064} w={30} side="right" />

      {/* garden floor datum / visual lines */}
      <path d="M 184 760 L 384 760" stroke="#ded7cb" strokeWidth="1" strokeDasharray="3 4" />
      <path d="M 184 1190 L 384 1190" stroke="#ded7cb" strokeWidth="1" strokeDasharray="3 4" />

      <g opacity="0.8">
        {[54, 106, 158, 210, 362].map((x) => <rect key={`g${x}`} x={x} y={824} width="8" height="8" fill="#eee" stroke="#8c8c8c" strokeWidth="1" />)}
      </g>
    </g>
  );
}
