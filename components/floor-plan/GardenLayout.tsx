import { useMemo } from 'react';
import { Bush } from './Bush';
import { sampleLine, ScallopedHedge } from './Hedge';
import { WallDoor } from './WallDoor';
import { WALL } from './colors';

export function GardenLayout() {
  const gardenBushes = useMemo(() => [
    [410, 784, .7], [410, 866, .7], [410, 948, .7], [410, 1030, .7], [410, 1112, .7], [410, 1194, .7],
  ] as const, []);

  const hedge = useMemo(() => sampleLine(401, 690, 401, 1235, 7), []);

  return (
    <g>
      <path d="M 157 680 L 420 680" stroke={WALL} strokeWidth="6" />
      <path d="M 157 680 L 157 1248" stroke={WALL} strokeWidth="6" />
      <path d="M 420 680 L 420 1248" stroke={WALL} strokeWidth="6" />
      <path d="M 157 1248 L 420 1248" stroke={WALL} strokeWidth="6" />

      <ScallopedHedge points={hedge} r={6.5} />
      {gardenBushes.map(([x, y, s], i) => <Bush key={i} x={x} y={y} s={s} />)}

      <text x="285" y="705" textAnchor="middle" fontSize="10" fill="#7b7b72" letterSpacing="1.7">GARDEN DINE</text>

      <path d="M 157 1050 L 157 1095 L 185 1095" fill="none" stroke={WALL} strokeWidth="4" />
      <path d="M 420 1084 L 394 1084" fill="none" stroke={WALL} strokeWidth="4" />
      <WallDoor x={157} y={1064} w={30} side="right" />

      <path d="M 184 760 L 384 760" stroke="#ded7cb" strokeWidth="1" strokeDasharray="3 4" />
      <path d="M 184 1190 L 384 1190" stroke="#ded7cb" strokeWidth="1" strokeDasharray="3 4" />
    </g>
  );
}
