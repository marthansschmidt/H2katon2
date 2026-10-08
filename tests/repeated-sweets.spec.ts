import { test, expect, type Page } from '@playwright/test';
import { REQUIRED_FOOD_GROUPS } from '../src/data/foodGroups';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { isSweetFood } from '../src/game/foodPyramid';
import { SAVE_KEY } from '../src/game/storage';
import { seedUnlockedDinosaur } from './helpers/character-unlocks';

async function setVenues(page: Page, ids: string[]) {
  await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
  // Choose venues deterministically; the application generates every menu itself.
  await page.evaluate(({ key, ids }) => {
    const save = JSON.parse(localStorage.getItem(key)!);
    save.player.restaurantIds = ids;
    save.player.offers = {};
    localStorage.setItem(key, JSON.stringify(save));
  }, { key: SAVE_KEY, ids });
  await page.reload();
  await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
}

async function openVenue(page: Page, name: string) {
  await page.getByRole('button', { name: `Vali söögikoht ${name}`, exact: true }).click();
  await expect(page.locator('.food-card')).toHaveCount(3);
}

async function chooseSweet(page: Page, foodId: string) {
  const food = MOCK_FOODS.find(food => food.id === foodId)!;
  const card = page.locator('.food-card').filter({ has: page.getByRole('heading', { name: food.name, exact: true }) });
  const treatPoints = 1;
  await expect(card.locator('.food-group-chips > span[title="Maiustused ja näksid"]')).toContainText(`+${treatPoints}`);
  await card.getByRole('button', { name: 'Valin selle' }).click();
  await expect(page.locator('.added-groups > div').filter({ hasText: 'näksid' }).locator('strong')).toHaveText(`+${treatPoints}`);
  await expect(page.locator('.feedback-modal')).not.toContainText('Enesetunne:');
}

for (const character of ['raccoon', 'dinosaur'] as const) {
  for (const width of [320, 390, 1440]) {
    test(`sweet foods remain selectable at later meals at selected venues (${character}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      if (character === 'dinosaur') { await seedUnlockedDinosaur(page); await page.getByRole('button', { name: 'Dinosaurus', exact: true }).click(); }
      await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
      await page.getByRole('button', { name: 'Alustan!' }).click();
      const firstVenues = ['toome', 'raekoja', 'emajoe', 'supilinna', 'roheline'];
      await setVenues(page, firstVenues);
      for (const venue of ['Joyce', 'Hõlm', 'Tacora']) {
        await openVenue(page, venue);
        const names = await page.locator('.food-card h3').allTextContents();
        expect(names.some(name => isSweetFood(MOCK_FOODS.find(food => food.name === name)!))).toBe(false);
        await page.getByRole('button', { name: 'Sulge', exact: true }).click();
      }
      await openVenue(page, 'Humal');
      await chooseSweet(page, 'chococake');
      await expect(page.locator('.feedback-modal')).not.toHaveAttribute('aria-label', 'Suhkrupauk!');
      await page.getByRole('button', { name: 'Edasi lõunasöögile' }).click();
      await setVenues(page, ['karlova', 'kesklinna', 'ulikooli', 'maitsed', 'aparaadi']);
      await openVenue(page, 'Kampus');
      await chooseSweet(page, 'berrymuffin');
      await expect(page.getByRole('heading', { name: 'Suhkrupauk!', exact: true })).toBeVisible();
      await expect(page.locator('.raccoon-status h3')).toHaveText('Suhkru üledoos');
      await page.getByRole('button', { name: 'Edasi õhtusöögile' }).click();
      await setVenues(page, firstVenues);
      await openVenue(page, 'Humal');
      const names = await page.locator('.food-card h3').allTextContents();
      expect(names).toContain('Šokolaadikook');
      // Saved menus retain the repeated dessert when reopening after a refresh.
      await page.getByRole('button', { name: 'Sulge', exact: true }).click();
      await page.reload();
      await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
      await openVenue(page, 'Humal');
      expect(await page.locator('.food-card h3').allTextContents()).toEqual(names);
      await chooseSweet(page, 'chococake');
      await expect(page.getByRole('heading', { name: 'Suhkrupauk!', exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Vaata päeva kokkuvõtet' }).click();
      await expect(page.locator('.summary-character')).toHaveAttribute('data-mood', 'unwell');
      await expect(page.locator('.summary-character .raccoon')).toHaveAttribute('data-mood-art', 'true');
      await expect(page.locator('.summary-character .raccoon')).toHaveAttribute('aria-label', `Halva enesetundega ${character === 'dinosaur' ? 'dinosaurus' : 'pesukaru'}`);
      const player = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).player, SAVE_KEY);
      expect(player.days[0].breakfast.id).toBe('chococake');
      expect(player.days[0].dinner.id).toBe('chococake');
      expect(player.character).toBe(character);
      expect(player.foodGroupTotals.treats).toBe(3);
      for (const group of REQUIRED_FOOD_GROUPS) expect(player.foodGroupTotals[group.id]).toBeLessThanOrEqual(group.maxTarget);
      const treats = page.locator('.pyramid-segment-treats .food-group-row');
      await expect(treats.locator('.group-dot.filled')).toHaveCount(3);
      await expect(treats.locator('.group-dot.excess')).toHaveCount(2);
      await expect(treats.locator('.group-count')).toHaveCount(0);
      await expect(treats.locator('.group-name')).toHaveText('Näksid');
      await expect(treats.locator('.group-dots')).toHaveAttribute('aria-label', /3 mummu.*2 üle piiri/);
      await page.reload();
      await expect(page.locator('.summary-character')).toHaveAttribute('data-mood', 'unwell');
      await expect(treats.locator('.group-dot.filled')).toHaveCount(3);
      await page.screenshot({ path: `test-results/repeated-sweets-${character}-${width}.png`, fullPage: true });
    });
  }
}
