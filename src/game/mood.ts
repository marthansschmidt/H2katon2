import { addFoodToTotals, emptyTotals, foodsForDay } from './foodPyramid';
import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import type { DaySelection, FoodGroupTotals } from '../types/game';

export type MoodId = 'joyful' | 'happy' | 'calm' | 'concerned' | 'tired' | 'low-energy';
const MOODS: readonly { id: MoodId; minScore: number; label: string; message: string }[] = [
  { id: 'joyful', minScore: 90, label: 'Väga rõõmus', message: 'Nii palju maitseid! Seiklus võib jätkuda.' },
  { id: 'happy', minScore: 75, label: 'Rõõmus ja energiline', message: 'Kõht rõõmus, käpad seikluseks valmis!' },
  { id: 'calm', minScore: 55, label: 'Rahulik ja uudishimulik', message: 'Huvitav, mida järgmisena proovime?' },
  { id: 'concerned', minScore: 40, label: 'Veidi murelik', message: 'Mõni toidugrupp on veel puudu. Proovime midagi uut!' },
  { id: 'tired', minScore: 30, label: 'Väsinud', message: 'Energiat napib. Otsime puuduvaid toidugruppe.' },
  { id: 'low-energy', minScore: 0, label: 'Vajab turgutust', message: 'Võtame rahulikult ja proovime järgmisel korral midagi uut.' },
];

export function calculateMoodScore(totals: FoodGroupTotals, mealsEaten: number, previousMood = 65): number {
  if (mealsEaten === 0) return 65;
  // Compare progress with the meals already eaten; missing groups matter more late in the day.
  const targetDots = REQUIRED_FOOD_GROUPS.reduce((sum, group) => sum + group.maxTarget, 0);
  const collected = REQUIRED_FOOD_GROUPS.reduce((sum, group) => sum + Math.min(group.maxTarget, totals[group.id]), 0);
  const progress = Math.min(1, collected / (targetDots * mealsEaten / 3));
  const represented = REQUIRED_FOOD_GROUPS.filter(group => totals[group.id] > 0).length;
  const diversity = represented / REQUIRED_FOOD_GROUPS.length;
  const missingPenalty = (REQUIRED_FOOD_GROUPS.length - represented) * Math.max(0, mealsEaten - 1);
  const desired = Math.round(progress * 70 + diversity * 30 - missingPenalty);
  return Math.round(Math.max(0, Math.min(100, previousMood + Math.max(-14, Math.min(14, desired - previousMood)))));
}

export function calculateMoodForDay(day: DaySelection): number {
  let totals = emptyTotals();
  return foodsForDay(day).reduce((mood, food, index) => {
    totals = addFoodToTotals(totals, food);
    return calculateMoodScore(totals, index + 1, mood);
  }, 65);
}

export const getMood = (score: number) => MOODS.find(mood => score >= mood.minScore) ?? MOODS[MOODS.length - 1];
export const getMoodLabel = (score: number) => getMood(score).label;
export const getMoodMessage = (score: number) => getMood(score).message;

export function getMoodHint(score: number, totals: FoodGroupTotals): string | null {
  if (score >= 55) return null;
  const missing = REQUIRED_FOOD_GROUPS.filter(group => totals[group.id] < group.maxTarget)
    .sort((a, b) => totals[a.id] / a.maxTarget - totals[b.id] / b.maxTarget)[0];
  return missing ? `Järgmiseks: ${missing.shortName.toLowerCase()}.` : null;
}
