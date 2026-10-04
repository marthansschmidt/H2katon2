import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { MEAL_ORDER, type Food, type FoodGroupTotals, type MealTime } from '../types/game';
import { addFoodToTotals, getFoodGoalGain, isDayComplete } from './foodPyramid';
import { shuffle } from './random';

export interface MenuContext {
  totals: FoodGroupTotals;
  selectedFoodIds: string[];
}

export class DailyMenuPlanner {
  private readonly completionCache = new Map<string, boolean>();
  constructor(private readonly foods: readonly Food[]) {}

  canCompleteDay(totals: FoodGroupTotals, remainingMeals: readonly MealTime[], selectedFoodIds: readonly string[]): boolean {
    if (!remainingMeals.length) return isDayComplete(totals);
    const key = JSON.stringify([remainingMeals, REQUIRED_FOOD_GROUPS.map(group => totals[group.id]), [...selectedFoodIds].sort()]);
    const cached = this.completionCache.get(key);
    if (cached !== undefined) return cached;
    const impossible = REQUIRED_FOOD_GROUPS.some(group => totals[group.id] + remainingMeals.reduce((sum, meal) => sum + Math.max(0,
      ...this.foods.filter(food => food.mealTimes.includes(meal) && !selectedFoodIds.includes(food.id))
        .map(food => food.groups.filter(value => value.groupId === group.id).reduce((points, value) => points + value.points, 0))), 0) < group.maxTarget);
    const possible = !impossible && this.foods.some(food => food.mealTimes.includes(remainingMeals[0]) && !selectedFoodIds.includes(food.id)
      && this.canCompleteDay(addFoodToTotals(totals, food), remainingMeals.slice(1), [...selectedFoodIds, food.id]));
    if (this.completionCache.size > 10000) this.completionCache.clear();
    this.completionCache.set(key, possible);
    return possible;
  }

  getChoices(meal: MealTime, context: MenuContext, preferredFoodIds: readonly string[] = [], usedFoodIds: readonly string[] = [], random = Math.random): Food[] {
    const remainingMeals = MEAL_ORDER.slice(MEAL_ORDER.indexOf(meal) + 1);
    const candidates = shuffle(this.foods.filter(food => food.mealTimes.includes(meal) && !context.selectedFoodIds.includes(food.id)), random)
      .map(food => ({ food, gain: getFoodGoalGain(food, context.totals),
        completes: this.canCompleteDay(addFoodToTotals(context.totals, food), remainingMeals, [...context.selectedFoodIds, food.id]) }));
    const priority = (candidate: typeof candidates[number]) => (preferredFoodIds.includes(candidate.food.id) ? 100 : 0)
      + (usedFoodIds.includes(candidate.food.id) ? 0 : 20) + candidate.gain;
    const ranked = [...candidates].sort((a, b) => priority(b) - priority(a));
    const decoysFor = (winner: typeof candidates[number]) => ranked.filter(candidate => candidate.food.id !== winner.food.id
      && candidate.gain < winner.gain && !candidate.completes);
    const winners = ranked.filter(candidate => candidate.completes);
    const winner = winners.find(candidate => decoysFor(candidate).length >= 2)
      // After an earlier weaker choice, still offer one clear way to make the most progress.
      ?? [...ranked].sort((a, b) => b.gain - a.gain).find(candidate => decoysFor(candidate).length >= 2);
    if (!winner) throw new Error('Unable to create three distinct daily choices');
    return shuffle([winner.food, ...decoysFor(winner).slice(0, 2).map(candidate => candidate.food)], random);
  }
}
