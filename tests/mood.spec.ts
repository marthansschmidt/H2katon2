import { test, expect, type Page } from '@playwright/test';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { SAVE_KEY } from '../src/game/storage';
import { seedUnlockedDinosaur } from './helpers/character-unlocks';

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

for (const character of ['raccoon', 'dinosaur'] as const) {
  for (const width of [390, 1440]) {
    test(`status text and portrait follow the same two mood states (${character}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const alternativeArtworkRequests: string[] = [];
      page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/art/moods/')) alternativeArtworkRequests.push(request.url()); });
      await page.goto('/');
      if (character === 'dinosaur') { await seedUnlockedDinosaur(page); await page.getByRole('button', { name: 'Dinosaurus', exact: true }).click(); }
      await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
      await page.getByRole('button', { name: 'Alustan!' }).click();
      const status = page.locator('.raccoon-status');
      await expect(status).toHaveAttribute('data-mood', 'well');
      const avatar = await status.locator('.status-avatar').innerHTML();
      const artwork = character === 'dinosaur' ? '/art/dinosaur-pixel-atlas.png' : '/art/raccoon-atlas.webp';
      const moodArtwork = character === 'dinosaur' ? '/art/moods/dinosaur-unwell.png' : '/art/moods/raccoon-low-energy.png';
      for (const [index, foodId] of ['icecream', 'smoothie', 'berrymuffin'].entries()) {
        const mood = ['well', 'well', 'unwell'][index];
        await offerFood(page, foodId);
        await expect(status).toHaveAttribute('data-mood', mood);
        await expect(status.locator('image')).toHaveAttribute('href', mood === 'unwell' ? moodArtwork : artwork);
        await expect(status.locator('.raccoon')).toHaveAttribute('data-mood', mood);
        await expect(status.locator('.raccoon')).toHaveClass(new RegExp(mood === 'unwell' ? 'raccoon-unwell' : 'raccoon-wave'));
        await expect(page.locator('.feedback-character image')).toHaveAttribute('href', mood === 'unwell' ? moodArtwork : artwork);
        await expect(page.locator('.feedback-modal')).not.toContainText('Enesetunne:');
        await expect(status.locator('.mood-hint')).toHaveCount(0);
        if (mood === 'unwell') await expect(status.getByRole('heading')).toHaveText('Suhkru üledoos');
        await page.getByRole('button', { name: index === 2 ? 'Vaata päeva kokkuvõtet' : index === 0 ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile' }).click();
        if (index < 2) {
          await page.reload();
          await expect(status).toHaveAttribute('data-mood', mood);
          await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
          await page.screenshot({ path: `test-results/mood-${character}-${mood}-${width}.png`, animations: 'disabled' });
        }
      }
      await expect(page.locator('.summary-character')).toHaveAttribute('data-mood', 'unwell');
      await expect(page.locator('.summary-speech strong')).toHaveText('Mul on paha olla');
      await page.reload();
      await expect(page.locator('.summary-character image')).toHaveAttribute('href', moodArtwork);
      await expect(page.locator('.summary-character .raccoon')).toHaveAttribute('data-mood-art', 'true');
      await expect(page.locator('.summary-speech')).toContainText('Homme');
      await expect(page.locator('.summary-speech')).not.toContainText('Järgmisel toidukorral');
      await page.screenshot({ path: `test-results/mood-unwell-summary-${character}-${width}.png`, fullPage: true, animations: 'disabled' });
      const beforeNextDay = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY);
      await page.getByRole('button', { name: 'Järgmine päev', exact: true }).click();
      await expect(status).toHaveAttribute('data-mood', 'unwell');
      await expect(status.getByRole('heading')).toHaveText('Suhkru üledoos');
      const morning = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY);
      expect(morning.moodScore).toBe(beforeNextDay.moodScore);
      expect(morning.foodGroupTotals.treats).toBe(0);
      await page.reload();
      await expect(status).toHaveAttribute('data-mood', 'unwell');
      await expect(status.locator('image')).toHaveAttribute('href', moodArtwork);
      await page.screenshot({ path: `test-results/inherited-mood-${character}-${width}.png` });
      await offerFood(page, 'oats');
      await expect(status).toHaveAttribute('data-mood', 'well');
      await expect(status.locator('image')).toHaveAttribute('href', artwork);
      const breakfast = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY);
      expect(breakfast.moodScore).toBeGreaterThan(morning.moodScore);
      expect(breakfast.moodScore - morning.moodScore).toBeLessThanOrEqual(14);
      await page.getByRole('button', { name: 'Edasi lõunasöögile' }).click();
      await page.reload();
      await expect(status).toHaveAttribute('data-mood', 'well');
      await expect(status.locator('image')).toHaveAttribute('href', artwork);
      // Ignore React-generated clip IDs and mood metadata when comparing the portrait.
      const normalize = (markup: string) => markup.replace(/data-mood="[^"]*"/g, '').replace(/_r_[^" )]+/g, 'clip');
      expect(normalize(await status.locator('.status-avatar').innerHTML())).toBe(normalize(avatar));
      expect(alternativeArtworkRequests.length).toBeGreaterThan(0);
    });
  }
}

test('adding missing groups improves the status text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
  await page.getByRole('button', { name: 'Alustan!' }).click();
  await offerFood(page, 'oatcookie');
  await expect(page.locator('.raccoon-status')).toHaveAttribute('data-mood', 'well');
  await page.getByRole('button', { name: 'Edasi lõunasöögile' }).click();
  await offerFood(page, 'hummustoast');
  await expect(page.locator('.raccoon-status')).toHaveAttribute('data-mood', 'well');
  await expect(page.locator('.mood-hint')).toHaveCount(0);
  await expect(page.locator('.raccoon-status image')).toHaveAttribute('href', '/art/raccoon-atlas.webp');
});

for (const character of ['raccoon', 'dinosaur'] as const) {
  test(`final wellbeing records gradual recovery after earlier excess (${character})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    if (character === 'dinosaur') { await seedUnlockedDinosaur(page); await page.getByRole('button', { name: 'Dinosaurus', exact: true }).click(); }
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await page.getByRole('button', { name: 'Alustan!' }).click();
    for (let day = 0; day < 3; day++) {
      if (day > 0) await expect(page.locator('.raccoon-status')).toHaveAttribute('data-mood', 'unwell');
      const foodIds = day < 2 ? ['chococake', 'chococake', 'chococake'] : ['oats', 'caesar', 'herring'];
      for (const [index, foodId] of foodIds.entries()) {
        const beforeFood = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player.moodScore, SAVE_KEY);
        await offerFood(page, foodId);
        if (day === 2) {
          await expect(page.locator('.raccoon-status')).not.toHaveAttribute('data-mood', 'unwell');
          const afterFood = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player.moodScore, SAVE_KEY);
          expect(afterFood).toBeGreaterThan(beforeFood);
          expect(afterFood - beforeFood).toBeLessThanOrEqual(14);
        }
        if (day < 2 && index > 0) {
          await expect(page.locator('.raccoon-status h3')).toHaveText('Suhkru üledoos');
          const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY);
          expect(saved.foodGroupTotals.treats).toBe(index + 1);
        }
        await page.getByRole('button', { name: index === 2 ? 'Vaata päeva kokkuvõtet' : index === 0 ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile' }).click();
      }
      await expect(page.locator('.summary-character')).toHaveAttribute('data-mood', day < 2 ? 'unwell' : 'well');
      await page.getByRole('button', { name: day < 2 ? 'Järgmine päev' : 'Vaata lõpptulemust', exact: true }).click();
    }
    const result = page.locator('.result-mood');
    await expect(result).toHaveAttribute('data-mood', 'well');
    await expect(result.locator('strong')).toHaveText('Hea olla');
    await expect(result).toHaveText('Hea olla');
    await expect(page.locator('.result-insight')).toContainText('2 päeval');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload();
    await expect(result).toHaveAttribute('data-mood', 'well');
    await page.screenshot({ path: `test-results/mood-final-${character}.png`, fullPage: true });
  });
}
