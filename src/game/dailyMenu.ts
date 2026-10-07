import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { MEAL_ORDER, type Food, type FoodGroupTotals, type MealTime } from '../types/game';
import { addFoodToTotals, getFoodGoalGain, isDayComplete, isSweetFood } from './foodPyramid';
import { shuffle } from './random';

export interface MenuContext {
  totals: FoodGroupTotals;
  selectedFoodIds: string[];
}
export type SweetMenuPolicy = 'optional' | 'include' | 'exclude';
const canOfferFood = (food: Food, meal: MealTime, selectedFoodIds: readonly string[]) => food.mealTimes.includes(meal)
  && (isSweetFood(food) || !selectedFoodIds.includes(food.id));

export class DailyMenuPlanner {
  private readonly completionCache = new Map<string, boolean>();
  constructor(private readonly foods: readonly Food[]) {}

  canCompleteDay(totals: FoodGroupTotals, remainingMeals: readonly MealTime[], selectedFoodIds: readonly string[]): boolean {
    if (!remainingMeals.length) return isDayComplete(totals);
    const key = JSON.stringify([remainingMeals, REQUIRED_FOOD_GROUPS.map(group => totals[group.id]), [...selectedFoodIds].sort()]);
    const cached = this.completionCache.get(key);
    if (cached !== undefined) return cached;
    const impossible = REQUIRED_FOOD_GROUPS.some(group => totals[group.id] + remainingMeals.reduce((sum, meal) => sum + Math.max(0,
      ...this.foods.filter(food => canOfferFood(food, meal, selectedFoodIds))
        .map(food => food.groups.filter(value => value.groupId === group.id).reduce((points, value) => points + value.points, 0))), 0) < group.maxTarget);
    const possible = !impossible && this.foods.some(food => canOfferFood(food, remainingMeals[0], selectedFoodIds)
      && this.canCompleteDay(addFoodToTotals(totals, food), remainingMeals.slice(1), [...selectedFoodIds, food.id]));
    if (this.completionCache.size > 10000) this.completionCache.clear();
    this.completionCache.set(key, possible);
    return possible;
  }

  getChoices(meal: MealTime, context: MenuContext, preferredFoodIds: readonly string[] = [], usedFoodIds: readonly string[] = [], random = Math.random, sweetPolicy: SweetMenuPolicy = 'optional'): Food[] {
    const remainingMeals = MEAL_ORDER.slice(MEAL_ORDER.indexOf(meal) + 1);
    const candidates = shuffle(this.foods.filter(food => canOfferFood(food, meal, context.selectedFoodIds)
      && (sweetPolicy !== 'exclude' || !isSweetFood(food))), random)
      .map(food => ({ food, gain: getFoodGoalGain(food, context.totals),
        completes: this.canCompleteDay(addFoodToTotals(context.totals, food), remainingMeals, [...context.selectedFoodIds, food.id]) }));
    const priority = (candidate: typeof candidates[number]) => (preferredFoodIds.includes(candidate.food.id) ? 100 : 0)
      + (usedFoodIds.includes(candidate.food.id) ? 0 : 20) + candidate.gain;
    const ranked = [...candidates].sort((a, b) => priority(b) - priority(a));
    const decoysFor = (winner: typeof candidates[number]) => ranked.filter(candidate => candidate.food.id !== winner.food.id
      && candidate.gain < winner.gain).sort((a, b) => Number(a.completes) - Number(b.completes));
    const winners = ranked.filter(candidate => candidate.completes);
    const hasMenu = (candidate: typeof candidates[number]) => decoysFor(candidate).length >= 2
      && (sweetPolicy !== 'include' || isSweetFood(candidate.food) || decoysFor(candidate).some(decoy => isSweetFood(decoy.food)));
    const winner = winners.find(hasMenu)
      // After an earlier weaker choice, still offer one clear way to make the most progress.
      ?? [...ranked].sort((a, b) => b.gain - a.gain).find(hasMenu);
    if (!winner) throw new Error('Unable to create three distinct daily choices');
    const decoys = decoysFor(winner);
    // Reserve a choice for dessert at selected venues, even if that dessert was eaten before.
    const sweet = sweetPolicy === 'include' && !isSweetFood(winner.food) ? decoys.find(candidate => isSweetFood(candidate.food)) : undefined;
    const chosenDecoys = sweet ? [sweet, ...decoys.filter(candidate => candidate.food.id !== sweet.food.id).slice(0, 1)] : decoys.slice(0, 2);
    return shuffle([winner.food, ...chosenDecoys.map(candidate => candidate.food)], random);
  }
}
