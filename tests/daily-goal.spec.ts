import { test, expect } from '@playwright/test';
import { DAILY_GOAL_EXPLANATION, REQUIRED_FOOD_GROUPS } from '../src/data/foodGroups';
import { getFoodGoalGain } from '../src/game/foodPyramid';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { chooseFood, createPlayerState, nextDay, nextMeal } from '../src/game/state';

for (const width of [390, 1440]) {
  test(`greatest of three choices fills all daily goals for three days (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await page.getByRole('button', { name: 'Alustan!' }).click();
    for (let day = 1; day <= 3; day++) {
      await expect(page.getByRole('button', { name: 'Ava toidupüramiid' })).toBeVisible();
      for (let meal = 0; meal < 3; meal++) {
        await expect(page.locator('.restaurant-marker')).toHaveCount(5);
        await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
        await page.locator('.restaurant-marker').nth((day + meal) % 5).click();
        const cards = page.locator('.food-card');
        await expect(cards).toHaveCount(3);
        const names = await cards.locator('h3').allTextContents();
        const currentTotals = await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player.foodGroupTotals);
        const gains = names.map(name => getFoodGoalGain(MOCK_FOODS.find(food => food.name === name)!, currentTotals));
        const best = Math.max(...gains);
        expect(gains.filter(gain => gain === best)).toHaveLength(1);
        expect(best).toBeGreaterThan(0);
        expect(new Set(names).size).toBe(3);
        // Reopening and refreshing must preserve the three choices and their ordering.
        if (day === 1 && meal === 0) {
          const label = await page.locator('.restaurant-marker').nth((day + meal) % 5).getAttribute('aria-label');
          await page.getByRole('button', { name: 'Sulge', exact: true }).click();
          await page.reload();
          await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
          await page.getByRole('button', { name: label!, exact: true }).click();
          expect(await cards.locator('h3').allTextContents()).toEqual(names);
        }
        await cards.nth(gains.indexOf(best)).getByRole('button', { name: 'Valin selle' }).click();
        await expect(page.getByRole('heading', { name: 'Hea valik!' })).toBeVisible();
        await page.getByRole('button', { name: meal === 2 ? 'Vaata päeva kokkuvõtet' : meal === 0 ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile' }).click();
      }
      await expect(page.locator('.summary-screen')).toBeVisible();
      await expect(page.locator('.day-score-total')).toContainText('1000 / 1000');
      const totals = await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player.foodGroupTotals);
      for (const group of REQUIRED_FOOD_GROUPS) expect(totals[group.id]).toBe(group.maxTarget);
      expect(totals).not.toHaveProperty('drinks');
      const rows = page.locator('.group-progress-list .food-group-row');
      await expect(rows).toHaveCount(7);
      for (const group of REQUIRED_FOOD_GROUPS) {
        const row = rows.filter({ has: page.locator('.group-name').getByText(group.shortName, { exact: true }) });
        await expect(row.locator('.group-dot.filled')).toHaveCount(group.maxTarget);
      }
      await expect(page.getByText('Vesi ja joogid', { exact: true })).toHaveCount(0);
      await expect(page.locator('.summary-screen .optional-group')).toHaveCount(0);
      await expect(page.locator('.pyramid-step-1 .group-name')).toContainText('Näksid');
      await expect(page.locator('.pyramid-step-1 .group-dot:not(.filled)')).toHaveCount(0);
      await expect(page.locator('.summary-screen').getByText(DAILY_GOAL_EXPLANATION, { exact: true })).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Mida täna avastasime?' })).toHaveCount(0);
      if (day === 1) await page.screenshot({ path: `test-results/perfect-day-${width}.png`, fullPage: true, animations: 'disabled' });
      await page.getByRole('button', { name: day < 3 ? 'Järgmine päev' : 'Vaata lõpptulemust', exact: true }).click();
    }
    await expect(page.locator('.final-screen')).toBeVisible();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player);
    expect(state.score).toBe(3000);
    expect(state.days.map((day: { score: number }) => day.score)).toEqual([1000, 1000, 1000]);
    await expect(page.getByRole('region', { name: 'Lõpptulemus', exact: true })).toContainText('3000 / 3000 punkti');
    await expect(page.getByRole('img', { name: '5 tärni 5-st' })).toBeVisible();
    await expect(page.locator('.rating-star')).toHaveCount(5);
    await expect(page.locator('.rating-star.is-earned')).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/final-rating-${width}.png`, fullPage: true, animations: 'disabled' });
  });
}

test('weaker saved choices receive a lower score and four stars after day three', async ({ page }) => {
  let player = createPlayerState();
  for (let day = 0; day < 3; day++) {
    for (const [index, id] of ['oatcookie', 'chococake', 'smoothie'].entries()) {
      player = chooseFood(player, MOCK_FOODS.find(food => food.id === id)!, 'Kohvik');
      if (index < 2) player = nextMeal(player);
    }
    if (day < 2) player = nextDay(player);
  }
  expect(player.score).toBe(1800);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.addInitScript(save => localStorage.setItem('pesukaru-seiklus-v1', JSON.stringify(save)), {
    version: 2, player, screen: 'final', resumeScreen: 'final', started: true,
  });
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Lõpptulemus', exact: true })).toContainText('1800 / 3000 punkti');
  await expect(page.getByRole('img', { name: '4 tärni 5-st' })).toBeVisible();
  await expect(page.locator('.rating-star')).toHaveCount(5);
  await expect(page.locator('.rating-star.is-earned')).toHaveCount(4);
  await expect(page.locator('.rating-title')).toHaveText('Väga hea');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
