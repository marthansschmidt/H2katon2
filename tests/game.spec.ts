import { test, expect } from '@playwright/test';
import { DAILY_GOAL_EXPLANATION } from '../src/data/foodGroups';

for (const width of [390, 768, 1440]) {
  test(`kogu seiklus, salvestamine ja avalehe uus mäng (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors: string[] = [];
    const externalRequests: string[] = [];
    const missingArtwork: string[] = [];
    page.on('response', response => { if (new URL(response.url()).pathname.startsWith('/art/') && response.status() >= 400) missingArtwork.push(response.url()); });
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname)) externalRequests.push(request.url()); });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Toiduseiklus' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'et');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Alusta mängu', exact: true })).toBeVisible();
    expect(await page.locator('.app-shell').evaluate(element => element.getBoundingClientRect().width)).toBe(width);
    await page.screenshot({ animations: 'disabled', path: `test-results/avaleht-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await expect(page.locator('.tutorial-screen')).toBeVisible();
    await page.getByRole('button', { name: 'Alustan!' }).click();
    let previousMealIds: string[] = [];
    for (let day = 1; day <= 3; day++) {
      await expect(page.locator('.day-pill')).toHaveText(`PÄEV ${day}`);
      await expect(page.locator('.restaurant-marker')).toHaveCount(5);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (day === 1) {
        await page.screenshot({ animations: 'disabled', path: `test-results/kaart-${width}.png`, fullPage: true });
      }
      for (let meal = 0; meal < 3; meal++) {
        await expect(page.locator('.day-heading .meal-badge')).toHaveText(['Hommikusöök', 'Lõunasöök', 'Õhtusöök'][meal]);
        await expect(page.locator('.restaurant-marker')).toHaveCount(5);
        await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
        const mealIds = await page.locator('.restaurant-marker').evaluateAll(markers => markers.map(marker => marker.getAttribute('aria-label')!));
        expect(mealIds.some(id => previousMealIds.includes(id)), 'all five places change for the next meal').toBe(false);
        previousMealIds = mealIds;
        const chosenLabel = await page.locator('.restaurant-marker').nth((day + meal) % 5).getAttribute('aria-label');
        const positionsBefore = await page.locator('.restaurant-marker').evaluateAll(elements => Object.fromEntries(elements.map(element => [element.getAttribute('aria-label'), (element as HTMLElement).style.cssText])));
        await page.locator('.restaurant-marker').nth((day + meal) % 5).click();
        await expect(page.locator('.food-card')).toHaveCount(3);
        await expect(page.locator('.restaurant-modal .modal-heading .meal-badge')).toHaveText(['Hommikusöök', 'Lõunasöök', 'Õhtusöök'][meal]);
        await expect(page.locator('.restaurant-modal .meal-badge')).toHaveCount(1);
        expect(await page.locator('.modal-wide').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
        if (day === 1 && meal === 0) {
          await page.screenshot({ animations: 'disabled', path: `test-results/menuu-${width}.png`, fullPage: true });
          // Closing and reopening must not reroll a menu or erase the day's state.
          const foods = await page.locator('.food-card h3').allTextContents();
          await page.getByRole('button', { name: 'Sulge', exact: true }).click();
          await page.locator('.restaurant-marker').nth((day + meal) % 5).click();
          expect(await page.locator('.food-card h3').allTextContents()).toEqual(foods);
        }
        await page.getByRole('button', { name: 'Valin selle' }).first().click();
        await expect(page.getByRole('heading', { name: /^(Hea valik!|Toit valitud!|Suhkrupauk!)$/ })).toBeVisible();
        const feedback = page.locator('.feedback-modal');
        await expect(feedback.getByRole('button', { name: 'Sulge', exact: true })).toHaveCount(0);
        await expect(feedback.getByRole('button')).toHaveCount(1);
        if (day === 1 && meal === 0) {
          const savedChoice = await page.evaluate(() => localStorage.getItem('pesukaru-seiklus-v1'));
          await page.keyboard.press('Escape');
          await expect(feedback).toBeVisible();
          await page.mouse.click(1, 1);
          await expect(feedback).toBeVisible();
          expect(await page.evaluate(() => localStorage.getItem('pesukaru-seiklus-v1'))).toBe(savedChoice);
        }
        await expect(page.locator('.restaurant-marker')).toHaveCount(4);
        const positionsAfter = await page.locator('.restaurant-marker').evaluateAll(elements => Object.fromEntries(elements.map(element => [element.getAttribute('aria-label'), (element as HTMLElement).style.cssText])));
        expect(Object.keys(positionsAfter)).not.toContain(chosenLabel);
        for (const [label, position] of Object.entries(positionsAfter)) expect(position).toBe(positionsBefore[label]);
        // Even a direct click cannot reopen a menu for a completed meal.
        await page.locator('.restaurant-marker').first().evaluate(element => (element as HTMLButtonElement).click());
        await expect(page.locator('.modal-wide')).toHaveCount(0);
        expect(await page.locator('.feedback-modal').evaluate(element => element.getBoundingClientRect().width)).toBeLessThanOrEqual(340);
        if (day === 1 && meal === 1) {
          await page.reload();
          await expect(page.getByRole('heading', { name: /^(Hea valik!|Toit valitud!|Suhkrupauk!)$/ })).toBeVisible();
          await expect(page.locator('.restaurant-marker')).toHaveCount(4);
          expect(await page.locator('.restaurant-marker').evaluateAll(elements => elements.map(element => element.getAttribute('aria-label')))).not.toContain(chosenLabel);
          expect(await page.locator('.feedback-modal').evaluate(element => element.getBoundingClientRect().width)).toBeLessThanOrEqual(340);
        }
        await page.getByRole('button', { name: meal === 2 ? 'Vaata päeva kokkuvõtet' : meal === 0 ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile' }).click();
      }
      await expect(page.getByRole('heading', { name: `PÄEV ${day} KOKKUVÕTE` })).toBeVisible();
      await expect(page.locator('.selected-meals article')).toHaveCount(3);
      await expect(page.locator('.water-summary')).toHaveCount(0);
      if (day === 1) await page.screenshot({ animations: 'disabled', path: `test-results/kokkuvote-${width}.png`, fullPage: true });
      await page.getByRole('button', { name: day < 3 ? 'Järgmine päev' : 'Vaata lõpptulemust', exact: true }).click();
    }
    await expect(page.getByRole('heading', { name: 'Kolm päeva Tartus on läbi!' })).toBeVisible();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player);
    expect(state.days.length).toBe(3);
    expect(state.days.flatMap((d: Record<string, unknown>) => ['breakfast', 'lunch', 'dinner'].filter(key => d[key])).length).toBe(9);
    expect(state.score).toBeGreaterThan(0);
    await page.screenshot({ animations: 'disabled', path: `test-results/lopptulemus-${width}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Tagasi menüüsse' }).click();
    await expect(page.getByRole('button', { name: 'Uus mäng', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Alusta uut mängu', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Jätka seiklust', exact: true })).toHaveCount(0);
    await page.reload();
    await page.getByRole('button', { name: 'Uus mäng', exact: true }).click();
    const fresh = await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player);
    expect(fresh.currentDay).toBe(1);
    expect(fresh.score).toBe(0);
    expect(fresh.usedFoodIds).toEqual([]);
    expect(fresh.usedRestaurantIds).toEqual([]);
    await page.getByRole('button', { name: 'Alustan!' }).click();
    await expect(page.locator('.restaurant-marker')).toHaveCount(5);
    expect(errors).toEqual([]);
    expect(externalRequests).toEqual([]);
    expect(missingArtwork).toEqual([]);
  });
}

test('juhendi ja püramiidi avamine, klaviatuur ning mobiili ülevool', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Kuidas mängida?', exact: true }).last().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByText(DAILY_GOAL_EXPLANATION, { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Avasta toidupüramiidi' }).click();
  await expect(page.getByText('Erinevad toidugrupid annavad erinevaid toitaineid. Vaheldus loeb!')).toBeVisible();
  await expect(page.getByRole('dialog').getByText(DAILY_GOAL_EXPLANATION, { exact: true })).toBeVisible();
  await expect(page.locator('.pyramid-graphic img')).toHaveCount(0);
  await expect(page.locator('.pyramid-graphic .pyramid-symbol svg')).toHaveCount(7);
  await page.screenshot({ animations: 'disabled', path: 'test-results/pyramid-guide-320.png', fullPage: true });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
  await page.getByRole('button', { name: 'Alustan!' }).click();
  await expect(page.locator('.restaurant-marker')).toHaveCount(5);
  await page.getByRole('button', { name: 'Ava menüü' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('button', { name: 'Sulge menüü' }).click();
  await page.getByRole('button', { name: 'Ava toidupüramiid' }).click();
  await expect(page.getByRole('dialog', { name: 'Toidupüramiid' })).toBeVisible();
  await expect(page.locator('.pyramid-guide > .pyramid-progress').getByRole('img', { name: 'Köögiviljad: 0 mummu, päeva eesmärk 2' })).toBeVisible();
  await expect(page.getByText('Vesi ja joogid', { exact: true })).toHaveCount(0);
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
