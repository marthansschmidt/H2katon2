import { describe, expect, it } from 'vitest';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { DailyMenuPlanner } from './dailyMenu';
import { emptyTotals, foodsForDay, getFoodGoalGain } from './foodPyramid';
import { calculateMoodForDay, calculateMoodScore, getMood, getMoodHint } from './mood';
import { chooseFood, createPlayerState, nextDay, nextMeal } from './state';
import { MEAL_ORDER } from '../types/game';

describe('raccoon mood follows food choices', () => {
  it('becomes concerned, tired and low on energy when the same limited meal leaves groups missing', () => {
    let player = createPlayerState();
    const cookie = MOCK_FOODS.find(food => food.id === 'oatcookie')!;
    expect(getMood(player.moodScore).id).toBe('calm');
    for (const [index, mood] of ['concerned', 'tired', 'low-energy'].entries()) {
      const previousMood = player.moodScore;
      player = chooseFood(player, cookie, 'Kohvik');
      expect(getMood(player.moodScore).id).toBe(mood);
      expect(player.moodScore).toBeLessThan(previousMood);
      expect(previousMood - player.moodScore).toBeLessThanOrEqual(14);
      expect(getMoodHint(player.moodScore, player.foodGroupTotals)).toContain('köögiviljad');
      expect(calculateMoodForDay(player.days[0])).toBe(player.moodScore);
      if (index < 2) player = nextMeal(player);
    }
    expect(nextDay(player).moodScore).toBe(65);
  });

  it('recovers when the next choice adds missing groups', () => {
    let player = chooseFood(createPlayerState(), MOCK_FOODS.find(food => food.id === 'oatcookie')!, 'Kohvik');
    const previousMood = player.moodScore;
    player = chooseFood(nextMeal(player), MOCK_FOODS.find(food => food.id === 'hummustoast')!, 'Kohvik');
    expect(player.moodScore).toBeGreaterThan(previousMood);
    expect(player.moodScore - previousMood).toBeLessThanOrEqual(14);
    expect(getMood(player.moodScore).id).toBe('calm');
    expect(getMoodHint(player.moodScore, player.foodGroupTotals)).toBeNull();
  });

  it('becomes visibly happy with good progress and joyful when the daily goals are filled', () => {
    let player = createPlayerState();
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    for (const [index, meal] of MEAL_ORDER.entries()) {
      const choices = planner.getChoices(meal, { totals: player.foodGroupTotals, selectedFoodIds: foodsForDay(player.days[0]).map(food => food.id) }, [], [], () => .4);
      const best = [...choices].sort((a, b) => getFoodGoalGain(b, player.foodGroupTotals) - getFoodGoalGain(a, player.foodGroupTotals))[0];
      player = chooseFood(player, best, 'Kohvik');
      expect(player.moodScore).toBeGreaterThan(65);
      expect(['happy', 'joyful']).toContain(getMood(player.moodScore).id);
      if (index < 2) player = nextMeal(player);
    }
    expect(getMood(player.moodScore).id).toBe('joyful');
    expect(getMoodHint(player.moodScore, player.foodGroupTotals)).toBeNull();
  });

  it('does not penalize an untouched day or optional treats', () => {
    expect(calculateMoodScore(emptyTotals(), 0)).toBe(65);
    const totals = Object.fromEntries(REQUIRED_FOOD_GROUPS.map(group => [group.id, group.maxTarget]));
    const complete = { ...emptyTotals(), ...totals };
    expect(calculateMoodScore(complete, 3, 65)).toBe(calculateMoodScore({ ...complete, treats: 2 }, 3, 65));
  });
});
