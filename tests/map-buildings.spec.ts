import { test, expect } from '@playwright/test';
import { MOCK_RESTAURANTS } from '../src/data/mockRestaurants';
import { createPlayerState } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';
import { MAP_BUILDINGS } from '../src/components/mapLayout';

test('building pointers follow the image crop and every restaurant survives resizing', async ({ page }) => {
  const ids = ['vanalinna', 'roheline', 'ulikooli', 'toome', 'emajoe'];
  const restaurants = ids.map(id => MOCK_RESTAURANTS.find(restaurant => restaurant.id === id)!);
  await page.goto('/');
  await page.evaluate(({ key, player }) => localStorage.setItem(key, JSON.stringify({
    version: 1, player, screen: 'map', resumeScreen: 'map', started: true,
  })), { key: SAVE_KEY, player: { ...createPlayerState(), restaurantIds: ids } });
  await page.reload();

  for (const [width, height] of [[2118, 1020], [1440, 900], [390, 844], [568, 320], [320, 568], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('.restaurant-marker')).toHaveCount(5);
    // Wait for the ResizeObserver to place all pointers within the new bounds.
    await expect.poll(() => page.locator('.restaurant-marker').evaluateAll(elements => elements.every(element => {
      const rect = element.getBoundingClientRect();
      const header = document.querySelector('.game-header')!.getBoundingClientRect();
      const dock = document.querySelector('.map-status-dock')!.getBoundingClientRect();
      return getComputedStyle(element).visibility === 'visible' && rect.x >= 0 && rect.right <= innerWidth && rect.y >= Math.max(0, header.bottom) && rect.bottom + 7 <= dock.top;
    }))).toBe(true);
    const points = await page.locator('.map-building-links circle').evaluateAll(elements => elements.map(element => ({
      x: Number(element.getAttribute('cx')), y: Number(element.getAttribute('cy')),
    })));
    expect(points).toHaveLength(5);
    const image = await page.locator('.map-art').evaluate(async element => {
      const image = element as HTMLImageElement;
      await image.decode();
      const rect = image.getBoundingClientRect();
      const [focusX, focusY] = getComputedStyle(image).objectPosition.split(' ').map(value => Number.parseFloat(value) / 100);
      return { width: rect.width, height: rect.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, focusX, focusY };
    });
    const scale = Math.max(image.width / image.naturalWidth, image.height / image.naturalHeight);
    const buildings = await page.locator('.restaurant-marker').evaluateAll(elements => elements.map(element => Number(element.getAttribute('data-building'))));
    expect(new Set(buildings).size).toBe(5);
    for (let index = 0; index < buildings.length; index++) {
      const [roofX, roofY] = MAP_BUILDINGS[buildings[index]];
      expect(points[index].x).toBeCloseTo(roofX * scale + (image.width - image.naturalWidth * scale) * image.focusX, 1);
      expect(points[index].y).toBeCloseTo(roofY * scale + (image.height - image.naturalHeight * scale) * image.focusY, 1);
    }
    await page.screenshot({ path: `test-results/building-map-${width}x${height}.png` });
    for (const restaurant of restaurants) {
      const marker = page.getByRole('button', { name: `Vali söögikoht ${restaurant.name}`, exact: true });
      await expect(marker.locator('img')).toHaveAttribute('src', restaurant.logo);
      await marker.click();
      await expect(page.getByRole('dialog', { name: restaurant.name, exact: true })).toBeVisible();
      await expect(page.locator('.food-card')).toHaveCount(3);
      await page.keyboard.press('Escape');
    }
  }
});
