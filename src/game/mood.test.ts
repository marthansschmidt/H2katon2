import { describe, expect, it } from 'vitest';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { DailyMenuPlanner } from './dailyMenu';
import { consumptionForDay, emptyTotals, foodsForDay, getFoodGoalGain } from './foodPyramid';
import { calculateMoodForDay, calculateMoodScore, getMood, getMoodForDay } from './mood';
import { chooseFood, createPlayerState, nextDay, nextMeal } from './state';
import { MEAL_ORDER } from '../types/game';

describe('two mood states follow food choices', () => {
  it('exposes only well or unwell, independent of the internal energy score', () => {
    for (const score of [0, 24, 40, 65, 90, 100]) {
      expect(getMood(score).id).toBe('well');
      expect(getMood(score, { ...emptyTotals(), treats: 2 }).id).toBe('unwell');
      expect(getMood(score, emptyTotals(), true).id).toBe('unwell');
    }
  });
  it('repeated sweet meals cause illness and carry it into the next day', () => {
    let player = createPlayerState();
    const cookie = MOCK_FOODS.find(food => food.id === 'oatcookie')!;
    expect(getMood(player.moodScore).id).toBe('well');
    for (const [index, mood] of ['well', 'unwell', 'unwell'].entries()) {
      const previousMood = player.moodScore;
      player = chooseFood(player, cookie, 'Kohvik');
      expect(getMoodForDay(player.days).id).toBe(mood);
      expect(player.moodScore).toBeLessThan(previousMood);
      expect(previousMood - player.moodScore).toBeLessThanOrEqual(14);
      expect(calculateMoodForDay(player.days[0])).toBe(player.moodScore);
      if (index < 2) player = nextMeal(player);
    }
    expect(nextDay(player).moodScore).toBe(player.moodScore);
    expect(getMoodForDay(nextDay(player).days).id).toBe('unwell');
  });

  it('recovers when the next choice adds missing groups', () => {
    let player = chooseFood(createPlayerState(), MOCK_FOODS.find(food => food.id === 'oatcookie')!, 'Kohvik');
    const previousMood = player.moodScore;
    player = chooseFood(nextMeal(player), MOCK_FOODS.find(food => food.id === 'hummustoast')!, 'Kohvik');
    expect(player.moodScore).toBeGreaterThan(previousMood);
    expect(player.moodScore - previousMood).toBeLessThanOrEqual(14);
    expect(getMood(player.moodScore).id).toBe('well');
  });

  it('stays well while the daily goals are filled with diverse choices', () => {
    let player = createPlayerState();
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    for (const [index, meal] of MEAL_ORDER.entries()) {
      const choices = planner.getChoices(meal, { totals: player.foodGroupTotals, selectedFoodIds: foodsForDay(player.days[0]).map(food => food.id) }, [], [], () => .4);
      const best = [...choices].sort((a, b) => getFoodGoalGain(b, player.foodGroupTotals) - getFoodGoalGain(a, player.foodGroupTotals))[0];
      player = chooseFood(player, best, 'Kohvik');
      expect(player.moodScore).toBeGreaterThan(65);
      expect(getMoodForDay(player.days).id).toBe('well');
      if (index < 2) player = nextMeal(player);
    }
    expect(getMood(player.moodScore).id).toBe('well');
  });

  it('does not penalize an untouched day or optional treats', () => {
    expect(calculateMoodScore(emptyTotals(), 0)).toBe(65);
    expect(calculateMoodScore(emptyTotals(), 0, 24)).toBe(24);
    const totals = Object.fromEntries(REQUIRED_FOOD_GROUPS.map(group => [group.id, group.maxTarget]));
    const complete = { ...emptyTotals(), ...totals };
    expect(calculateMoodScore(complete, 3, 65)).toBe(calculateMoodScore({ ...complete, treats: 1 }, 3, 65));
    expect(calculateMoodScore({ ...complete, treats: 2 }, 3, 65)).toBeLessThan(65);
  });
  for (const character of ['raccoon', 'dinosaur'] as const) {
    it(`becomes unwell above one visible treat dot, including repeated cake (${character})`, () => {
      const cake = MOCK_FOODS.find(food => food.id === 'chococake')!;
      let player = chooseFood(createPlayerState(character), cake, 'Kohvik');
      expect(player.foodGroupTotals.treats).toBe(1);
      expect(consumptionForDay(player.days[0]).treats).toBe(1);
      expect(getMood(player.moodScore, consumptionForDay(player.days[0])).id).not.toBe('unwell');
      const previousMood = player.moodScore;
      player = chooseFood(nextMeal(player), cake, 'Kohvik');
      expect(player.foodGroupTotals.treats).toBe(2);
      expect(consumptionForDay(player.days[0]).treats).toBe(2);
      expect(getMood(player.moodScore, consumptionForDay(player.days[0])).id).toBe('unwell');
      expect(player.moodScore).toBeLessThan(previousMood);
      const fresh = nextDay(player);
      expect(fresh.moodScore).toBe(player.moodScore);
      expect(getMoodForDay(fresh.days).id).toBe('unwell');
    });
    it(`carries illness and recovers gradually with diverse meals without excess treats (${character})`, () => {
      const cake = MOCK_FOODS.find(food => food.id === 'chococake')!;
      let player = createPlayerState(character);
      for (let index = 0; index < 3; index++) {
        player = chooseFood(player, cake, 'Kohvik');
        if (index < 2) player = nextMeal(player);
      }
      const previousDayScore = player.moodScore;
      player = nextDay(player);
      expect(player.foodGroupTotals).toEqual(emptyTotals());
      expect(player.moodScore).toBe(previousDayScore);
      expect(getMoodForDay(player.days).id).toBe('unwell');
      const planner = new DailyMenuPlanner(MOCK_FOODS);
      for (const [index, meal] of MEAL_ORDER.entries()) {
        const choices = planner.getChoices(meal, { totals: player.foodGroupTotals, selectedFoodIds: foodsForDay(player.days[1]).map(food => food.id) });
        const best = [...choices].sort((a, b) => getFoodGoalGain(b, player.foodGroupTotals) - getFoodGoalGain(a, player.foodGroupTotals))[0];
        const previousMood = player.moodScore;
        player = chooseFood(player, best, 'Kohvik');
        expect(player.moodScore).toBeGreaterThan(previousMood);
        expect(player.moodScore - previousMood).toBeLessThanOrEqual(14);
        expect(getMoodForDay(player.days).id).not.toBe('unwell');
        if (index < 2) player = nextMeal(player);
      }
      expect(player.days[1].score).toBe(1000);
      expect(player.moodScore).toBeGreaterThan(previousDayScore);
      const recovered = player.moodScore;
      player = nextDay(player);
      expect(player.moodScore).toBe(recovered);
      // One cake does not repeat today's excess, but is not enough variety to heal an inherited illness.
      let ill = createPlayerState(character);
      for (let index = 0; index < 3; index++) {
        ill = chooseFood(ill, cake, 'Kohvik');
        if (index < 2) ill = nextMeal(ill);
      }
      ill = chooseFood(nextDay(ill), cake, 'Kohvik');
      expect(getMoodForDay(ill.days).id).toBe('unwell');
      ill = chooseFood(nextMeal(ill), MOCK_FOODS.find(food => food.id === 'caesar')!, 'Kohvik');
      expect(getMoodForDay(ill.days).id).not.toBe('unwell');
      ill = chooseFood(nextMeal(ill), cake, 'Kohvik');
      expect(getMoodForDay(ill.days).id).toBe('unwell');
    });
  }
});
