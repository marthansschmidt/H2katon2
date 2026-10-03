import { describe, expect, it } from 'vitest';
import { FOOD_GROUPS } from '../data/foodGroups';
import { MOCK_FOODS, MOCK_RESTAURANTS } from '../data/mockRestaurants';
import { getAvailableFoods, getRandomRestaurants, MockRestaurantProvider } from '../services/restaurantService';
import { calculateDayBalance, calculateFoodGroupTotals, emptyTotals, foodsForDay } from './foodPyramid';
import { calculateMoodScore } from './mood';
import { calculateScore, dayBonus } from './scoring';
import { chooseFood, createPlayerState, drinkWater, nextDay, nextMeal } from './state';
import { generateDayFeedback } from './feedback';

describe('kohalikud näidisandmed', () => {
  it('sisaldab 12 restorani, 40 eri toitu ja piisavalt sobivaid valikuid igal toidukorral', () => {
    expect(MOCK_RESTAURANTS).toHaveLength(12);
    expect(new Set(MOCK_FOODS.map(f => f.id)).size).toBe(40);
    expect(FOOD_GROUPS).toHaveLength(8);
    expect(MOCK_FOODS.filter(f => f.mealTimes.includes('breakfast')).length).toBeGreaterThanOrEqual(6);
    expect(MOCK_FOODS.filter(f => f.mealTimes.includes('dinner')).length).toBeGreaterThanOrEqual(15);
    expect(MOCK_FOODS.filter(f => f.plantBased).length).toBeGreaterThanOrEqual(5);
    expect(MOCK_FOODS.filter(f => f.groups.some(g => g.groupId === 'treats')).length).toBeGreaterThanOrEqual(5);
    for (const r of MOCK_RESTAURANTS) {
      expect(r.meals.length).toBeGreaterThanOrEqual(4);
      expect(r.meals.length).toBeLessThanOrEqual(6);
      for (const meal of ['breakfast', 'lunch', 'dinner'] as const) {
        expect(getAvailableFoods(r.meals, meal, [])).toHaveLength(3);
        expect(r.meals.filter(f => f.mealTimes.includes(meal)).length).toBeGreaterThanOrEqual(3);
      }
    }
    for (const food of MOCK_FOODS) for (const group of food.groups) {
      expect(FOOD_GROUPS.some(g => g.id === group.groupId)).toBe(true);
      expect(group.points).toBeGreaterThan(0);
    }
  });
  it('näitab järgmises loosimises eelkõige külastamata restorane', () => {
    const first = getRandomRestaurants(MOCK_RESTAURANTS, []);
    const second = getRandomRestaurants(MOCK_RESTAURANTS, first.map(r => r.id));
    expect(first).toHaveLength(5);
    expect(second.some(r => first.some(f => f.id === r.id))).toBe(false);
    const seen = [...first, ...second].map(r => r.id);
    const third = getRandomRestaurants(MOCK_RESTAURANTS, seen);
    expect(third).toHaveLength(5);
    expect(third.filter(r => !seen.includes(r.id))).toHaveLength(2);
    expect(new Set(third.map(r => r.id)).size).toBe(5);
    expect(getRandomRestaurants(MOCK_RESTAURANTS.slice(0, 2), seen)).toHaveLength(2);
  });
  it('vahetab kõik viis kohta ka pärast kogu restoranivaliku nägemist', () => {
    let previous: string[] = [];
    const seen = new Set<string>();
    for (let meal = 0; meal < 9; meal++) {
      const draw = getRandomRestaurants(MOCK_RESTAURANTS, [...seen], 5, previous);
      expect(draw).toHaveLength(5);
      expect(new Set(draw.map(restaurant => restaurant.id)).size).toBe(5);
      expect(draw.some(restaurant => previous.includes(restaurant.id))).toBe(false);
      for (const restaurant of draw) seen.add(restaurant.id);
      previous = draw.map(restaurant => restaurant.id);
    }
    expect(seen.size).toBe(12);
    expect(getRandomRestaurants(MOCK_RESTAURANTS.slice(0, 2), [], 5, previous)).toHaveLength(2);
  });
  it('eelistab nägemata toite ja väldib sama menüü topeltkirjeid', () => {
    const restaurant = MOCK_RESTAURANTS[0];
    const eligible = restaurant.meals.filter(f => f.mealTimes.includes('breakfast'));
    const seen = eligible.slice(0, 2).map(f => f.id);
    const menu = getAvailableFoods(restaurant.meals, 'breakfast', seen);
    expect(menu.slice(0, 2).every(f => !seen.includes(f.id))).toBe(true);
    expect(new Set(menu.map(f => f.id)).size).toBe(3);
  });
  it('provider lahendab restoranid ja toidud ilma võrguühenduseta', async () => {
    const provider = new MockRestaurantProvider();
    expect(await provider.getRestaurantById('puudub')).toBeNull();
    expect(await provider.getMealsForRestaurant('puudub', 'lunch', [])).toEqual([]);
    expect(await provider.getRestaurantById('raekoja')).toEqual(MOCK_RESTAURANTS[0]);
  });
});

describe('kolme päeva mäng', () => {
  it('tühjendab järgmise toidukorra jaoks kohad ja menüüd, säilitades söödud toidu', () => {
    const ids = MOCK_RESTAURANTS.slice(0, 5).map(restaurant => restaurant.id);
    const breakfast = chooseFood({ ...createPlayerState(), restaurantIds: ids, offers: { [ids[0]]: [MOCK_FOODS[0]] } }, MOCK_FOODS[0], 'Kohvik');
    const lunch = nextMeal(breakfast);
    expect(lunch.currentMeal).toBe('lunch');
    expect(lunch.restaurantIds).toEqual([]);
    expect(lunch.previousRestaurantIds).toEqual(ids);
    expect(lunch.offers).toEqual({});
    expect(lunch.days).toEqual(breakfast.days);
    expect(lunch.score).toBe(breakfast.score);
  });
  it('võimaldab teha 9 valikut, kokku liita skoori ja alustada tühja mängu', () => {
    let state = createPlayerState();
    for (let day = 1; day <= 3; day++) {
      expect(state.currentDay).toBe(day);
      expect(state.foodGroupTotals).toEqual(emptyTotals());
      for (const [index, meal] of (['breakfast', 'lunch', 'dinner'] as const).entries()) {
        state = drinkWater(state);
        const food = MOCK_FOODS.find(f => f.mealTimes.includes(meal) && !state.usedFoodIds.includes(f.id))!;
        state = chooseFood(state, food, 'Näidiskoht');
        expect(foodsForDay(state.days[day - 1])).toHaveLength(index + 1);
        expect(state.days[day - 1].restaurantNames[meal]).toBe('Näidiskoht');
        const sameState = chooseFood(state, food, 'Näidiskoht');
        expect(sameState).toBe(state);
        if (meal !== 'dinner') state = nextMeal(state);
      }
      if (day < 3) state = nextDay(state);
    }
    expect(state.days.flatMap(foodsForDay)).toHaveLength(9);
    expect(new Set(state.days.flatMap(foodsForDay).map(f => f.id)).size).toBe(9);
    expect(state.score).toBe(state.days.reduce((sum, day) => sum + day.score, 0));
    expect(state.score).toBeGreaterThan(0);
    expect(nextDay(state)).toBe(state);
    expect(createPlayerState()).toEqual({ ...createPlayerState(), score: 0, currentDay: 1, usedFoodIds: [], usedRestaurantIds: [] });
  });
  it('arvestab vee ainult üks kord toidukorra kohta', () => {
    const state = drinkWater(createPlayerState());
    expect(state.foodGroupTotals.drinks).toBe(1);
    expect(drinkWater(state)).toBe(state);
    const eaten = chooseFood(state, MOCK_FOODS[0], 'Kohvik');
    expect(drinkWater(eaten)).toBe(eaten);
    const lunch = drinkWater(nextMeal(eaten));
    expect(lunch.foodGroupTotals.drinks).toBe(2);
  });
  it('ei lase lõunasööki valida hommikusöögiks', () => {
    const state = createPlayerState();
    expect(chooseFood(state, MOCK_FOODS.find(f => f.id === 'burger')!, 'Kohvik')).toBe(state);
  });
});

describe('mitmekesisus ja toetav tagasiside', () => {
  it('täiuslik mänguvahemik ei nõua maiustusi', () => {
    const totals = Object.fromEntries(FOOD_GROUPS.map(g => [g.id, g.minTarget])) as ReturnType<typeof emptyTotals>;
    expect(calculateDayBalance(totals)).toBe(100);
    expect(totals.treats).toBe(0);
    expect(dayBonus(totals)).toBe(150);
    expect(calculateDayBalance(emptyTotals())).toBeLessThan(30);
  });
  it('näitab nii puudujääki kui ka tugevat ületarbimist', () => {
    const totals = emptyTotals();
    totals.treats = 7;
    const feedback = generateDayFeedback(totals);
    expect(feedback).toHaveLength(3);
    expect(feedback.some(f => f.includes('päris palju'))).toBe(true);
    expect(feedback.some(f => f.includes('puudu'))).toBe(true);
    expect(feedback.join(' ')).not.toMatch(/valesti|ebatervislikult|patutoit/);
  });
  it('ei muuda enesetunnet ühe valikuga rohkem kui 14 punkti', () => {
    for (const food of MOCK_FOODS) {
      const mood = calculateMoodScore(calculateFoodGroupTotals([food]), 1, 65);
      expect(Math.abs(mood - 65)).toBeLessThanOrEqual(14);
      expect(mood).toBeGreaterThanOrEqual(0);
      expect(mood).toBeLessThanOrEqual(100);
    }
  });
  it('annab burgerile mitmekesisuspunkte ja vähendab üheülbalise päeva boonust', () => {
    const burger = MOCK_FOODS.find(f => f.id === 'burger')!;
    const first = calculateScore(burger, emptyTotals());
    const many = calculateFoodGroupTotals([burger, burger, burger, burger]);
    expect(first).toBeGreaterThan(100);
    expect(calculateScore(burger, many)).toBeLessThan(first);
  });
});
