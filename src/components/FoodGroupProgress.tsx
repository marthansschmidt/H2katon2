import type { CSSProperties } from 'react';
import type { FoodGroup } from '../types/game';
import { GroupIcon } from './Icons';
import { FoodGroupDot } from './FoodGroupDot';
export function FoodGroupProgress({ group, value, showOptionalLabel = true, showOptionalGoal = true, showIcon = true, iconDots = false }: { group: FoodGroup; value: number; showOptionalLabel?: boolean; showOptionalGoal?: boolean; showIcon?: boolean; iconDots?: boolean }) {
  const visible = group.id === 'treats' ? value : Math.min(value, group.maxTarget);
  const excess = group.id === 'treats' ? Math.max(0, value - group.maxTarget) : 0;
  const optionalWithoutGoal = group.minTarget === 0 && !showOptionalGoal;
  const description = group.id === 'treats' ? `valikuline, päeva piir ${group.maxTarget}${excess > 0 ? `, ${excess} üle piiri` : ''}`
    : `päeva eesmärk ${group.maxTarget}`;
  return <div className={`food-group-row${excess > 0 ? ' has-excess' : ''}`} data-group={group.id} style={{ '--group-color': group.color } as CSSProperties}>
    <div className="group-line"><span className="group-name">{showIcon && <GroupIcon name={group.icon} />}<span>{group.shortName}{showOptionalLabel && group.minTarget === 0 && <small className="optional-group">valikuline</small>}</span></span>{!optionalWithoutGoal && <span className="group-count">{visible} <span>/ {group.maxTarget}</span></span>}</div>
    <div className="group-dots" role="img" aria-label={`${group.name}: ${visible} mummu, ${description}`}>
      {Array.from({ length: Math.max(group.maxTarget, visible) }, (_, i) => <FoodGroupDot key={i} color={group.color} filled={i < visible} excess={group.id === 'treats' && i >= group.maxTarget} icon={iconDots ? group.icon : undefined} />)}
    </div>
  </div>;
}
