import { ArrowRight, Leaf } from 'lucide-react';
import { FOOD_GROUPS } from '../data/foodGroups';
import type { Food } from '../types/game';
import { Button } from './Button';
import { FoodIllustration } from './FoodIllustration';
import { GroupIcon } from './Icons';
export function FoodCard({ food, onChoose, disabled }: { food: Food; onChoose: (food: Food) => void; disabled?: boolean }) {
  return <article className="food-card"><div className="food-art-wrap"><FoodIllustration type={food.image} />{food.plantBased && <span className="plant-label"><Leaf size={12} />Taimne</span>}</div><div className="food-card-content"><h3>{food.name}</h3><p>{food.description}</p><div className="food-group-chips">{food.groups.map(value => { const group = FOOD_GROUPS.find(g => g.id === value.groupId)!; return <span key={value.groupId} title={group.name} style={{ color: group.color }}><GroupIcon name={group.icon} size={15} /><span>+{value.points}</span><span className="sr-only">{group.name}</span></span>; })}</div><Button onClick={() => onChoose(food)} disabled={disabled}>Valin selle <ArrowRight size={17} /></Button></div></article>;
}
