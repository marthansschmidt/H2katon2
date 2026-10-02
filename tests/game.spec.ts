import { test, expect } from '@playwright/test';

for (const width of [390, 768, 1440]) {
  test(`kogu seiklus, salvestamine ja restart (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors: string[] = [];
    const externalRequests: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname)) externalRequests.push(request.url()); });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Pesukaru toiduseiklus.' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'et');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Alusta mängu', exact: true })).toBeVisible();
    await page.screenshot({ path: `test-results/avaleht-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Neli lihtsat sammu.' })).toBeVisible();
    await page.getByRole('button', { name: 'Alustan!' }).click();
    let firstDayIds: string[] = [];
    for (let day = 1; day <= 3; day++) {
      await expect(page.locator('.day-pill')).toHaveText(`PÄEV ${day} / 3`);
      await expect(page.locator('.restaurant-marker')).toHaveCount(5);
      if (day === 1) {
        firstDayIds = await page.locator('.restaurant-marker strong').allTextContents();
        await page.screenshot({ path: `test-results/kaart-${width}.png`, fullPage: true });
      } else if (day === 2) {
        const second = await page.locator('.restaurant-marker strong').allTextContents();
        expect(second.some(id => firstDayIds.includes(id))).toBe(false);
      }
      for (let meal = 0; meal < 3; meal++) {
        await page.getByRole('button', { name: 'Võtan klaasi vett' }).click();
        await expect(page.getByRole('button', { name: 'Vesi joodud ✓' })).toBeDisabled();
        await page.locator('.restaurant-marker').nth((day + meal) % 5).click();
        await expect(page.locator('.food-card')).toHaveCount(3);
        if (day === 1 && meal === 0) {
          await page.screenshot({ path: `test-results/menuu-${width}.png`, fullPage: true });
          // Closing and reopening must not reroll a menu or erase the day's state.
          const foods = await page.locator('.food-card h3').allTextContents();
          await page.getByRole('button', { name: 'Sulge', exact: true }).click();
          await page.locator('.restaurant-marker').nth((day + meal) % 5).click();
          expect(await page.locator('.food-card h3').allTextContents()).toEqual(foods);
        }
        await page.getByRole('button', { name: 'Valin selle' }).first().click();
        await expect(page.getByRole('heading', { name: 'Üks uus maitse avastatud!' })).toBeVisible();
        if (day === 1 && meal === 1) {
          await page.reload();
          await expect(page.getByRole('heading', { name: 'Üks uus maitse avastatud!' })).toBeVisible();
        }
        await page.getByRole('button', { name: meal === 2 ? 'Vaata päeva kokkuvõtet' : meal === 0 ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile' }).click();
      }
      await expect(page.getByRole('heading', { name: 'Üks päev, palju avastusi.' })).toBeVisible();
      await expect(page.locator('.selected-meals article')).toHaveCount(3);
      await expect(page.getByText('Klaasi vett võtsid 3 toidukorral.')).toBeVisible();
      if (day === 1) await page.screenshot({ path: `test-results/kokkuvote-${width}.png`, fullPage: true });
      await page.getByRole('button', { name: day < 3 ? 'Järgmine päev' : 'Vaata lõpptulemust', exact: true }).click();
    }
    await expect(page.getByRole('heading', { name: 'Kolm päeva Tartus on läbi!' })).toBeVisible();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player);
    expect(state.days.length).toBe(3);
    expect(state.days.flatMap((d: Record<string, unknown>) => ['breakfast', 'lunch', 'dinner'].filter(key => d[key])).length).toBe(9);
    expect(state.score).toBeGreaterThan(0);
    await page.screenshot({ path: `test-results/lopptulemus-${width}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Mängi uuesti' }).click();
    const fresh = await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player);
    expect(fresh.currentDay).toBe(1);
    expect(fresh.score).toBe(0);
    expect(fresh.usedFoodIds).toEqual([]);
    expect(fresh.usedRestaurantIds).toEqual([]);
    await page.getByRole('button', { name: 'Alustan!' }).click();
    await expect(page.locator('.restaurant-marker')).toHaveCount(5);
    expect(errors).toEqual([]);
    expect(externalRequests).toEqual([]);
  });
}

test('juhendi ja püramiidi avamine, klaviatuur ning mobiili ülevool', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Kuidas mängida?', exact: true }).last().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Avasta toidupüramiidi' }).click();
  await expect(page.getByText('Mängu mumm ≠ toiduportsjon')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Ava menüü' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('button', { name: 'Sulge menüü' }).click();
  await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
  await page.getByRole('button', { name: 'Alustan!' }).click();
  await expect(page.locator('.restaurant-marker')).toHaveCount(5);
  await page.getByRole('button', { name: 'Võtan klaasi vett' }).click();
  await page.getByRole('button', { name: 'Mummud: 1 / 8 gruppi' }).click();
  await expect(page.getByRole('dialog', { name: 'Minu päeva mummud' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('img', { name: 'Vesi ja joogid: 1 mummu, mängu vahemik 2 kuni 4' })).toBeVisible();
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
