import { test, expect } from '@playwright/test';
import { MOCK_RESTAURANTS } from '../src/data/mockRestaurants';
import { createPlayerState } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';

for (const viewport of [{ width: 320, height: 568 }, { width: 1440, height: 900 }]) {
  test(`all restaurant logos load locally at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const failedLogos: string[] = [];
    const externalRequests: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/logos/restaurants/') && !response.ok()) failedLogos.push(response.url());
    });
    page.on('request', request => {
      if (!request.url().startsWith('http://127.0.0.1:5173')) externalRequests.push(request.url());
    });
    await page.goto('/');
    for (let offset = 0; offset < MOCK_RESTAURANTS.length; offset += 5) {
      const restaurants = MOCK_RESTAURANTS.slice(offset, offset + 5);
      const player = { ...createPlayerState(), restaurantIds: restaurants.map(restaurant => restaurant.id) };
      await page.evaluate(({ key, save }) => localStorage.setItem(key, JSON.stringify(save)), {
        key: SAVE_KEY, save: { version: 1, player, screen: 'map', resumeScreen: 'map', started: true },
      });
      await page.reload();
      await expect(page.locator('.restaurant-marker')).toHaveCount(restaurants.length);
      for (const restaurant of restaurants) {
        const marker = page.getByRole('button', { name: `Vali söögikoht ${restaurant.name}`, exact: true });
        await expect(marker).toHaveText('');
        const logo = marker.locator('.restaurant-logo');
        await expect(logo).toHaveAttribute('src', restaurant.logo);
        expect(await logo.evaluate(async element => {
          const image = element as HTMLImageElement;
          await image.decode();
          return image.naturalWidth > 0 && image.naturalHeight > 0;
        })).toBe(true);
        const transparentRatio = await logo.evaluate(element => {
          const image = element as HTMLImageElement;
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
          const context = canvas.getContext('2d')!;
          context.drawImage(image, 0, 0);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let clear = 0;
          for (let i = 3; i < pixels.length; i += 4) if (pixels[i] === 0) clear++;
          return clear / (canvas.width * canvas.height);
        });
        expect(transparentRatio, `${restaurant.name} has actual transparent pixels`).toBeGreaterThan(.1);
        await expect(marker.locator('.marker-pin')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(logo).toBeVisible();
        const logoRect = await logo.boundingBox();
        const pinRect = await marker.locator('.marker-pin').boundingBox();
        expect(logoRect!.x).toBeGreaterThanOrEqual(pinRect!.x);
        expect(logoRect!.y).toBeGreaterThanOrEqual(pinRect!.y);
        expect(logoRect!.x + logoRect!.width).toBeLessThanOrEqual(pinRect!.x + pinRect!.width + 1);
        expect(logoRect!.y + logoRect!.height).toBeLessThanOrEqual(pinRect!.y + pinRect!.height + 1);
        expect(await marker.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      }
      await page.screenshot({ path: `test-results/restaurant-logos-${viewport.width}-${offset}.png`, animations: 'disabled' });
    }
    expect(failedLogos).toEqual([]);
    expect(externalRequests).toEqual([]);
  });
}
