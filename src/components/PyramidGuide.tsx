import { DAILY_GOAL_EXPLANATION, FOOD_GROUPS } from '../data/foodGroups';
import { PyramidGraphic } from './FoodPyramid';
import { FoodGroupProgress } from './FoodGroupProgress';
import type { FoodGroupTotals } from '../types/game';
export function PyramidGuide({ totals }: { totals: FoodGroupTotals }) {
  return <div className="pyramid-guide"><p className="muted">Erinevad toidugrupid annavad erinevaid toitaineid. Vaheldus loeb!</p><p className="pyramid-footnote">{DAILY_GOAL_EXPLANATION}</p><PyramidGraphic />
    <div className="guide-groups">{FOOD_GROUPS.map(group => <div key={group.id}><FoodGroupProgress group={group} value={totals[group.id]} /><p>{group.tip}</p></div>)}</div>
  </div>;
}
