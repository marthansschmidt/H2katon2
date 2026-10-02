import { Check } from 'lucide-react';
import type { Food, MealTime } from '../types/game';
import { MEAL_LABELS } from '../types/game';
import { FoodIllustration } from './FoodIllustration';

export function SummaryCard({ food, meal, restaurant }: { food: Food; meal: MealTime; restaurant?: string }) {
  return <article className="card summary-meal"><span className="eyebrow">{MEAL_LABELS[meal]}</span>
    <FoodIllustration type={food.image} vegetableToast={food.plantBased || food.id === 'ryecheese'} /><h3>{food.name}</h3><p>{restaurant}</p><Check className="meal-check" size={16} />
  </article>;
}
