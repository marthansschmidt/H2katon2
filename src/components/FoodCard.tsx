import { ArrowRight, Leaf, GroupIcon } from './Icons';
import { FOOD_GROUPS, PORTIONS_PER_DOT } from '../data/foodGroups';
import { emptyTotals, getFoodContributions } from '../game/foodPyramid';
import type { Food, FoodGroupTotals } from '../types/game';
import { Button } from './Button';
import { FoodIllustration } from './FoodIllustration';
export function FoodCard({ food, onChoose, disabled, totals = emptyTotals() }: { food: Food; onChoose: (food: Food) => void; disabled?: boolean; totals?: FoodGroupTotals }) {
  return <article className="food-card"><div className="food-art-wrap"><FoodIllustration type={food.image} foodId={food.id} vegetableToast={food.plantBased || food.id === 'ryecheese'} />{food.plantBased && <span className="plant-label"><Leaf size={12} />Taimne</span>}</div><div className="food-card-content"><h3>{food.name}</h3><p>{food.description}</p><div className="food-group-chips">{getFoodContributions(food, totals).map(value => { const group = FOOD_GROUPS.find(g => g.id === value.groupId)!; return <span key={value.groupId} title={`${group.name}: ${value.points} mummu = ${value.points * PORTIONS_PER_DOT} portsjonit`} style={{ color: group.color }}><GroupIcon name={group.icon} size={15} /><span>+{value.points}</span><span className="sr-only">{group.name}</span></span>; })}</div><Button onClick={() => onChoose(food)} disabled={disabled}>Valin selle <ArrowRight size={17} /></Button></div></article>;
}
