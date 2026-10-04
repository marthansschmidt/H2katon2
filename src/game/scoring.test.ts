import { describe, expect, it } from 'vitest';
import { MOCK_FOODS } from '../data/mockRestaurants';
import { MEAL_ORDER } from '../types/game';
import { DailyMenuPlanner } from './dailyMenu';
import { emptyTotals, getFoodGoalGain } from './foodPyramid';
import { calculateChoiceScore, calculateDayScore, calculateScore, getScoreGrade } from './scoring';
import { chooseFood, createPlayerState, nextMeal } from './state';

describe('choice scores and final grades', () => {
  it('awards more points for the better choice and only counts missing main-group dots', () => {
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    const totals = emptyTotals();
    const menu = planner.getChoices('breakfast', { totals, selectedFoodIds: [] }, [], [], () => 0.4);
    const sorted = [...menu].sort((a, b) => getFoodGoalGain(b, totals) - getFoodGoalGain(a, totals));
    expect(calculateScore(sorted[0], totals)).toBeGreaterThan(calculateScore(sorted[1], totals));
    const cookie = MOCK_FOODS.find(food => food.id === 'oatcookie')!;
    // Already filled groups and optional sweets must not inflate the score.
    expect(calculateScore(cookie, { ...totals, grains: 4, dairy: 1, fats: 1 })).toBe(0);
  });

  it('matches advertised choice points to actual gains, including the final 300-point bonus', () => {
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    let state = createPlayerState();
    for (const meal of MEAL_ORDER) {
      const ids = MEAL_ORDER.flatMap(key => state.days[0][key] ? [state.days[0][key]!.id] : []);
      const menu = planner.getChoices(meal, { totals: state.foodGroupTotals, selectedFoodIds: ids });
      const best = [...menu].sort((a, b) => getFoodGoalGain(b, state.foodGroupTotals) - getFoodGoalGain(a, state.foodGroupTotals))[0];
      const displayedPoints = calculateChoiceScore(best, state.foodGroupTotals, meal);
      const previousScore = state.score;
      state = chooseFood(state, best, 'Kohvik');
      expect(state.score - previousScore).toBe(displayedPoints);
      if (meal !== 'dinner') {
        expect(state.score).toBeLessThan(1000);
        state = nextMeal(state);
      }
    }
    expect(calculateDayScore(state.days[0])).toBe(1000);
    expect(state.score).toBe(1000);
    const { dinner: _dinner, ...unfinishedDay } = state.days[0];
    expect(calculateDayScore(unfinishedDay)).toBeLessThanOrEqual(700);
  });

  it.each([
    [0, 'F'], [1499, 'F'], [1500, 'E'], [1799, 'E'], [1800, 'D'],
    [2099, 'D'], [2100, 'C'], [2399, 'C'], [2400, 'B'], [2699, 'B'],
    [2700, 'A'], [3000, 'A'],
  ])('gives %i points grade %s at each boundary', (score, letter) => {
    expect(getScoreGrade(score).letter).toBe(letter);
  });
});
