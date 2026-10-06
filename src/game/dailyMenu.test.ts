import { describe, expect, it } from 'vitest';
import { MOCK_FOODS, MOCK_RESTAURANTS } from '../data/mockRestaurants';
import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { MEAL_ORDER, type Food } from '../types/game';
import { DailyMenuPlanner } from './dailyMenu';
import { addFoodToTotals, calculateDayBalance, calculateFoodGroupTotals, emptyTotals, getFoodGoalGain, isDayComplete } from './foodPyramid';
import { dayBonus } from './scoring';
import { chooseFood, createPlayerState, nextDay, nextMeal } from './state';

describe('three choices and reachable daily goals', () => {
  it('keeps every winning prefix reachable at all twelve restaurants, with exactly one best choice', () => {
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    const visited = new Set<string>();
    const inspect = (selected: Food[]) => {
      const mealIndex = selected.length;
      const ids = selected.map(food => food.id);
      const totals = calculateFoodGroupTotals(selected);
      if (mealIndex === 3) {
        expect(isDayComplete(totals)).toBe(true);
        expect(calculateDayBalance(totals)).toBe(100);
        expect(dayBonus(totals)).toBe(0);
        return;
      }
      const key = `${mealIndex}/${[...ids].sort().join(',')}`;
      if (visited.has(key)) return;
      visited.add(key);
      expect(isDayComplete(totals)).toBe(false);
      const meal = MEAL_ORDER[mealIndex];
      for (const restaurant of MOCK_RESTAURANTS) {
        // All foods have already been seen: variety preferences must never remove the winning choice.
        const menu = planner.getChoices(meal, { totals, selectedFoodIds: ids }, restaurant.meals.map(food => food.id), MOCK_FOODS.map(food => food.id), () => 0.37);
        expect(new Set(menu.map(food => food.id)).size).toBe(3);
        const gains = menu.map(food => getFoodGoalGain(food, totals));
        const best = Math.max(...gains);
        expect(gains.filter(gain => gain === best)).toHaveLength(1);
        expect(best).toBeGreaterThan(0);
        for (const food of menu) {
          expect(food.mealTimes).toContain(meal);
          expect(ids).not.toContain(food.id);
          const reachable = planner.canCompleteDay(addFoodToTotals(totals, food), MEAL_ORDER.slice(mealIndex + 1), [...ids, food.id]);
          expect(reachable, `${restaurant.name}: ${[...ids, food.id].join(', ')}`).toBe(getFoodGoalGain(food, totals) === best);
        }
      }
      // Check every possible winning continuation, not just a single random run.
      for (const food of MOCK_FOODS) if (food.mealTimes.includes(meal) && !ids.includes(food.id)
        && planner.canCompleteDay(addFoodToTotals(totals, food), MEAL_ORDER.slice(mealIndex + 1), [...ids, food.id])) inspect([...selected, food]);
    };
    inspect([]);
    expect(visited.size).toBeGreaterThan(100);
  }, 15000);

  it('still offers three distinct choices with one greatest gain after weaker choices', () => {
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    for (const breakfast of MOCK_FOODS.filter(food => food.mealTimes.includes('breakfast'))) {
      for (const lunch of MOCK_FOODS.filter(food => food.mealTimes.includes('lunch') && food.id !== breakfast.id)) {
        const totals = calculateFoodGroupTotals([breakfast, lunch]);
        const menu = planner.getChoices('dinner', { totals, selectedFoodIds: [breakfast.id, lunch.id] }, [], [], () => 0.71);
        const gains = menu.map(food => getFoodGoalGain(food, totals));
        expect(new Set(menu.map(food => food.id)).size).toBe(3);
        expect(gains.filter(gain => gain === Math.max(...gains))).toHaveLength(1);
      }
    }
  }, 15000);

  it('fills the six main groups on each of three days and resets the goal between days', () => {
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    let state = createPlayerState();
    for (let day = 0; day < 3; day++) {
      expect(state.foodGroupTotals).toEqual(emptyTotals());
      for (const meal of MEAL_ORDER) {
        const selected = Object.values(state.days[day]).filter((value): value is Food => !!value && typeof value === 'object' && 'groups' in value);
        const menu = planner.getChoices(meal, { totals: state.foodGroupTotals, selectedFoodIds: selected.map(food => food.id) });
        const best = [...menu].sort((a, b) => getFoodGoalGain(b, state.foodGroupTotals) - getFoodGoalGain(a, state.foodGroupTotals))[0];
        state = chooseFood(state, best, 'Näidiskoht');
        if (meal !== 'dinner') state = nextMeal(state);
      }
      for (const group of REQUIRED_FOOD_GROUPS) expect(state.foodGroupTotals[group.id]).toBe(group.maxTarget);
      expect(state.days[day].score).toBe(1000);
      if (day < 2) state = nextDay(state);
    }
    expect(state.score).toBe(3000);
  });

  it('counts only missing goal dots and treats remain optional', () => {
    const full = { ...emptyTotals(), ...Object.fromEntries(REQUIRED_FOOD_GROUPS.map(group => [group.id, group.maxTarget])) };
    expect(full.treats).toBe(0);
    expect(isDayComplete(full)).toBe(true);
    expect(calculateDayBalance(full)).toBe(100);
    for (const food of MOCK_FOODS) expect(getFoodGoalGain(food, full)).toBe(0);
  });
});
