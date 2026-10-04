import { test, expect } from '@playwright/test';

for (const [width, height] of [[375, 667], [430, 932]]) {
  test.describe(`${width}px puuteekraan`, () => {
    test.use({ viewport: { width, height }, isMobile: true, hasTouch: true });
    test('suured puutealad, kaardi progress ning keritavad dialoogid', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const undersized = await page.getByRole('button').evaluateAll(buttons => buttons.filter(button => {
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.height < 44 || rect.width < 44);
      }).map(button => button.textContent));
      expect(undersized).toEqual([]);
      await page.getByRole('button', { name: 'Alusta mängu', exact: true }).tap();
      await page.screenshot({ animations: 'disabled', path: `test-results/juhend-${width}.png`, fullPage: true });
      await page.getByRole('button', { name: 'Alustan!' }).tap();
      await expect(page.locator('.restaurant-marker')).toHaveCount(5);
      const dock = await page.locator('.map-status-dock').boundingBox();
      expect(dock!.y + dock!.height).toBeLessThanOrEqual(height);
      await page.screenshot({ animations: 'disabled', path: `test-results/kaart-viewport-${width}.png` });
      await expect(page.getByRole('button', { name: 'Võtan klaasi vett' })).toHaveCount(0);
      await page.getByRole('button', { name: 'Ava toidupüramiid' }).tap();
      await expect(page.getByRole('dialog', { name: 'Toidupüramiid' })).toBeVisible();
      await page.screenshot({ animations: 'disabled', path: `test-results/puramiid-${width}.png` });
      await page.getByRole('button', { name: 'Sulge', exact: true }).tap();
      await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
      await page.locator('.restaurant-marker').last().tap();
      await expect(page.locator('.food-card')).toHaveCount(3);
      const overflow = await page.locator('.modal-wide').evaluate(dialog => dialog.scrollWidth > dialog.clientWidth);
      expect(overflow).toBe(false);
      await page.screenshot({ animations: 'disabled', path: `test-results/restoran-viewport-${width}.png` });
      await page.getByRole('button', { name: 'Valin selle' }).last().tap();
      await expect(page.getByRole('heading', { name: 'Hea valik!' })).toBeVisible();
      await page.screenshot({ animations: 'disabled', path: `test-results/tagasiside-${width}.png` });
      await page.getByRole('button', { name: 'Edasi lõunasöögile' }).tap();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  });
}
