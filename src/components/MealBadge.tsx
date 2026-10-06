import { HalfMoon, SunLight, CoffeeCup } from './Icons';
import { MEAL_LABELS, type MealTime } from '../types/game';

export function MealBadge({ meal }: { meal: MealTime }) {
  const Icon = { breakfast: CoffeeCup, lunch: SunLight, dinner: HalfMoon }[meal];
  return <span className={`meal-badge meal-${meal}`}><Icon size={18} />{MEAL_LABELS[meal]}</span>;
}
