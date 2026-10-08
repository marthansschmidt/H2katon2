import { describe, expect, it } from 'vitest';
import { FOOD_GROUPS, portionsToDots, PORTIONS_PER_DOT } from '../data/foodGroups';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { emptyTotals, getFoodContributions } from './foodPyramid';
import { FULL_DAY_BONUS, MAX_DAILY_SCORE, POINTS_PER_DOT } from './scoring';

describe('portsjonite arvestus tervete mummudena', () => {
  it.each([[0, 0], [1, 1], [2, 1], [3, 2], [4, 2], [5, 3], [10, 5]])('%i portsjonit annab %i mummu', (portions, dots) => {
    expect(portionsToDots(portions)).toBe(dots);
  });

  it('kasutab valitud päevaseid eesmärke ja hoiab maksimumskoori 1000', () => {
    expect(PORTIONS_PER_DOT).toBe(2);
    expect(Object.fromEntries(FOOD_GROUPS.map(group => [group.id, group.maxTarget]))).toEqual({
      treats: 1, protein: 2, dairy: 2, fats: 3, grains: 5, vegetables: 2, fruits: 2,
    });
    const required = FOOD_GROUPS.filter(group => group.minTarget > 0);
    expect(required.reduce((sum, group) => sum + group.maxTarget, 0) * POINTS_PER_DOT + FULL_DAY_BONUS).toBe(MAX_DAILY_SCORE);
    expect(FULL_DAY_BONUS).toBe(200);
  });

  it('ümardab kolm köögiviljaportsjonit kaheks mummuks ja kuvab ainult täisarve', () => {
    const soup = MOCK_FOODS.find(food => food.id === 'soup')!;
    expect(getFoodContributions(soup, emptyTotals())).toContainEqual({ groupId: 'vegetables', points: 2 });
    for (const food of MOCK_FOODS) for (const value of getFoodContributions(food, emptyTotals())) {
      expect(Number.isInteger(value.points)).toBe(true);
    }
    const fractional = { ...soup, groups: [{ groupId: 'vegetables' as const, points: 1.5 }] };
    expect(getFoodContributions(fractional, emptyTotals())).toEqual([{ groupId: 'vegetables', points: 2 }]);
    expect(getFoodContributions(fractional, { ...emptyTotals(), vegetables: 1 })).toEqual([{ groupId: 'vegetables', points: 1 }]);
  });
});
