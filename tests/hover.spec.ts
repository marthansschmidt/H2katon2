import { test, expect, type Locator, type Page } from '@playwright/test';

async function checkHoverBackground(page: Page, button: Locator) {
  await page.mouse.move(0, 0);
  for (const entering of [true, false]) {
    const [frames] = await Promise.all([
      button.evaluate(async element => {
        const frames = [];
        for (let frame = 0; frame < 18; frame++) {
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          const style = getComputedStyle(element);
          frames.push({ color: style.backgroundColor, image: style.backgroundImage, opacity: style.opacity });
        }
        return frames;
      }),
      entering ? button.hover() : page.mouse.move(0, 0),
    ]);
    for (const frame of frames) {
      const alpha = frame.color.startsWith('rgba(') ? Number(frame.color.split(',').at(-1)!.replace(')', '')) : 1;
      expect(frame.image !== 'none' || alpha === 1, `transparent background during hover ${entering ? 'in' : 'out'}: ${JSON.stringify(frame)}`).toBe(true);
      expect(Number(frame.opacity)).toBe(1);
    }
  }
}

test('button backgrounds stay visible when hovering in and out', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const button of await page.locator('.home-actions .button').all()) {
    await checkHoverBackground(page, button);
  }
  await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
  await page.getByRole('button', { name: 'Alustan!' }).click();
  await expect(page.locator('.restaurant-marker')).toHaveCount(5);
  await checkHoverBackground(page, page.locator('.restaurant-marker').first());
});
