import { test, expect } from '@playwright/test';
import { createPlayerState } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';
import { MAP_BUILDINGS } from '../src/components/mapLayout';

for (const [width, height] of [[390, 844], [568, 320], [2118, 1020]]) {
  test(`meal maps retain five visible restaurants at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(({ key, player }) => localStorage.setItem(key, JSON.stringify({
      version: 1, player, screen: 'map', resumeScreen: 'map', started: true,
    })), { key: SAVE_KEY, player: { ...createPlayerState(), restaurantIds: ['vanalinna', 'roheline', 'ulikooli', 'toome', 'emajoe'] } });
    await page.reload();
    await expect(page.locator('.restaurant-marker')).toHaveCount(5);
    await page.evaluate(() => document.fonts.ready);
    let previousLabels: (string | null)[] = [];
    const scenes = ['morning', 'noon-v2', 'night'];
    for (let meal = 0; meal < 3; meal++) {
      await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
      const labels = await page.locator('.restaurant-marker').evaluateAll(elements => elements.map(element => element.getAttribute('aria-label')));
      if (meal === 1) {
        await page.reload(); // Restore the same lunch draw and the noon scene.
        await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
      }
      await page.evaluate(() => scrollTo(0, 0));
      await expect(page.locator('.map-art')).toHaveAttribute('src', `/art/tartu-map-${scenes[meal]}.webp`);
      expect(await page.locator('.map-art').evaluate(async element => {
        const image = element as HTMLImageElement;
        await image.decode();
        return [image.naturalWidth, image.naturalHeight];
      })).toEqual([1024, 1536]);
      await expect(page.locator('.restaurant-marker')).toHaveCount(5);
      await expect(page.locator('.map-restaurant-layer')).toHaveCSS('opacity', '1');
      await expect.poll(() => page.locator('.restaurant-marker').evaluateAll(elements => elements.every(element => getComputedStyle(element).visibility === 'visible'))).toBe(true);
      expect(await page.locator('.restaurant-marker').evaluateAll(elements => elements.map(element => element.getAttribute('aria-label')))).toEqual(labels);
      expect(labels.some(label => previousLabels.includes(label)), 'next meal has five fresh restaurants').toBe(false);
      previousLabels = labels;
      // The mood card can change height, so each meal may use different roofs.
      const buildings = await page.locator('.restaurant-marker').evaluateAll(elements => elements.map(element => Number(element.getAttribute('data-building'))));
      expect(new Set(buildings).size).toBe(5);
      expect(buildings.every(building => Number.isInteger(building) && building >= 0 && building < MAP_BUILDINGS.length)).toBe(true);
      const header = await page.locator('.game-header').boundingBox();
      const dock = await page.locator('.map-status-dock').boundingBox();
      const markers = await page.locator('.restaurant-marker').evaluateAll(elements => elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      }));
      for (const marker of markers) {
        expect(marker.left).toBeGreaterThanOrEqual(0);
        expect(marker.right).toBeLessThanOrEqual(width);
        expect(marker.top).toBeGreaterThanOrEqual(header!.y + header!.height);
        expect(marker.bottom + 7).toBeLessThanOrEqual(dock!.y);
      }
      for (let i = 0; i < markers.length; i++) for (let j = i + 1; j < markers.length; j++) {
        const a = markers[i], b = markers[j];
        expect(a.left >= b.right || b.left >= a.right || a.top >= b.bottom + 7 || b.top >= a.bottom + 7, `markers ${i} and ${j} overlap`).toBe(true);
      }
      await page.screenshot({ path: `test-results/map-${scenes[meal]}-${width}x${height}.png` });
      await page.locator('.restaurant-marker').first().click();
      await expect(page.locator('.food-card')).toHaveCount(3);
      await page.getByRole('button', { name: 'Valin selle' }).first().click();
      await page.getByRole('button', { name: ['Edasi lõunasöögile', 'Edasi õhtusöögile', 'Vaata päeva kokkuvõtet'][meal] }).click();
    }
    await expect(page.locator('.summary-screen')).toBeVisible();
  });
}
