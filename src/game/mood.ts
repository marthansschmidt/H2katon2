import { addFoodToTotals, consumptionForDay, emptyTotals, foodsForDay, getFoodContributions } from './foodPyramid';
import { FOOD_GROUPS, REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import type { DaySelection, FoodGroupTotals } from '../types/game';

export type MoodId = 'well' | 'unwell';
// Use the same game limit as the visible treats row; each sweet meal is one dot.
export const DAILY_TREAT_LIMIT = FOOD_GROUPS.find(group => group.id === 'treats')!.maxTarget;
const UNWELL_MOOD = { id: 'unwell' as const, label: 'Kõht on paha', message: 'Magusat sai täna liiga palju ja kõht tunneb end raskelt.' };
const WELL_MOOD = { id: 'well' as const, label: 'Hea olla', message: 'Mul on hea olla! Jätkan mitmekesiste toitudega.' };
export interface MoodState { score: number; unwell: boolean }
const INITIAL_MOOD: MoodState = { score: 65, unwell: false };

export function calculateMoodScore(totals: FoodGroupTotals, mealsEaten: number, previousMood = 65, consumption = totals): number {
  if (mealsEaten === 0) return previousMood;
  // Compare progress with the meals already eaten; missing groups matter more late in the day.
  const targetDots = REQUIRED_FOOD_GROUPS.reduce((sum, group) => sum + group.maxTarget, 0);
  const collected = REQUIRED_FOOD_GROUPS.reduce((sum, group) => sum + Math.min(group.maxTarget, totals[group.id]), 0);
  const progress = Math.min(1, collected / (targetDots * mealsEaten / 3));
  const represented = REQUIRED_FOOD_GROUPS.filter(group => totals[group.id] > 0).length;
  const diversity = represented / REQUIRED_FOOD_GROUPS.length;
  const missingPenalty = (REQUIRED_FOOD_GROUPS.length - represented) * Math.max(0, mealsEaten - 1);
  const excessTreats = Math.max(0, consumption.treats - DAILY_TREAT_LIMIT);
  const balancedMood = Math.round(progress * 70 + diversity * 30 - missingPenalty);
  const desired = excessTreats > 0 ? Math.min(balancedMood - excessTreats * 30, previousMood - excessTreats * 7) : balancedMood;
  return Math.round(Math.max(0, Math.min(100, previousMood + Math.max(-14, Math.min(14, desired - previousMood)))));
}

export function calculateMoodStateForDay(day: DaySelection, initial: MoodState = INITIAL_MOOD): MoodState {
  let totals = emptyTotals();
  return foodsForDay(day).reduce((state, food, index) => {
    const contributions = getFoodContributions(food, totals).filter(value => value.groupId !== 'treats');
    const diverse = contributions.length >= 3;
    totals = addFoodToTotals(totals, food);
    const excess = totals.treats > DAILY_TREAT_LIMIT;
    const recovers = diverse && !excess;
    const calculated = calculateMoodScore(totals, index + 1, state.score);
    // Diverse meals help gradually, even when carrying a low mood from yesterday.
    const score = recovers ? Math.max(calculated, Math.min(100, state.score + 7)) : calculated;
    return { score, unwell: excess || (state.unwell && !recovers) };
  }, initial);
}

export function calculateMoodForDay(day: DaySelection, initialScore = 65): number {
  return calculateMoodStateForDay(day, { score: initialScore, unwell: false }).score;
}

export function calculateMoodTimeline(days: DaySelection[]): MoodState[] {
  let state = INITIAL_MOOD;
  return days.map(day => {
    state = calculateMoodStateForDay(day, state);
    return state;
  });
}

export const getMood = (_score: number, consumption?: FoodGroupTotals, unwell = false) => unwell || (consumption && consumption.treats > DAILY_TREAT_LIMIT)
  ? UNWELL_MOOD : WELL_MOOD;
export const getMoodLabel = (score: number, consumption?: FoodGroupTotals) => getMood(score, consumption).label;
export const getMoodMessage = (score: number, consumption?: FoodGroupTotals) => getMood(score, consumption).message;

export function getMoodForDay(days: DaySelection[], index = days.length - 1) {
  const timeline = calculateMoodTimeline(days);
  const state = timeline[index] ?? INITIAL_MOOD;
  const mood = getMood(state.score, undefined, state.unwell);
  const inherited = state.unwell && (!days[index] || consumptionForDay(days[index]).treats <= DAILY_TREAT_LIMIT);
  return { ...state, ...mood, message: inherited
    ? 'Kõht on veel raske. Mitmekesised toidud ja vähem magusat aitavad enesetundel paraneda.'
    : mood.message };
}

export function calculateMoodForAdventure(days: DaySelection[]) {
  const mood = getMoodForDay(days);
  return { ...mood, message: mood.id === 'unwell'
    ? 'Kõht on veel raske. Järgmisel seiklusel aitab mitmekesine menüü ja vähem magusat enesetunnet parandada.' : mood.message };
}
