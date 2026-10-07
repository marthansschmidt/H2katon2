import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { MOCK_RESTAURANTS } from '../src/data/mockRestaurants';
import { RESTAURANT_BANNERS } from '../src/data/restaurantBanners';
import { createPlayerState } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';

for (const viewport of [{ width: 320, height: 568 }, { width: 1440, height: 900 }]) {
  test(`each restaurant opens its own banner and menu at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    expect(Object.keys(RESTAURANT_BANNERS).sort()).toEqual(MOCK_RESTAURANTS.map(restaurant => restaurant.id).sort());
    const hashes = MOCK_RESTAURANTS.map(restaurant => createHash('sha256').update(readFileSync(resolve('public', RESTAURANT_BANNERS[restaurant.id].src.slice(1)))).digest('hex'));
    expect(new Set(hashes).size).toBe(MOCK_RESTAURANTS.length);
    const failedAssets: string[] = [];
    page.on('response', response => { if (new URL(response.url()).pathname.startsWith('/art/restaurants/') && !response.ok()) failedAssets.push(response.url()); });
    await page.goto('/');
    for (let offset = 0; offset < MOCK_RESTAURANTS.length; offset += 5) {
      const restaurants = MOCK_RESTAURANTS.slice(offset, offset + 5);
      const player = { ...createPlayerState(), restaurantIds: restaurants.map(restaurant => restaurant.id) };
      await page.evaluate(({ key, save }) => localStorage.setItem(key, JSON.stringify(save)), {
        key: SAVE_KEY, save: { version: 2, player, screen: 'map', resumeScreen: 'map', started: true },
      });
      await page.reload();
      await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
      for (const restaurant of restaurants) {
        await page.getByRole('button', { name: `Vali söögikoht ${restaurant.name}`, exact: true }).click();
        const dialog = page.getByRole('dialog', { name: restaurant.name, exact: true });
        const artwork = dialog.locator('.restaurant-art');
        await expect(artwork).toHaveAttribute('src', RESTAURANT_BANNERS[restaurant.id].src);
        await expect(dialog.locator('.restaurant-banner-brand img')).toHaveAttribute('src', restaurant.logo);
        if (viewport.width === 1440) {
          const tooltip = dialog.getByRole('tooltip');
          await dialog.locator('.restaurant-menu-heading').hover();
          await expect(tooltip).toBeHidden();
          await dialog.locator('.restaurant-banner-brand').hover();
          await expect(tooltip).toBeVisible();
          await expect(tooltip).toHaveText(restaurant.name);
          await dialog.locator('.restaurant-menu-heading').hover();
          await expect(tooltip).toBeHidden();
        }
        const size = await artwork.evaluate(async element => {
          const image = element as HTMLImageElement;
          await image.decode();
          return { width: image.naturalWidth, height: image.naturalHeight };
        });
        expect(size.width).toBeGreaterThanOrEqual(900);
        expect(size.width).toBeGreaterThan(size.height);
        await expect(dialog.locator('.food-card')).toHaveCount(3);
        expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        const hero = await dialog.locator('.restaurant-hero').boundingBox();
        const logo = await dialog.locator('.restaurant-banner-brand').boundingBox();
        const logoImage = await dialog.locator('.restaurant-banner-brand img').boundingBox();
        expect(logo!.x).toBeGreaterThanOrEqual(hero!.x);
        expect(logo!.y).toBeGreaterThanOrEqual(hero!.y);
        expect(logo!.x + logo!.width).toBeLessThanOrEqual(hero!.x + hero!.width);
        expect(logo!.y + logo!.height).toBeLessThanOrEqual(hero!.y + hero!.height);
        expect(logoImage!.x + logoImage!.width).toBeLessThanOrEqual(logo!.x + logo!.width);
        expect(logoImage!.y + logoImage!.height).toBeLessThanOrEqual(logo!.y + logo!.height);
        if (viewport.width === 1440 || restaurant.name === 'Aparaat') await page.screenshot({ path: `test-results/restaurant-banner-${restaurant.id}-${viewport.width}.png`, animations: 'disabled' });
        await dialog.getByRole('button', { name: 'Sulge', exact: true }).click();
      }
    }
    expect(failedAssets).toEqual([]);
  });
}
