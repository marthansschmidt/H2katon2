import { DAILY_GOAL_EXPLANATION, FOOD_GROUPS } from '../data/foodGroups';
import { PyramidGraphic } from './FoodPyramid';
import { IllustratedPyramid } from './IllustratedPyramid';
import { FoodGroupProgress } from './FoodGroupProgress';
import type { FoodGroupId, FoodGroupTotals } from '../types/game';

const GROUP_ORDER: FoodGroupId[] = ['treats', 'protein', 'dairy', 'fats', 'grains', 'vegetables', 'fruits'];
const GUIDE_GROUPS = GROUP_ORDER.map(id => FOOD_GROUPS.find(group => group.id === id)!);
export function PyramidGuide({ totals, showProgress = false }: { totals: FoodGroupTotals; showProgress?: boolean }) {
  return <div className="pyramid-guide">{showProgress ? <IllustratedPyramid totals={totals} /> : <PyramidGraphic />}<p className="muted">Erinevad toidugrupid annavad erinevaid toitaineid. Vaheldus loeb!</p><p className="pyramid-footnote">{DAILY_GOAL_EXPLANATION}</p>
    <div className="guide-groups">{GUIDE_GROUPS.map(group => <div key={group.id}><FoodGroupProgress group={group} value={totals[group.id]} showOptionalLabel={false} showOptionalGoal={false} /><p>{group.tip}</p></div>)}</div>
  </div>;
}
