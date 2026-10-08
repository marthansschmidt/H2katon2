import { test, expect } from '@playwright/test';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { chooseFood, createPlayerState, nextMeal } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';
import { seedUnlockedDinosaur } from './helpers/character-unlocks';

for (const width of [320, 390, 1440]) {
  for (const character of ['raccoon', 'dinosaur'] as const) {
    test(`avalehele minek vajab kinnitust (${character}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/');
      if (character === 'dinosaur') await seedUnlockedDinosaur(page);
      const player = nextMeal(chooseFood(createPlayerState(character), MOCK_FOODS.find(food => food.id === 'oats')!, 'Humal'));
      await page.evaluate(({ key, player }) => localStorage.setItem(key, JSON.stringify({ version: 3, player, screen: 'map', resumeScreen: 'map', started: true })), { key: SAVE_KEY, player });
      await page.reload();
      await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
      const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
      const prompt = page.getByRole('dialog', { name: 'Kas soovid avalehele minna?' });
      async function requestHome() {
        await page.getByRole('button', { name: 'Ava menüü', exact: true }).click();
        await page.getByRole('button', { name: 'Avaleht', exact: true }).click();
        await expect(prompt).toBeVisible();
        await expect(prompt.getByRole('button', { name: 'Sulge', exact: true })).toHaveCount(0);
        await expect(prompt.getByRole('button')).toHaveCount(2);
        await expect(page.locator('.home-screen')).toHaveCount(0);
      }
      await requestHome();
      await page.screenshot({ path: `test-results/home-confirmation-${character}-${width}.png` });
      expect((await prompt.boundingBox())!.width).toBeLessThanOrEqual(420);
      expect(await prompt.evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth)).toBe(true);
      await prompt.getByRole('button', { name: 'Jätka mängu', exact: true }).click();
      await expect(prompt).toHaveCount(0);
      await expect(page.locator('.day-heading .meal-badge')).toHaveText('Lõunasöök');
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY)).toEqual(before.player);
      await requestHome();
      await page.keyboard.press('Escape');
      await expect(prompt).toHaveCount(0);
      await expect(page.locator('.tartu-map')).toBeVisible();
      await requestHome();
      await prompt.getByRole('button', { name: 'Jah, avalehele', exact: true }).click();
      await expect(page.locator('.home-screen')).toBeVisible();
      const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SAVE_KEY);
      expect(after.screen).toBe('home');
      expect(after.player).toEqual(before.player);
      await page.reload();
      await expect(page.locator('.home-screen')).toBeVisible();
    });
  }
}
