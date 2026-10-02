import type { CSSProperties } from 'react';

export function FoodGroupDot({ color, filled }: { color: string; filled: boolean }) {
  return <span aria-hidden="true" className={`group-dot ${filled ? 'filled' : ''}`} style={{ '--group-color': color } as CSSProperties} />;
}
