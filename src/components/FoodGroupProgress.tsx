import type { CSSProperties } from 'react';
import type { FoodGroup } from '../types/game';
import { GroupIcon } from './Icons';
import { FoodGroupDot } from './FoodGroupDot';
export function FoodGroupProgress({ group, value, showOptionalLabel = true, showOptionalGoal = true, showIcon = true, iconDots = false }: { group: FoodGroup; value: number; showOptionalLabel?: boolean; showOptionalGoal?: boolean; showIcon?: boolean; iconDots?: boolean }) {
  const visible = Math.min(value, group.maxTarget);
  const optionalWithoutGoal = group.minTarget === 0 && !showOptionalGoal;
  return <div className="food-group-row" style={{ '--group-color': group.color } as CSSProperties}>
    <div className="group-line"><span className="group-name">{showIcon && <GroupIcon name={group.icon} />}<span>{group.shortName}{showOptionalLabel && group.minTarget === 0 && <small className="optional-group">valikuline</small>}</span></span><span className="group-count">{visible} <span>/ {group.maxTarget}</span></span></div>
    <div className="group-dots" role="img" aria-label={`${group.name}: ${visible} mummu, ${optionalWithoutGoal ? 'valikuline' : `${group.minTarget === 0 ? 'valikuline, kuni' : 'päeva eesmärk'} ${group.maxTarget}`}`}>
      {Array.from({ length: optionalWithoutGoal ? visible : group.maxTarget }, (_, i) => <FoodGroupDot key={i} color={group.color} filled={i < visible} icon={iconDots ? group.icon : undefined} />)}
    </div>
  </div>;
}
