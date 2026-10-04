import { test, expect, type Page } from '@playwright/test';

async function eatAndContinue(page: Page, continueLabel: string) {
  await expect(page.locator('.tartu-map')).toHaveAttribute('aria-busy', 'false');
  await page.locator('.restaurant-marker').first().click();
  await page.getByRole('button', { name: 'Valin selle' }).first().click();
  await expect(page.getByRole('heading', { name: 'Hea valik!' })).toBeVisible();
  await page.getByRole('button', { name: continueLabel }).click();
}

for (const width of [390, 1440]) {
  test(`phone reminder persists until the phone is pressed (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await page.getByRole('button', { name: 'Alustan!' }).click();
    const phone = page.getByRole('button', { name: 'Ava toidupüramiid' });
    await expect(phone).not.toHaveClass(/is-reminding/);

    await eatAndContinue(page, 'Edasi lõunasöögile');
    await expect(phone).toHaveClass(/is-reminding/);
    await expect(phone.locator('svg')).toHaveCSS('animation-name', 'map-phone-vibrate');
    await expect(phone.locator('svg')).toHaveCSS('animation-iteration-count', '3');
    await phone.hover();
    await expect(phone).toHaveClass(/is-reminding/);
    await expect(phone.locator('svg')).toHaveCSS('animation-name', 'none');

    await eatAndContinue(page, 'Edasi õhtusöögile');
    await expect(phone).toHaveClass(/is-reminding/);
    await phone.focus();
    await expect(phone).toHaveClass(/is-reminding/);

    await eatAndContinue(page, 'Vaata päeva kokkuvõtet');
    await expect(page.locator('.summary-screen')).toBeVisible();
    await page.getByRole('button', { name: 'Järgmine päev', exact: true }).click();
    await expect(phone).toHaveClass(/is-reminding/);
    await expect(page.locator('.day-pill')).toHaveText('PÄEV 2 / 3');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(phone.locator('svg')).toHaveCSS('animation-name', 'none');
    expect(await phone.evaluate(element => getComputedStyle(element, '::after').content)).toBe('""');
    await phone.click();
    await expect(page.getByRole('dialog', { name: 'Toidupüramiid' })).toBeVisible();
    await expect(phone).not.toHaveClass(/is-reminding/);
    await page.getByRole('button', { name: 'Sulge', exact: true }).click();
    await expect(phone).not.toHaveClass(/is-reminding/);
  });
}
