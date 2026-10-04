import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FoodCard } from '../components/FoodCard';
import { SummaryCard } from '../components/SummaryCard';
import { FOOD_IMAGES } from './foodImages';
import { MOCK_FOODS } from './mockRestaurants';

describe('individual food artwork', () => {
  it('covers the entire menu with a distinct image path for every food', () => {
    expect(Object.keys(FOOD_IMAGES).sort()).toEqual(MOCK_FOODS.map(food => food.id).sort());
    expect(new Set(Object.values(FOOD_IMAGES)).size).toBe(MOCK_FOODS.length);
  });

  it('uses each food’s own image in menus and summaries with the existing saved-food shape', () => {
    for (const food of MOCK_FOODS) {
      const expected = `src="${FOOD_IMAGES[food.id]}"`;
      const card = renderToStaticMarkup(createElement(FoodCard, { food, onChoose: () => {} }));
      const summary = renderToStaticMarkup(createElement(SummaryCard, { food, meal: food.mealTimes[0] }));
      expect(card, food.id).toContain(expected);
      expect(summary, food.id).toContain(expected);
      expect(card, food.id).not.toContain('vegetable-toast.webp');
      expect(summary, food.id).not.toContain('food-atlas.webp');
    }
  });
});
