import { FOOD_GROUPS } from '../data/foodGroups';
import { MEAL_ORDER, type Food, type PlayerState, type Screen } from '../types/game';
export const SAVE_KEY = 'pesukaru-seiklus-v1';
interface Save { version: 1; player: PlayerState; screen: Screen; resumeScreen: Screen; started: boolean }
const screens: Screen[] = ['home', 'tutorial', 'map', 'daySummary', 'final'];
function validFood(food: Food): boolean {
  return !!food && typeof food.id === 'string' && typeof food.name === 'string' && typeof food.description === 'string' && typeof food.image === 'string'
    && Array.isArray(food.groups) && food.groups.every(g => g && FOOD_GROUPS.some(group => group.id === g.groupId) && Number.isFinite(g.points) && g.points > 0)
    && Array.isArray(food.mealTimes) && food.mealTimes.every(meal => MEAL_ORDER.includes(meal));
}
export function loadGame(): Save | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const save = JSON.parse(raw) as Save;
    const p = save.player;
    if (save.version !== 1 || typeof save.started !== 'boolean' || !screens.includes(save.screen) || !screens.includes(save.resumeScreen) || !p) return null;
    if (!Number.isInteger(p.currentDay) || p.currentDay < 1 || p.currentDay > 3 || !MEAL_ORDER.includes(p.currentMeal)) return null;
    // Version 1 saves from before meal-specific draws have no previous set.
    if (p.previousRestaurantIds === undefined) p.previousRestaurantIds = [];
    if (!Array.isArray(p.days) || p.days.length !== p.currentDay || ![p.usedFoodIds, p.usedRestaurantIds, p.restaurantIds, p.previousRestaurantIds].every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string')) || !p.offers || typeof p.offers !== 'object') return null;
    if (!Object.values(p.offers).every(foods => Array.isArray(foods) && foods.every(validFood))) return null;
    if (!Number.isFinite(p.score) || p.score < 0 || !Number.isFinite(p.moodScore) || p.moodScore < 0 || p.moodScore > 100 || !FOOD_GROUPS.every(g => Number.isFinite(p.foodGroupTotals?.[g.id]) && p.foodGroupTotals[g.id] >= 0)) return null;
    for (const day of p.days) {
      if (!day || !day.restaurantNames || !Array.isArray(day.waterMeals) || !day.waterMeals.every(meal => MEAL_ORDER.includes(meal)) || new Set(day.waterMeals).size !== day.waterMeals.length || !Number.isFinite(day.score)) return null;
      for (const meal of MEAL_ORDER) if (day[meal] && (!validFood(day[meal]!) || typeof day.restaurantNames[meal] !== 'string')) return null;
    }
    if (p.days.slice(0, -1).some(day => !MEAL_ORDER.every(meal => day[meal]))) return null;
    if (MEAL_ORDER.slice(0, MEAL_ORDER.indexOf(p.currentMeal)).some(meal => !p.days[p.currentDay - 1][meal])) return null;
    const destination = save.screen === 'home' ? save.resumeScreen : save.screen;
    if (['daySummary', 'final'].includes(destination) && !MEAL_ORDER.every(meal => p.days[p.currentDay - 1][meal])) return null;
    if (destination === 'final' && p.currentDay !== 3) return null;
    return save;
  } catch { return null; }
}
export function saveGame(player: PlayerState, screen: Screen, resumeScreen: Screen, started: boolean): boolean {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, player, screen, resumeScreen, started })); return true; } catch { return false; }
}
