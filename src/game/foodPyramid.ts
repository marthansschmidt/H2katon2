import { FOOD_GROUPS, REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { MEAL_ORDER, type DaySelection, type Food, type FoodGroupTotals, type FoodGroupValue } from '../types/game';

export const emptyTotals = (): FoodGroupTotals => Object.fromEntries(FOOD_GROUPS.map(g => [g.id, 0])) as FoodGroupTotals;

export function getFoodContributions(food: Food, totals: FoodGroupTotals): FoodGroupValue[] {
  return FOOD_GROUPS.flatMap(group => {
    const available = food.groups.filter(value => value.groupId === group.id).reduce((sum, value) => sum + value.points, 0);
    const points = Math.max(0, Math.min(available, group.maxTarget - totals[group.id]));
    return points > 0 ? [{ groupId: group.id, points }] : [];
  });
}

export function addFoodToTotals(totals: FoodGroupTotals, food: Food): FoodGroupTotals {
  const next = { ...totals };
  for (const value of getFoodContributions(food, totals)) next[value.groupId] += value.points;
  return next;
}

export const calculateFoodGroupTotals = (foods: Food[]): FoodGroupTotals => foods.reduce(addFoodToTotals, emptyTotals());
export const foodsForDay = (day: DaySelection): Food[] => MEAL_ORDER.flatMap(meal => day[meal] ? [day[meal]!] : []);
export const totalsForDay = (day: DaySelection): FoodGroupTotals => calculateFoodGroupTotals(foodsForDay(day));
export const isDayComplete = (totals: FoodGroupTotals): boolean => REQUIRED_FOOD_GROUPS.every(group => totals[group.id] >= group.maxTarget);
export const getFoodGoalGain = (food: Food, totals: FoodGroupTotals): number => getFoodContributions(food, totals)
  .filter(value => REQUIRED_FOOD_GROUPS.some(group => group.id === value.groupId)).reduce((sum, value) => sum + value.points, 0);

export function calculateDayBalance(totals: FoodGroupTotals): number {
  const completion = REQUIRED_FOOD_GROUPS.reduce((sum, group) => sum + Math.min(1, Math.max(0, totals[group.id] / group.maxTarget)), 0);
  return Math.round(completion / REQUIRED_FOOD_GROUPS.length * 100);
}
