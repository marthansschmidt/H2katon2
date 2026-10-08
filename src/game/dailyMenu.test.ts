import { describe, expect, it } from 'vitest';
import { MOCK_FOODS, MOCK_RESTAURANTS } from '../data/mockRestaurants';
import { REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import { MEAL_ORDER, type Food } from '../types/game';
import { DailyMenuPlanner } from './dailyMenu';
import { addFoodToTotals, calculateDayBalance, calculateFoodGroupTotals, consumptionForDay, emptyTotals, foodsForDay, getFoodGoalGain, isDayComplete, isSweetFood } from './foodPyramid';
import { getMood } from './mood';
import { MockRestaurantProvider, restaurantOffersSweets } from '../services/restaurantService';
import { dayBonus, FULL_DAY_BONUS } from './scoring';
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
        expect(dayBonus(totals)).toBe(FULL_DAY_BONUS);
        return;
      }
      const key = `${mealIndex}/${[...ids].sort().join(',')}`;
      if (visited.has(key)) return;
      visited.add(key);
      expect(isDayComplete(totals)).toBe(false);
      const meal = MEAL_ORDER[mealIndex];
      for (const restaurant of MOCK_RESTAURANTS) {
        // All foods have already been seen: variety preferences must never remove the winning choice.
        const menu = planner.getChoices(meal, { totals, selectedFoodIds: ids }, restaurant.meals.map(food => food.id), MOCK_FOODS.map(food => food.id), () => 0.37,
          restaurantOffersSweets(restaurant.id) ? 'include' : 'exclude');
        expect(menu.some(isSweetFood)).toBe(restaurantOffersSweets(restaurant.id));
        expect(new Set(menu.map(food => food.id)).size).toBe(3);
        const gains = menu.map(food => getFoodGoalGain(food, totals));
        const best = Math.max(...gains);
        expect(gains.filter(gain => gain === best)).toHaveLength(1);
        expect(best).toBeGreaterThan(0);
        for (const food of menu) {
          expect(food.mealTimes).toContain(meal);
          if (ids.includes(food.id)) expect(isSweetFood(food)).toBe(true);
          const reachable = planner.canCompleteDay(addFoodToTotals(totals, food), MEAL_ORDER.slice(mealIndex + 1), [...ids, food.id]);
          if (getFoodGoalGain(food, totals) === best) expect(reachable, `${restaurant.name}: ${[...ids, food.id].join(', ')}`).toBe(true);
        }
      }
      // Check every possible winning continuation, not just a single random run.
      for (const food of MOCK_FOODS) if (food.mealTimes.includes(meal) && (!ids.includes(food.id) || isSweetFood(food))
        && planner.canCompleteDay(addFoodToTotals(totals, food), MEAL_ORDER.slice(mealIndex + 1), [...ids, food.id])) inspect([...selected, food]);
    };
    inspect([]);
    expect(visited.size).toBeGreaterThan(100);
  }, 15000);

  it('still offers three distinct choices with one greatest gain after weaker choices', () => {
    const planner = new DailyMenuPlanner(MOCK_FOODS);
    for (const breakfast of MOCK_FOODS.filter(food => food.mealTimes.includes('breakfast'))) {
      for (const lunch of MOCK_FOODS.filter(food => food.mealTimes.includes('lunch') && (food.id !== breakfast.id || isSweetFood(food)))) {
        const totals = calculateFoodGroupTotals([breakfast, lunch]);
        for (const policy of ['include', 'exclude'] as const) {
          const menu = planner.getChoices('dinner', { totals, selectedFoodIds: [breakfast.id, lunch.id] }, [], [], () => 0.71, policy);
          const gains = menu.map(food => getFoodGoalGain(food, totals));
          expect(new Set(menu.map(food => food.id)).size).toBe(3);
          expect(gains.filter(gain => gain === Math.max(...gains))).toHaveLength(1);
          expect(menu.some(isSweetFood)).toBe(policy === 'include');
        }
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
  it('offers sweets at some venues after earlier sweet meals, including when every dessert has been eaten', async () => {
    const provider = new MockRestaurantProvider();
    const sweets = MOCK_FOODS.filter(isSweetFood);
    const breakfast = MOCK_FOODS.find(food => food.id === 'oatcookie')!;
    for (const selected of [[breakfast], [breakfast, breakfast], sweets]) {
      const context = { totals: calculateFoodGroupTotals(selected), selectedFoodIds: selected.map(food => food.id) };
      const meal = selected.length === 1 ? 'lunch' : 'dinner';
      let sweetMenus = 0;
      for (const restaurant of MOCK_RESTAURANTS) {
        const menu = await provider.getMealsForRestaurant(restaurant.id, meal, MOCK_FOODS.map(food => food.id), context);
        if (menu.some(isSweetFood)) sweetMenus++;
        expect(menu.some(isSweetFood)).toBe(restaurantOffersSweets(restaurant.id));
        if (selected === sweets && restaurantOffersSweets(restaurant.id)) expect(menu.some(food => isSweetFood(food) && context.selectedFoodIds.includes(food.id))).toBe(true);
      }
      expect(sweetMenus).toBeGreaterThan(0);
      expect(sweetMenus).toBeLessThan(MOCK_RESTAURANTS.length);
    }
  });
  for (const character of ['raccoon', 'dinosaur'] as const) {
    it(`offers the same cookie after eating it, with excess counted for mood (${character})`, async () => {
      const provider = new MockRestaurantProvider();
      let player = createPlayerState(character);
      for (const [index, meal] of MEAL_ORDER.entries()) {
        const menu = await provider.getMealsForRestaurant('kesklinna', meal, player.usedFoodIds,
          { totals: player.foodGroupTotals, selectedFoodIds: foodsForDay(player.days[0]).map(food => food.id) });
        const cookie = menu.find(food => food.id === 'oatcookie');
        expect(cookie, `cookie remains selectable at ${meal}`).toBeDefined();
        player = chooseFood(player, cookie!, 'Fii');
        expect(consumptionForDay(player.days[0]).treats).toBe(index + 1);
        if (index < 2) player = nextMeal(player);
      }
      expect(getMood(player.moodScore, consumptionForDay(player.days[0])).id).toBe('unwell');
      expect(player.foodGroupTotals.treats).toBe(3);
    });
  }
  it('draws both kinds of venue while replacing all five places at every meal', async () => {
    const provider = new MockRestaurantProvider();
    for (const preferredKind of [true, false]) {
      const excluded = MOCK_RESTAURANTS.filter(restaurant => restaurantOffersSweets(restaurant.id) !== preferredKind).map(restaurant => restaurant.id);
      const draw = await provider.getRestaurantsForDay(excluded);
      expect(draw.some(restaurant => restaurantOffersSweets(restaurant.id))).toBe(true);
      expect(draw.some(restaurant => !restaurantOffersSweets(restaurant.id))).toBe(true);
    }
    let previous: string[] = [];
    const seen = new Set<string>();
    for (let round = 0; round < 30; round++) {
      const draw = await provider.getRestaurantsForDay([...seen], previous);
      expect(draw).toHaveLength(5);
      expect(new Set(draw.map(restaurant => restaurant.id)).size).toBe(5);
      expect(draw.some(restaurant => previous.includes(restaurant.id))).toBe(false);
      expect(draw.some(restaurant => restaurantOffersSweets(restaurant.id))).toBe(true);
      expect(draw.some(restaurant => !restaurantOffersSweets(restaurant.id))).toBe(true);
      previous = draw.map(restaurant => restaurant.id);
      previous.forEach(id => seen.add(id));
    }
  });
});
