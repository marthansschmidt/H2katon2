import { calculateDayScore, MAX_GAME_SCORE } from './scoring';
import { MEAL_ORDER, type PlayerState } from '../types/game';

export const DINOSAUR_UNLOCK_KEY = 'pesukaru-dinosaur-unlocked-v1';

export function hasEarnedDinosaur(player: PlayerState): boolean {
  return player.currentDay === 3 && player.days.length === 3
    && player.days.every(day => MEAL_ORDER.every(meal => day[meal]))
    && player.days.reduce((total, day) => total + calculateDayScore(day), 0) === MAX_GAME_SCORE;
}

export function loadDinosaurUnlocked(): boolean {
  try { return localStorage.getItem(DINOSAUR_UNLOCK_KEY) === 'true'; } catch { return false; }
}

export function saveDinosaurUnlocked(): boolean {
  try { localStorage.setItem(DINOSAUR_UNLOCK_KEY, 'true'); return true; } catch { return false; }
}
