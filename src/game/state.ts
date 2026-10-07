import { MEAL_ORDER, type CharacterId, type DaySelection, type Food, type PlayerState } from '../types/game';
import { emptyTotals, totalsForDay } from './foodPyramid';
import { getMoodForDay } from './mood';
import { calculateDayScore } from './scoring';
export const newDay = (): DaySelection => ({ restaurantNames: {}, score: 0 });
export function createPlayerState(character: CharacterId = 'raccoon'): PlayerState {
  return { character, currentDay: 1, currentMeal: 'breakfast', score: 0, moodScore: 65, foodGroupTotals: emptyTotals(), days: [newDay()], usedRestaurantIds: [], usedFoodIds: [], restaurantIds: [], previousRestaurantIds: [], offers: {} };
}
export function chooseFood(state: PlayerState, food: Food, restaurantName: string): PlayerState {
  const day = state.days[state.currentDay - 1];
  if (day[state.currentMeal] || !food.mealTimes.includes(state.currentMeal)) return state;
  const updatedDay = { ...day, [state.currentMeal]: food, restaurantNames: { ...day.restaurantNames, [state.currentMeal]: restaurantName } };
  const totals = totalsForDay(updatedDay);
  updatedDay.score = calculateDayScore(updatedDay);
  const days = state.days.map((value, i) => i === state.currentDay - 1 ? updatedDay : value);
  return { ...state, days, score: days.reduce((sum, value) => sum + value.score, 0), foodGroupTotals: totals, moodScore: getMoodForDay(days).score, usedFoodIds: [...new Set([...state.usedFoodIds, food.id])] };
}
export function nextMeal(state: PlayerState): PlayerState {
  const index = MEAL_ORDER.indexOf(state.currentMeal);
  return index < 2 ? { ...state, currentMeal: MEAL_ORDER[index + 1], previousRestaurantIds: [...state.restaurantIds], restaurantIds: [], offers: {} } : state;
}
export function nextDay(state: PlayerState): PlayerState {
  if (state.currentDay >= 3) return state;
  return { ...state, currentDay: state.currentDay + 1, currentMeal: 'breakfast', foodGroupTotals: emptyTotals(), days: [...state.days, newDay()], previousRestaurantIds: [...state.restaurantIds], restaurantIds: [], offers: {} };
}
