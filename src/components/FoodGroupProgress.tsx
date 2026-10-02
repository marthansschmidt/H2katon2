import type { CSSProperties } from 'react';
import type { FoodGroup } from '../types/game';
import { GroupIcon } from './Icons';
import { FoodGroupDot } from './FoodGroupDot';
export function FoodGroupProgress({ group, value }: { group: FoodGroup; value: number }) {
  const extra = Math.max(0, value - group.maxTarget);
  return <div className="food-group-row" style={{ '--group-color': group.color } as CSSProperties}>
    <div className="group-line"><span className="group-name"><GroupIcon name={group.icon} />{group.shortName}</span><span className="group-count">{value} <span>/ {group.minTarget === 0 ? `0–${group.maxTarget}` : `${group.minTarget}–${group.maxTarget}`}</span></span></div>
    <div className="group-dots" role="img" aria-label={`${group.name}: ${value} mummu, mängu vahemik ${group.minTarget} kuni ${group.maxTarget}`}>
      {Array.from({ length: group.maxTarget }, (_, i) => <FoodGroupDot key={i} color={group.color} filled={i < value} />)}
      {extra > 0 && <span className="extra-mumm">+{extra}</span>}
    </div>
  </div>;
}
