import { test, expect, type Page } from '@playwright/test';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { SAVE_KEY } from '../src/game/storage';

async function offerFood(page: Page, foodId: string) {
  await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
  const foods = [foodId, 'fruitnuts', 'ryecheese'].map(id => MOCK_FOODS.find(food => food.id === id)!);
  // Stable menus let the test exercise a specific sequence through actual food selection.
  await page.evaluate(({ key, foods }) => {
    const save = JSON.parse(localStorage.getItem(key)!);
    save.player.offers[save.player.restaurantIds[0]] = foods;
    localStorage.setItem(key, JSON.stringify(save));
  }, { key: SAVE_KEY, foods });
  await page.reload();
  await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
  await page.locator('.restaurant-marker').first().click();
  await page.locator('.food-card').filter({ has: page.getByRole('heading', { name: foods[0].name, exact: true }) }).getByRole('button', { name: 'Valin selle' }).click();
}

for (const width of [390, 1440]) {
  test(`mood feedback persists while alternative raccoon expressions are disabled (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const alternativeArtworkRequests: string[] = [];
    page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/art/moods/')) alternativeArtworkRequests.push(request.url()); });
    await page.goto('/');
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await page.getByRole('button', { name: 'Alustan!' }).click();
    const status = page.locator('.raccoon-status');
    await expect(status).toHaveAttribute('data-mood', 'calm');
    for (const [index, foodId] of ['icecream', 'smoothie', 'berrymuffin'].entries()) {
      const mood = ['calm', 'concerned', 'tired'][index];
      await offerFood(page, foodId);
      await expect(status).toHaveAttribute('data-mood', mood);
      await expect(status.locator('image')).toHaveAttribute('href', '/art/raccoon-atlas.webp');
      await expect(page.locator('.feedback-character image')).toHaveAttribute('href', '/art/raccoon-atlas.webp');
      await expect(page.locator('.feedback-character .raccoon')).toHaveAttribute('data-mood', mood);
      if (mood === 'calm') await expect(status.locator('.mood-hint')).toHaveCount(0);
      else await expect(status.locator('.mood-hint')).toContainText('köögiviljad');
      await page.getByRole('button', { name: index === 2 ? 'Vaata päeva kokkuvõtet' : index === 0 ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile' }).click();
      if (index < 2) {
        await page.reload();
        await expect(status).toHaveAttribute('data-mood', mood);
        await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
        await page.screenshot({ path: `test-results/mood-${mood}-${width}.png`, animations: 'disabled' });
      }
    }
    await expect(page.locator('.summary-character .raccoon')).toHaveAttribute('data-mood', 'tired');
    await page.reload();
    await expect(page.locator('.summary-character image')).toHaveAttribute('href', '/art/raccoon-atlas.webp');
    await page.screenshot({ path: `test-results/mood-tired-summary-${width}.png`, fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: 'Järgmine päev', exact: true }).click();
    await expect(status).toHaveAttribute('data-mood', 'calm');
    expect(alternativeArtworkRequests).toEqual([]);
  });
}

test('adding missing groups improves mood and clears the supportive hint', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
  await page.getByRole('button', { name: 'Alustan!' }).click();
  await offerFood(page, 'oatcookie');
  await expect(page.locator('.raccoon-status')).toHaveAttribute('data-mood', 'concerned');
  await page.getByRole('button', { name: 'Edasi lõunasöögile' }).click();
  await offerFood(page, 'hummustoast');
  await expect(page.locator('.raccoon-status')).toHaveAttribute('data-mood', 'calm');
  await expect(page.locator('.mood-hint')).toHaveCount(0);
  await expect(page.locator('.raccoon-status image')).toHaveAttribute('href', '/art/raccoon-atlas.webp');
});
