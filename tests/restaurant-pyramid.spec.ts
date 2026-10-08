import { test, expect } from '@playwright/test';
import { FOOD_GROUPS } from '../src/data/foodGroups';
import { SAVE_KEY } from '../src/game/storage';

test.use({ hasTouch: true });

for (const width of [320, 390, 1440]) {
  test(`banner phone opens progress and returns to the same menu (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await page.getByRole('button', { name: 'Alustan!' }).click();
    await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
    await page.locator('.restaurant-marker').first().click();
    await page.getByRole('button', { name: 'Valin selle' }).first().click();
    await page.getByRole('button', { name: 'Edasi lõunasöögile' }).click();
    await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
    await page.locator('.restaurant-marker').first().click();
    const menu = page.locator('.restaurant-modal');
    await expect(menu.locator('.food-card')).toHaveCount(3);
    const names = await menu.locator('.food-card h3').allTextContents();
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY);
    const phone = menu.getByRole('button', { name: 'Ava toidupüramiid', exact: true });
    const banner = await menu.locator('.restaurant-banner').boundingBox();
    const bounds = await phone.boundingBox();
    const logo = menu.locator('.restaurant-banner-brand');
    expect(banner!.x + banner!.width - bounds!.x - bounds!.width).toBeCloseTo(12, 0);
    expect(banner!.y + banner!.height - bounds!.y - bounds!.height).toBeCloseTo(12, 0);
    expect(bounds!.height).toBe((await logo.boundingBox())!.height);
    for (const property of ['background-color', 'border-radius', 'border', 'box-shadow']) {
      await expect(phone).toHaveCSS(property, await logo.evaluate((element, property) => getComputedStyle(element).getPropertyValue(property), property));
    }
    await page.screenshot({ path: `test-results/banner-phone-${width}.png`, animations: 'disabled' });
    for (const close of ['button', 'escape']) {
      await menu.evaluate(element => { element.scrollTop = 20; });
      const scroll = await menu.evaluate(element => element.scrollTop);
      if (width < 600) await phone.tap(); else await phone.click();
      const pyramid = page.getByRole('dialog', { name: 'Toidupüramiid', exact: true });
      await expect(pyramid).toBeVisible();
      for (const group of FOOD_GROUPS) {
        await expect(pyramid.locator(`.pyramid-progress [data-group="${group.id}"] .filled`)).toHaveCount(saved.foodGroupTotals[group.id]);
      }
      if (close === 'button') await pyramid.getByRole('button', { name: 'Sulge', exact: true }).click();
      else await page.keyboard.press('Escape');
      await expect(pyramid).toHaveCount(0);
      await expect(menu).toBeVisible();
      await expect(phone).toBeFocused();
      expect(await menu.locator('.food-card h3').allTextContents()).toEqual(names);
      expect(await menu.evaluate(element => element.scrollTop)).toBe(scroll);
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY)).toEqual(saved);
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    }
    await menu.getByRole('button', { name: 'Sulge', exact: true }).click();
    await expect(menu).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });
}
