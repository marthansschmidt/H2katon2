import { calculateDayBalance } from './foodPyramid';
import type { FoodGroupTotals } from '../types/game';
export function calculateMoodScore(totals: FoodGroupTotals, mealsEaten: number, previousMood = 65): number {
  if (mealsEaten === 0) return 65;
  // Compare to the expected progress through the day, then smooth each change.
  const projected = Object.fromEntries(Object.entries(totals).map(([id, value]) => [id, value * 3 / mealsEaten])) as FoodGroupTotals;
  const balance = calculateDayBalance(projected);
  const diversity = Object.entries(totals).filter(([id, value]) => id !== 'treats' && value > 0).length / 7;
  const desired = Math.round(balance * 0.65 + diversity * 35);
  return Math.round(Math.max(0, Math.min(100, previousMood + Math.max(-14, Math.min(14, desired - previousMood)))));
}
export function getMoodLabel(score: number) {
  if (score >= 90) return 'Väga rõõmus';
  if (score >= 70) return 'Hea enesetunne';
  if (score >= 50) return 'Rahulik ja uudishimulik';
  if (score >= 30) return 'Veidi väsinud';
  return 'Vajab turgutust';
}
export function getMoodMessage(score: number) {
  if (score >= 90) return 'Nii palju maitseid! Seiklus võib jätkuda.';
  if (score >= 70) return 'Kõht rõõmus, käpad seikluseks valmis!';
  if (score >= 50) return 'Huvitav, mida järgmisena proovime?';
  return 'Võtaks vahelduseks midagi uut?';
}
