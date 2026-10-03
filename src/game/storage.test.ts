import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { chooseFood, createPlayerState } from './state';
import { loadGame, SAVE_KEY, saveGame } from './storage';
describe('mängu turvaline kohalik salvestamine', () => {
  let entries: Map<string, string>;
  beforeEach(() => {
    entries = new Map();
    vi.stubGlobal('localStorage', { getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => entries.set(key, value) });
  });
  afterEach(() => vi.unstubAllGlobals());
  it('taastab pooleli jäänud toiduvaliku ning menüü', () => {
    const state = chooseFood({ ...createPlayerState(), restaurantIds: ['raekoja'], offers: { raekoja: MOCK_FOODS.slice(0, 3) } }, MOCK_FOODS[0], 'Raekoja Kohvik');
    expect(saveGame(state, 'map', 'map', true)).toBe(true);
    expect(loadGame()?.player).toEqual(state);
    expect(loadGame()?.started).toBe(true);
  });
  it('ei pea värskendatud avalehte juba alustatud mänguks', () => {
    saveGame(createPlayerState(), 'home', 'tutorial', false);
    expect(loadGame()?.started).toBe(false);
  });
  it('taastab ka vanema salvestuse, kus eelmise toidukorra kohad puuduvad', () => {
    saveGame(createPlayerState(), 'map', 'map', true);
    const save = JSON.parse(entries.get(SAVE_KEY)!);
    delete save.player.previousRestaurantIds;
    entries.set(SAVE_KEY, JSON.stringify(save));
    expect(loadGame()?.player.previousRestaurantIds).toEqual([]);
    save.player.previousRestaurantIds = [123];
    entries.set(SAVE_KEY, JSON.stringify(save));
    expect(loadGame()).toBeNull();
  });
  it('ignoreerib katkist JSON-i ja vigaseid mummugruppe', () => {
    entries.set(SAVE_KEY, '{broken');
    expect(loadGame()).toBeNull();
    saveGame(createPlayerState(), 'map', 'map', true);
    const value = JSON.parse(entries.get(SAVE_KEY)!);
    value.player.offers = { raekoja: [{ ...MOCK_FOODS[0], groups: [{ groupId: 'unknown', points: 4 }] }] };
    entries.set(SAVE_KEY, JSON.stringify(value));
    expect(loadGame()).toBeNull();
  });
  it('ei taasta puuduvate toitudega kokkuvõtteekraani isegi menüü kaudu', () => {
    saveGame(createPlayerState(), 'home', 'daySummary', true);
    expect(loadGame()).toBeNull();
    saveGame(createPlayerState(), 'final', 'final', true);
    expect(loadGame()).toBeNull();
  });
  it('jätab mängu kasutatavaks, kui brauser ei luba salvestada', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } });
    expect(loadGame()).toBeNull();
    expect(saveGame(createPlayerState(), 'map', 'map', true)).toBe(false);
  });
});
