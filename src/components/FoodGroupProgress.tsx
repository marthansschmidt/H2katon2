import type { CSSProperties } from 'react';
import type { FoodGroup } from '../types/game';
import { GroupIcon } from './Icons';
import { FoodGroupDot } from './FoodGroupDot';
export function FoodGroupProgress({ group, value, showOptionalLabel = true }: { group: FoodGroup; value: number; showOptionalLabel?: boolean }) {
  const visible = Math.min(value, group.maxTarget);
  return <div className="food-group-row" style={{ '--group-color': group.color } as CSSProperties}>
    <div className="group-line"><span className="group-name"><GroupIcon name={group.icon} /><span>{group.shortName}{showOptionalLabel && group.minTarget === 0 && <small className="optional-group">valikuline</small>}</span></span><span className="group-count">{visible} <span>/ {group.maxTarget}</span></span></div>
    <div className="group-dots" role="img" aria-label={`${group.name}: ${visible} mummu, ${group.minTarget === 0 ? 'valikuline, kuni' : 'päeva eesmärk'} ${group.maxTarget}`}>
      {Array.from({ length: group.maxTarget }, (_, i) => <FoodGroupDot key={i} color={group.color} filled={i < visible} />)}
    </div>
  </div>;
}
