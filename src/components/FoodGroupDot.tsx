import type { CSSProperties } from 'react';
import { GroupIcon } from './Icons';

export function FoodGroupDot({ color, filled, icon }: { color: string; filled: boolean; icon?: string }) {
  return <span aria-hidden="true" className={`group-dot ${filled ? 'filled' : ''} ${icon ? 'group-dot-icon' : ''}`} style={{ '--group-color': color } as CSSProperties}>{icon && <GroupIcon name={icon} size={14} />}</span>;
}
