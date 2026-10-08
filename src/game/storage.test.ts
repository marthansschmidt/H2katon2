import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { chooseFood, createPlayerState, nextDay, nextMeal } from './state';
import { getMoodForDay } from './mood';
import { loadGame, SAVE_KEY, saveGame } from './storage';
describe('mängu turvaline kohalik salvestamine', () => {
  let entries: Map<string, string>;
  beforeEach(() => {
    entries = new Map();
    vi.stubGlobal('localStorage', { getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => entries.set(key, value) });
  });
  afterEach(() => vi.unstubAllGlobals());
  for (const character of ['raccoon', 'dinosaur'] as const) {
    it(`taastab järgmise hommiku päritud enesetunde ning taastumise (${character})`, () => {
      const cake = MOCK_FOODS.find(food => food.id === 'chococake')!;
      let player = createPlayerState(character);
      for (let index = 0; index < 3; index++) {
        player = chooseFood(player, cake, 'Kohvik');
        if (index < 2) player = nextMeal(player);
      }
      player = nextDay(player);
      saveGame(player, 'map', 'map', true);
      const save = JSON.parse(entries.get(SAVE_KEY)!);
      // Old saves reset the second day's score, so rebuild it from the full adventure.
      save.player.moodScore = 65;
      entries.set(SAVE_KEY, JSON.stringify(save));
      let restored = loadGame()!.player;
      expect(restored.moodScore).toBe(player.moodScore);
      expect(getMoodForDay(restored.days).id).toBe('unwell');
      const breakfast = MOCK_FOODS.find(food => food.id === 'oats')!;
      restored = chooseFood(restored, breakfast, 'Kohvik');
      expect(restored.moodScore).toBeGreaterThan(player.moodScore);
      expect(getMoodForDay(restored.days).id).not.toBe('unwell');
      saveGame(restored, 'map', 'map', true);
      expect(loadGame()?.player).toEqual(restored);
    });
  }
  it('taastab maiustuste tegeliku koguse ka varem ühe mummuni piiratud salvestusest', () => {
    const cake = MOCK_FOODS.find(food => food.id === 'chococake')!;
    let player = chooseFood(createPlayerState(), cake, 'Kohvik');
    player = chooseFood(nextMeal(player), cake, 'Kohvik');
    player = chooseFood(nextMeal(player), cake, 'Kohvik');
    saveGame(player, 'daySummary', 'daySummary', true);
    const save = JSON.parse(entries.get(SAVE_KEY)!);
    save.player.foodGroupTotals.treats = 1;
    entries.set(SAVE_KEY, JSON.stringify(save));
    expect(loadGame()?.player.foodGroupTotals.treats).toBe(3);
    expect(loadGame()?.player.score).toBe(player.score);
    expect(loadGame()?.player.moodScore).toBe(player.moodScore);
  });
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
  it('säilitab valitud tegelase ka enne mängu alustamist', () => {
    saveGame(createPlayerState('dinosaur'), 'home', 'tutorial', false);
    expect(loadGame()?.player.character).toBe('dinosaur');
  });
  it('taastab tegelase valikuta vana salvestuse pesukaruga, säilitades progressi', () => {
    const state = chooseFood(createPlayerState(), MOCK_FOODS[0], 'Kohvik');
    saveGame(state, 'map', 'map', true);
    const save = JSON.parse(entries.get(SAVE_KEY)!);
    delete save.player.character;
    entries.set(SAVE_KEY, JSON.stringify(save));
    expect(loadGame()?.player).toEqual(state);
    save.player.character = 'unknown';
    entries.set(SAVE_KEY, JSON.stringify(save));
    expect(loadGame()).toBeNull();
  });
  it('arvutab varasema punktisüsteemi skoori toiduvalikute järgi uuesti', () => {
    const state = chooseFood(createPlayerState(), MOCK_FOODS[0], 'Kohvik');
    saveGame(state, 'map', 'map', true);
    const save = JSON.parse(entries.get(SAVE_KEY)!);
    save.player.score = 9999;
    save.player.days[0].score = 9999;
    entries.set(SAVE_KEY, JSON.stringify(save));
    const restored = loadGame()!.player;
    expect(restored.score).toBe(state.score);
    expect(restored.days[0].score).toBe(state.days[0].score);
    expect(restored.days[0].breakfast?.id).toBe(state.days[0].breakfast?.id);
  });
  it('taastab vana mängu ilma veegrupita ning loosib aegunud menüüd uuesti', () => {
    const state = chooseFood({ ...createPlayerState(), offers: { raekoja: MOCK_FOODS.slice(0, 3) } }, MOCK_FOODS[2], 'Kohvik');
    saveGame(state, 'map', 'map', true);
    const save = JSON.parse(entries.get(SAVE_KEY)!);
    save.version = 1;
    save.player.days[0].waterMeals = ['breakfast'];
    save.player.days[0].breakfast.groups.push({ groupId: 'drinks', points: 1 });
    save.player.foodGroupTotals.drinks = 2;
    entries.set(SAVE_KEY, JSON.stringify(save));
    const restored = loadGame()!;
    expect(restored.version).toBe(4);
    expect(restored.player.days[0].breakfast?.id).toBe('yogurt');
    expect(restored.player.days[0]).not.toHaveProperty('waterMeals');
    expect(restored.player.foodGroupTotals).not.toHaveProperty('drinks');
    expect(restored.player.days[0].breakfast?.groups.some(group => String(group.groupId) === 'drinks')).toBe(false);
    expect(restored.player.offers).toEqual({});
    expect(restored.player.score).toBe(state.score);
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
  it('viib vana püramiidi mummud uutele eesmärkidele üle, säilitades valitud toidu', () => {
    const yogurt = MOCK_FOODS.find(food => food.id === 'yogurt')!;
    const state = chooseFood({ ...createPlayerState(), offers: { raekoja: [yogurt] } }, yogurt, 'Kohvik');
    saveGame(state, 'map', 'map', true);
    const save = JSON.parse(entries.get(SAVE_KEY)!);
    save.version = 2;
    save.player.days[0].breakfast.groups = [
      { groupId: 'dairy', points: 2 }, { groupId: 'fruits', points: 2 }, { groupId: 'grains', points: 1 },
    ];
    save.player.foodGroupTotals = { ...state.foodGroupTotals, dairy: 1, fruits: 2 };
    save.player.score = save.player.days[0].score = 200;
    entries.set(SAVE_KEY, JSON.stringify(save));
    const restored = loadGame()!;
    expect(restored.version).toBe(4);
    expect(restored.player.days[0].breakfast?.id).toBe('yogurt');
    expect(restored.player.days[0].restaurantNames.breakfast).toBe('Kohvik');
    expect(restored.player.foodGroupTotals).toEqual({ ...state.foodGroupTotals, dairy: 2, fruits: 2 });
    expect(restored.player.score).toBe(state.score);
    expect(restored.player.offers).toEqual({});
  });
  it('viib versiooni 3 toiduvaliku uuele portsjonite arvestusele', () => {
    const yogurt = MOCK_FOODS.find(food => food.id === 'yogurt')!;
    const state = chooseFood({ ...createPlayerState(), offers: { raekoja: [yogurt] } }, yogurt, 'Kohvik');
    saveGame(state, 'map', 'map', true);
    const save = JSON.parse(entries.get(SAVE_KEY)!);
    save.version = 3;
    save.player.days[0].breakfast.groups = [
      { groupId: 'dairy', points: 3 }, { groupId: 'fruits', points: 4 }, { groupId: 'grains', points: 1 },
    ];
    entries.set(SAVE_KEY, JSON.stringify(save));
    const restored = loadGame()!;
    expect(restored.version).toBe(4);
    expect(restored.player.days[0].breakfast?.groups).toEqual(yogurt.groups);
    expect(restored.player.foodGroupTotals).toEqual(state.foodGroupTotals);
    expect(restored.player.score).toBe(state.score);
    expect(restored.player.offers).toEqual({});
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
