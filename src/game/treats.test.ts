import { describe, expect, it } from 'vitest';
import { FOOD_GROUPS, REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { addFoodToTotals, calculateFoodGroupTotals, emptyTotals, getFoodContributions, getFoodGoalGain } from './foodPyramid';
import { calculateChoiceScore } from './scoring';
import { chooseFood, createPlayerState, nextDay, nextMeal } from './state';

const cake = MOCK_FOODS.find(food => food.id === 'chococake')!;

describe('treat dots may exceed the daily limit', () => {
  it('adds at most one treat dot per choice while main groups stay capped', () => {
    const totals = calculateFoodGroupTotals([cake, cake, cake]);
    expect(totals.treats).toBe(3);
    expect(totals.grains).toBe(3);
    expect(totals.fats).toBe(3);
    for (const group of REQUIRED_FOOD_GROUPS) expect(totals[group.id]).toBeLessThanOrEqual(group.maxTarget);
    expect(getFoodContributions(cake, totals)).toContainEqual({ groupId: 'treats', points: 1 });
    expect(addFoodToTotals(totals, cake).treats).toBe(4);
  });

  it('excess treats do not grant goal progress or extra score', () => {
    const full = { ...emptyTotals(), ...Object.fromEntries(REQUIRED_FOOD_GROUPS.map(group => [group.id, group.maxTarget])), treats: 6 };
    expect(getFoodContributions(cake, full)).toEqual([{ groupId: 'treats', points: 1 }]);
    expect(getFoodGoalGain(cake, full)).toBe(0);
    expect(calculateChoiceScore(cake, full, 'dinner')).toBe(0);
    for (const group of FOOD_GROUPS) if (group.id !== 'treats') expect(addFoodToTotals(full, cake)[group.id]).toBe(full[group.id]);
  });

  for (const character of ['raccoon', 'dinosaur'] as const) {
    it(`allows three sweet meals and resets the dots next day (${character})`, () => {
      let player = createPlayerState(character);
      for (let count = 1; count <= 3; count++) {
        player = chooseFood(player, cake, 'Kohvik');
        expect(player.foodGroupTotals.treats).toBe(count);
        if (count < 3) player = nextMeal(player);
      }
      expect(nextDay(player).foodGroupTotals.treats).toBe(0);
      expect(chooseFood(player, cake, 'Kohvik')).toBe(player);
    });
  }
});
