export type FoodGroupId = 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'protein' | 'fats' | 'treats' | 'drinks';
export type MealTime = 'breakfast' | 'lunch' | 'dinner';
export type FoodArt = 'porridge' | 'toast' | 'yogurt' | 'pancakes' | 'bowl' | 'soup' | 'burger' | 'wrap' | 'salad' | 'fish' | 'pasta' | 'cake' | 'smoothie' | 'fruit';
export interface FoodGroupValue { groupId: FoodGroupId; points: number }
export interface Food {
  id: string; name: string; description: string; image: FoodArt;
  groups: FoodGroupValue[]; mealTimes: MealTime[]; plantBased?: boolean;
}
export interface Restaurant {
  id: string; name: string; locationLabel: string; icon: string; meals: Food[];
  logo: string; logoBackground?: string;
}
export interface FoodGroup { id: FoodGroupId; name: string; shortName: string; color: string; minTarget: number; maxTarget: number; icon: string; tip: string }
export type FoodGroupTotals = Record<FoodGroupId, number>;
export interface DaySelection {
  breakfast?: Food; lunch?: Food; dinner?: Food; restaurantNames: Partial<Record<MealTime, string>>;
  waterMeals: MealTime[]; score: number;
}
export interface PlayerState {
  currentDay: number; currentMeal: MealTime; score: number; moodScore: number;
  foodGroupTotals: FoodGroupTotals; days: DaySelection[];
  usedRestaurantIds: string[]; usedFoodIds: string[];
  restaurantIds: string[]; previousRestaurantIds: string[]; offers: Record<string, Food[]>;
}
export type Screen = 'home' | 'tutorial' | 'map' | 'daySummary' | 'final';
export const MEAL_ORDER: MealTime[] = ['breakfast', 'lunch', 'dinner'];
export const MEAL_LABELS: Record<MealTime, string> = { breakfast: 'Hommikusöök', lunch: 'Lõunasöök', dinner: 'Õhtusöök' };
