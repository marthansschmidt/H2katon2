import { Moon, Sun, Sunrise } from 'lucide-react';
import { MEAL_LABELS, type MealTime } from '../types/game';

export function MealBadge({ meal }: { meal: MealTime }) {
  const Icon = { breakfast: Sunrise, lunch: Sun, dinner: Moon }[meal];
  return <span className={`meal-badge meal-${meal}`}><Icon size={18} />{MEAL_LABELS[meal]}</span>;
}
