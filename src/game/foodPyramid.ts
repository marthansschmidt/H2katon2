import { FOOD_GROUPS } from '../data/foodGroups';
import { MEAL_ORDER, type DaySelection, type Food, type FoodGroupTotals } from '../types/game';
export const emptyTotals = (): FoodGroupTotals => Object.fromEntries(FOOD_GROUPS.map(g => [g.id, 0])) as FoodGroupTotals;
export function calculateFoodGroupTotals(foods: Food[], water = 0): FoodGroupTotals {
  const totals = emptyTotals();
  for (const food of foods) for (const group of food.groups) totals[group.groupId] += group.points;
  totals.drinks += water;
  return totals;
}
export const foodsForDay = (day: DaySelection): Food[] => MEAL_ORDER.flatMap(meal => day[meal] ? [day[meal]!] : []);
export const totalsForDay = (day: DaySelection) => calculateFoodGroupTotals(foodsForDay(day), day.waterMeals.length);
export function calculateDayBalance(totals: FoodGroupTotals): number {
  const groups = FOOD_GROUPS.map(group => {
    const value = totals[group.id];
    if (value < group.minTarget) return value / group.minTarget;
    if (value > group.maxTarget) return Math.max(0, 1 - (value - group.maxTarget) / group.maxTarget);
    return 1;
  });
  return Math.round(groups.reduce((sum, value) => sum + value, 0) / groups.length * 100);
}
