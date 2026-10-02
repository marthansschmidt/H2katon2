import { MOCK_RESTAURANTS } from '../data/mockRestaurants';
import { shuffle } from '../game/random';
import type { Food, MealTime, Restaurant } from '../types/game';

export interface RestaurantProvider {
  getRestaurantsForDay(excludedIds: string[]): Promise<Restaurant[]>;
  getRestaurantById(id: string): Promise<Restaurant | null>;
  getMealsForRestaurant(id: string, meal: MealTime, usedFoodIds: string[]): Promise<Food[]>;
}
export function getRandomRestaurants(restaurants: Restaurant[], excludedIds: string[], limit = 5): Restaurant[] {
  const excluded = new Set(excludedIds);
  return [...shuffle(restaurants.filter(r => !excluded.has(r.id))), ...shuffle(restaurants.filter(r => excluded.has(r.id)))].slice(0, limit);
}
export function getAvailableFoods(foods: Food[], meal: MealTime, usedFoodIds: string[], limit = 3): Food[] {
  const eligible = foods.filter(food => food.mealTimes.includes(meal));
  const used = new Set(usedFoodIds);
  const ordered = [...shuffle(eligible.filter(food => !used.has(food.id))), ...shuffle(eligible.filter(food => used.has(food.id)))];
  // The curated menus include distinct breakfast, everyday and main-course choices.
  return ordered.slice(0, limit);
}
export class MockRestaurantProvider implements RestaurantProvider {
  async getRestaurantsForDay(excludedIds: string[]) { return getRandomRestaurants(MOCK_RESTAURANTS, excludedIds); }
  async getRestaurantById(id: string) { return MOCK_RESTAURANTS.find(r => r.id === id) ?? null; }
  async getMealsForRestaurant(id: string, meal: MealTime, usedFoodIds: string[]) {
    const restaurant = await this.getRestaurantById(id);
    return restaurant ? getAvailableFoods(restaurant.meals, meal, usedFoodIds) : [];
  }
}
// TODO: implement ApiRestaurantProvider against a permitted REST endpoint.
// No external requests or website HTML parsing are used in this MVP.
let provider: RestaurantProvider = new MockRestaurantProvider();
export function setRestaurantProvider(nextProvider: RestaurantProvider) { provider = nextProvider; }
export const getRestaurantsForDay = (excludedIds: string[] = []) => provider.getRestaurantsForDay(excludedIds);
export const getRestaurantById = (id: string) => provider.getRestaurantById(id);
export const getMealsForRestaurant = (id: string, meal: MealTime, usedFoodIds: string[]) => provider.getMealsForRestaurant(id, meal, usedFoodIds);
