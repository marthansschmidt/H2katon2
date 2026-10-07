import type { CSSProperties } from 'react';
import { GroupIcon } from './Icons';

export function FoodGroupDot({ color, filled, icon, excess = false }: { color: string; filled: boolean; icon?: string; excess?: boolean }) {
  return <span aria-hidden="true" className={`group-dot ${filled ? 'filled' : ''} ${icon ? 'group-dot-icon' : ''} ${excess ? 'excess' : ''}`} style={{ '--group-color': color } as CSSProperties}>{icon && <GroupIcon name={icon} size={14} />}</span>;
}
