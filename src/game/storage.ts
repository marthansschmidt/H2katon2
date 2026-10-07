import { FOOD_GROUPS } from '../data/foodGroups';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { totalsForDay } from './foodPyramid';
import { calculateDayScore } from './scoring';
import { getMoodForDay } from './mood';
import { MEAL_ORDER, type Food, type PlayerState, type Screen } from '../types/game';
export const SAVE_KEY = 'pesukaru-seiklus-v1';
interface Save { version: 1 | 2 | 3; player: PlayerState; screen: Screen; resumeScreen: Screen; started: boolean }
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
    if (![1, 2, 3].includes(save.version) || typeof save.started !== 'boolean' || !screens.includes(save.screen) || !screens.includes(save.resumeScreen) || !p) return null;
    if (!Number.isInteger(p.currentDay) || p.currentDay < 1 || p.currentDay > 3 || !MEAL_ORDER.includes(p.currentMeal)) return null;
    // Existing adventures used the raccoon before character selection was added.
    if (p.character === undefined) p.character = 'raccoon';
    if (p.character !== 'raccoon' && p.character !== 'dinosaur') return null;
    // Version 1 saves from before meal-specific draws have no previous set.
    if (p.previousRestaurantIds === undefined) p.previousRestaurantIds = [];
    if (!Array.isArray(p.days) || p.days.length !== p.currentDay || ![p.usedFoodIds, p.usedRestaurantIds, p.restaurantIds, p.previousRestaurantIds].every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string')) || !p.offers || typeof p.offers !== 'object') return null;
    if (save.version === 1) {
      // Keep progress while removing retired drink contributions and stale menus.
      const cleanFood = (food: Food) => {
        if (food && Array.isArray(food.groups)) food.groups = food.groups.filter(group => group && String(group.groupId) !== 'drinks');
      };
      for (const foods of Object.values(p.offers)) if (Array.isArray(foods)) foods.forEach(cleanFood);
      for (const day of p.days) if (day) {
        for (const meal of MEAL_ORDER) if (day[meal]) cleanFood(day[meal]!);
        delete (day as typeof day & { waterMeals?: unknown }).waterMeals;
      }
    }
    if (!Object.values(p.offers).every(foods => Array.isArray(foods) && foods.every(validFood))) return null;
    if (!Number.isFinite(p.score) || p.score < 0 || !Number.isFinite(p.moodScore) || p.moodScore < 0 || p.moodScore > 100 || !FOOD_GROUPS.every(g => Number.isFinite(p.foodGroupTotals?.[g.id]) && p.foodGroupTotals[g.id] >= 0)) return null;
    for (const day of p.days) {
      if (!day || !day.restaurantNames || !Number.isFinite(day.score)) return null;
      for (const meal of MEAL_ORDER) if (day[meal] && (!validFood(day[meal]!) || typeof day.restaurantNames[meal] !== 'string')) return null;
    }
    if (p.days.slice(0, -1).some(day => !MEAL_ORDER.every(meal => day[meal]))) return null;
    if (MEAL_ORDER.slice(0, MEAL_ORDER.indexOf(p.currentMeal)).some(meal => !p.days[p.currentDay - 1][meal])) return null;
    const destination = save.screen === 'home' ? save.resumeScreen : save.screen;
    if (['daySummary', 'final'].includes(destination) && !MEAL_ORDER.every(meal => p.days[p.currentDay - 1][meal])) return null;
    if (destination === 'final' && p.currentDay !== 3) return null;
    if (save.version < 3) {
      // Retain chosen meals while adapting their dots to the updated pyramid.
      for (const day of p.days) for (const meal of MEAL_ORDER) {
        const food = day[meal];
        const currentFood = food && MOCK_FOODS.find(current => current.id === food.id);
        if (food && currentFood) food.groups = currentFood.groups.map(group => ({ ...group }));
      }
      p.offers = {};
    }
    p.foodGroupTotals = totalsForDay(p.days[p.currentDay - 1]);
    // Recompute old point totals from the saved choices using the current scoring rules.
    p.days = p.days.map(day => ({ ...day, score: calculateDayScore(day) }));
    p.score = p.days.reduce((sum, day) => sum + day.score, 0);
    p.moodScore = getMoodForDay(p.days).score;
    save.version = 3;
    return save;
  } catch { return null; }
}
export function saveGame(player: PlayerState, screen: Screen, resumeScreen: Screen, started: boolean): boolean {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 3, player, screen, resumeScreen, started })); return true; } catch { return false; }
}
