import { MOCK_FOODS, MOCK_RESTAURANTS } from '../data/mockRestaurants';
import { shuffle } from '../game/random';
import { DailyMenuPlanner, type MenuContext } from '../game/dailyMenu';
import type { Food, MealTime, Restaurant } from '../types/game';

export interface RestaurantProvider {
  getRestaurantsForDay(excludedIds: string[], previousIds?: string[]): Promise<Restaurant[]>;
  getRestaurantById(id: string): Promise<Restaurant | null>;
  getMealsForRestaurant(id: string, meal: MealTime, usedFoodIds: string[], context?: MenuContext): Promise<Food[]>;
}
export function getRandomRestaurants(restaurants: Restaurant[], excludedIds: string[], limit = 5, previousIds: string[] = []): Restaurant[] {
  const excluded = new Set(excludedIds);
  const previous = new Set(previousIds);
  // Prefer unseen places, then older repeats. Only reuse the immediately
  // preceding set if a smaller provider cannot supply enough alternatives.
  return [
    ...shuffle(restaurants.filter(r => !previous.has(r.id) && !excluded.has(r.id))),
    ...shuffle(restaurants.filter(r => !previous.has(r.id) && excluded.has(r.id))),
    ...shuffle(restaurants.filter(r => previous.has(r.id) && !excluded.has(r.id))),
    ...shuffle(restaurants.filter(r => previous.has(r.id) && excluded.has(r.id))),
  ].slice(0, limit);
}
export function getAvailableFoods(foods: Food[], meal: MealTime, usedFoodIds: string[], limit = 3): Food[] {
  const eligible = foods.filter(food => food.mealTimes.includes(meal));
  const used = new Set(usedFoodIds);
  const ordered = [...shuffle(eligible.filter(food => !used.has(food.id))), ...shuffle(eligible.filter(food => used.has(food.id)))];
  // The curated menus include distinct breakfast, everyday and main-course choices.
  return ordered.slice(0, limit);
}
export class MockRestaurantProvider implements RestaurantProvider {
  private readonly menuPlanner = new DailyMenuPlanner(MOCK_FOODS);
  async getRestaurantsForDay(excludedIds: string[], previousIds: string[] = []) { return getRandomRestaurants(MOCK_RESTAURANTS, excludedIds, 5, previousIds); }
  async getRestaurantById(id: string) { return MOCK_RESTAURANTS.find(r => r.id === id) ?? null; }
  async getMealsForRestaurant(id: string, meal: MealTime, usedFoodIds: string[], context?: MenuContext) {
    const restaurant = await this.getRestaurantById(id);
    if (restaurant && context) return this.menuPlanner.getChoices(meal, context, restaurant.meals.map(food => food.id), usedFoodIds);
    return restaurant ? getAvailableFoods(restaurant.meals, meal, usedFoodIds) : [];
  }
}
// TODO: implement ApiRestaurantProvider against a permitted REST endpoint.
// No external requests or website HTML parsing are used in this MVP.
let provider: RestaurantProvider = new MockRestaurantProvider();
export function setRestaurantProvider(nextProvider: RestaurantProvider) { provider = nextProvider; }
export const getRestaurantsForDay = (excludedIds: string[] = []) => provider.getRestaurantsForDay(excludedIds);
export const getRestaurantsForMeal = (usedIds: string[] = [], previousIds: string[] = []) => provider.getRestaurantsForDay(usedIds, previousIds);
export const getRestaurantById = (id: string) => provider.getRestaurantById(id);
export const getMealsForRestaurant = (id: string, meal: MealTime, usedFoodIds: string[], context?: MenuContext) => provider.getMealsForRestaurant(id, meal, usedFoodIds, context);
