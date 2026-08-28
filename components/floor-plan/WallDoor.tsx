import { BG, THIN } from './colors';

export function WallDoor({ x, y, w = 32, h = 4, side = 'bottom' }: { x: number; y: number; w?: number; h?: number; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  if (side === 'left' || side === 'right') {
    return (
      <g>
        <line x1={x} y1={y} x2={x} y2={y + w} stroke={BG} strokeWidth={8} />
        <path d={`M ${x} ${y + w} Q ${side === 'right' ? x - w : x + w} ${y + w} ${side === 'right' ? x - w : x + w} ${y}`} fill="none" stroke={THIN} strokeWidth="1.5" />
      </g>
    );
  }
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={BG} strokeWidth={8} />
      <path d={`M ${x + w} ${y} Q ${x + w} ${y + (side === 'top' ? h : -h)} ${x} ${y + (side === 'top' ? h : -h)}`} fill="none" stroke={THIN} strokeWidth="1.5" />
    </g>
  );
}
