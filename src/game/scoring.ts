import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { addFoodToTotals, getFoodGoalGain, isDayComplete, totalsForDay } from './foodPyramid';
import { MEAL_ORDER, type DaySelection, type Food, type FoodGroupTotals, type MealTime } from '../types/game';

export const MAX_DAILY_SCORE = 1000;
export const MAX_GAME_SCORE = MAX_DAILY_SCORE * 3;
export const POINTS_PER_DOT = 50;
export const FULL_DAY_BONUS = MAX_DAILY_SCORE - REQUIRED_FOOD_GROUPS.reduce((sum, group) => sum + group.maxTarget, 0) * POINTS_PER_DOT;

export const calculateScore = (food: Food, previousTotals: FoodGroupTotals): number => getFoodGoalGain(food, previousTotals) * POINTS_PER_DOT;
export const dayBonus = (totals: FoodGroupTotals): number => isDayComplete(totals) ? FULL_DAY_BONUS : 0;
export const calculateChoiceScore = (food: Food, previousTotals: FoodGroupTotals, meal?: MealTime): number => calculateScore(food, previousTotals)
  + (meal === 'dinner' ? dayBonus(addFoodToTotals(previousTotals, food)) : 0);

export function calculateDayScore(day: DaySelection): number {
  const totals = totalsForDay(day);
  const dots = REQUIRED_FOOD_GROUPS.reduce((sum, group) => sum + totals[group.id], 0);
  const bonus = MEAL_ORDER.every(meal => day[meal]) ? dayBonus(totals) : 0;
  return Math.min(MAX_DAILY_SCORE, dots * POINTS_PER_DOT + bonus);
}

export type GradeLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export interface ScoreGrade { letter: GradeLetter; minScore: number; title: string; feedback: string }

export const SCORE_GRADES: readonly ScoreGrade[] = [
  { letter: 'A', minScore: 2700, title: 'Suurepärane', feedback: 'Oled tõeline maitsemeister! Täitsid päeva eesmärke väga osavalt.' },
  { letter: 'B', minScore: 2400, title: 'Väga hea', feedback: 'Tegid palju häid valikuid. Järgmisel seiklusel proovi täita ka viimased puuduvad mummud.' },
  { letter: 'C', minScore: 2100, title: 'Hea', feedback: 'Leidsid mitmekesiseid maitseid. Jälgi puuduvaid gruppe, et koguda veel rohkem punkte.' },
  { letter: 'D', minScore: 1800, title: 'Rahuldav', feedback: 'Mõned eesmärgid said täidetud. Võrdle kolme valikut ja otsi suurimat mummude juurdekasvu.' },
  { letter: 'E', minScore: 1500, title: 'Arenguruumi on', feedback: 'Seiklus on hea algus! Järgmisel korral keskendu veel täitmata põhigruppidele.' },
  { letter: 'F', minScore: 0, title: 'Proovi uuesti', feedback: 'Iga seiklus õpetab midagi uut. Proovi uuesti ja vali toite, mis lisavad kõige rohkem puuduvaid mummusid.' },
];

export function getScoreGrade(score: number): ScoreGrade {
  const normalized = Number.isFinite(score) ? Math.max(0, Math.min(MAX_GAME_SCORE, score)) : 0;
  return SCORE_GRADES.find(grade => normalized >= grade.minScore)!;
}
