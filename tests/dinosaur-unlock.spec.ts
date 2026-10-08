import { test, expect } from '@playwright/test';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { DINOSAUR_UNLOCK_KEY } from '../src/game/characters';
import { MAX_GAME_SCORE } from '../src/game/scoring';
import { chooseFood, createPlayerState, nextDay, nextMeal } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';

function completedGame(dinner = 'herring') {
  let player = createPlayerState();
  for (let day = 0; day < 3; day++) {
    for (const [index, id] of ['oats', 'caesar', dinner].entries()) {
      player = chooseFood(player, MOCK_FOODS.find(food => food.id === id)!, 'Humal');
      if (index < 2) player = nextMeal(player);
    }
    if (day < 2) player = nextDay(player);
  }
  return player;
}

for (const width of [320, 390, 1440]) {
  test(`dinosaurus on uuele mängijale lukus (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const dinosaur = page.getByRole('button', { name: 'Dinosaurus', exact: true });
    await expect(dinosaur).toHaveAttribute('data-locked', 'true');
    await expect(page.locator('.character-unlock-hint')).toContainText('3000 punkti');
    await expect(page.locator('.character-unlock-hint')).toBeHidden();
    if (width === 1440) {
      await dinosaur.hover();
      await expect(page.getByRole('tooltip')).toBeVisible();
      await page.getByRole('heading', { name: 'Toiduseiklus' }).hover();
      await expect(page.locator('.character-unlock-hint')).toBeHidden();
    }
    await dinosaur.evaluate(button => (button as HTMLButtonElement).click());
    await expect(page.locator('.hero-raccoon')).toHaveAttribute('data-character', 'raccoon');
    await page.reload();
    await expect(dinosaur).toHaveAttribute('data-locked', 'true');
    await page.screenshot({ path: `test-results/locked-dinosaur-${width}.png` });
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await expect(page.locator('.tutorial-step .raccoon')).toHaveAttribute('data-character', 'raccoon');
    expect(await page.evaluate(key => localStorage.getItem(key), DINOSAUR_UNLOCK_KEY)).toBeNull();
  });
}

test('viis tärni ega võltsitud maksimumskoor ei ava dinosaurust', async ({ page }) => {
  const player = { ...completedGame('smoothie'), score: MAX_GAME_SCORE, character: 'dinosaur' as const };
  await page.goto('/');
  await page.evaluate(({ key, player }) => localStorage.setItem(key, JSON.stringify({ version: 3, player, screen: 'final', resumeScreen: 'final', started: true })), { key: SAVE_KEY, player });
  await page.reload();
  await expect(page.locator('.rating-score-value')).toContainText('2700');
  await expect(page.locator('.rating-star.is-earned')).toHaveCount(5);
  await expect(page.locator('.character-unlock-reward')).toHaveCount(0);
  await expect(page.locator('.final-raccoon-wrap .raccoon')).toHaveAttribute('data-character', 'raccoon');
  await page.getByRole('button', { name: 'Mängi uuesti', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Dinosaurus', exact: true })).toHaveAttribute('data-locked', 'true');
  expect(await page.evaluate(key => localStorage.getItem(key), DINOSAUR_UNLOCK_KEY)).toBeNull();
});

test('taastab varasema maksimumtulemuse avamise ja säilitab selle ka nõrgema mängu järel', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(({ key, player }) => localStorage.setItem(key, JSON.stringify({ version: 3, player, screen: 'final', resumeScreen: 'final', started: true })), { key: SAVE_KEY, player: completedGame() });
  await page.reload();
  await expect(page.locator('.character-unlock-reward')).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), DINOSAUR_UNLOCK_KEY)).toBe('true');
  await page.getByRole('button', { name: 'Mängi uuesti', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Dinosaurus', exact: true })).toBeEnabled();
  await expect(page.locator('.character-unlock-hint')).toHaveCount(0);
  await page.evaluate(({ key, player }) => localStorage.setItem(key, JSON.stringify({ version: 3, player, screen: 'final', resumeScreen: 'final', started: true })), { key: SAVE_KEY, player: completedGame('smoothie') });
  await page.reload();
  await expect(page.locator('.character-unlock-reward')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mängi uuesti', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Dinosaurus', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Dinosaurus', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Dinosaurus', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Pesukaru', exact: true }).click();
  await expect(page.locator('.hero-raccoon')).toHaveAttribute('data-character', 'raccoon');
});

for (const width of [320, 390]) {
  test.describe(`dinosauruse avamise info puutevaates (${width}px)`, () => {
    test.use({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });
    test('vajutamine kuvab info ja jätab dinosauruse lukku', async ({ page }) => {
      await page.goto('/');
      const dinosaur = page.getByRole('button', { name: 'Dinosaurus', exact: true });
      const tooltip = page.locator('.character-unlock-hint');
      await expect(tooltip).toBeHidden();
      await dinosaur.tap();
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveText('Ava dinosaurus: kogu mängus 3000 punkti.');
      await expect(page.locator('.hero-raccoon')).toHaveAttribute('data-character', 'raccoon');
      const bounds = await tooltip.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `test-results/dinosaur-unlock-tooltip-${width}.png` });
      await dinosaur.tap();
      await expect(tooltip).toBeHidden();
      await dinosaur.tap();
      await expect(tooltip).toBeVisible();
      await page.getByRole('button', { name: 'Pesukaru', exact: true }).tap();
      await expect(tooltip).toBeHidden();
      expect(await page.evaluate(key => localStorage.getItem(key), DINOSAUR_UNLOCK_KEY)).toBeNull();
    });
  });
}
