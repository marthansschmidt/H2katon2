import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { chooseFood, createPlayerState, nextDay, nextMeal } from './state';
import { DINOSAUR_UNLOCK_KEY, hasEarnedDinosaur, loadDinosaurUnlocked, saveDinosaurUnlocked } from './characters';
import { MAX_GAME_SCORE } from './scoring';
import { saveGame } from './storage';

function adventure(dinner = 'herring', dayCount = 3) {
  let player = createPlayerState();
  for (let day = 0; day < dayCount; day++) {
    for (const [index, id] of ['oats', 'caesar', day === dayCount - 1 ? dinner : 'herring'].entries()) {
      player = chooseFood(player, MOCK_FOODS.find(food => food.id === id)!, 'Kohvik');
      if (index < 2) player = nextMeal(player);
    }
    if (day < dayCount - 1) player = nextDay(player);
  }
  return player;
}

describe('dinosauruse avamine', () => {
  let entries: Map<string, string>;
  beforeEach(() => {
    entries = new Map();
    vi.stubGlobal('localStorage', { getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => entries.set(key, value) });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('on alguses lukus ja avaneb kolme täispunktidega päeva eest', () => {
    expect(loadDinosaurUnlocked()).toBe(false);
    const player = adventure();
    expect(player.score).toBe(MAX_GAME_SCORE);
    expect(hasEarnedDinosaur(player)).toBe(true);
  });
  it('ei avane ühe täispunktidega päeva ega 2700 punkti eest', () => {
    expect(hasEarnedDinosaur(adventure('herring', 1))).toBe(false);
    const player = adventure('smoothie');
    expect(player.score).toBe(2700);
    expect(hasEarnedDinosaur(player)).toBe(false);
  });
  it('kontrollib toiduvalikuid, mitte salvestusse kirjutatud maksimumskoori', () => {
    const player = adventure('smoothie');
    expect(hasEarnedDinosaur({ ...player, score: MAX_GAME_SCORE })).toBe(false);
    const perfect = adventure();
    const days = perfect.days.map((day, i) => i === 2 ? { ...day, dinner: undefined } : day);
    expect(hasEarnedDinosaur({ ...perfect, days })).toBe(false);
  });
  it('säilitab avamise ka uue mängu salvestamisel', () => {
    expect(saveDinosaurUnlocked()).toBe(true);
    expect(entries.get(DINOSAUR_UNLOCK_KEY)).toBe('true');
    saveGame(createPlayerState('dinosaur'), 'tutorial', 'tutorial', true);
    expect(loadDinosaurUnlocked()).toBe(true);
    saveGame(createPlayerState(), 'home', 'tutorial', false);
    expect(loadDinosaurUnlocked()).toBe(true);
  });
  it('ignoreerib vigast avamise märget', () => {
    for (const value of ['false', 'broken', '{"dinosaur":true}']) {
      entries.set(DINOSAUR_UNLOCK_KEY, value);
      expect(loadDinosaurUnlocked()).toBe(false);
    }
  });
  it('ei peata mängu, kui kohalik salvestamine on blokeeritud', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } });
    expect(loadDinosaurUnlocked()).toBe(false);
    expect(saveDinosaurUnlocked()).toBe(false);
  });
});
