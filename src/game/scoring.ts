import { FOOD_GROUPS } from '../data/foodGroups';
import { calculateDayBalance } from './foodPyramid';
import type { Food, FoodGroupTotals } from '../types/game';
export function calculateScore(food: Food, previousTotals: FoodGroupTotals): number {
  const groups = food.groups.filter(g => g.groupId !== 'treats' && g.groupId !== 'drinks');
  const newGroups = groups.filter(g => previousTotals[g.groupId] === 0).length;
  const variety = groups.length >= 3 ? 100 : 0;
  const overflowing = groups.filter(g => previousTotals[g.groupId] >= FOOD_GROUPS.find(f => f.id === g.groupId)!.maxTarget).length;
  return Math.round((newGroups * 50 + variety) * Math.max(0.25, 1 - overflowing * 0.25));
}
export const dayBonus = (totals: FoodGroupTotals) => calculateDayBalance(totals) >= 75 ? 150 : 0;
