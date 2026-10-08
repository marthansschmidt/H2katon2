import { test, expect, type Locator } from '@playwright/test';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { chooseFood, createPlayerState, nextMeal } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';
import { seedUnlockedDinosaur } from './helpers/character-unlocks';

async function spriteBounds(sprite: Locator) {
  return sprite.evaluate(async element => {
    const imageElement = element.querySelector('image')!;
    const image = new Image();
    image.src = imageElement.getAttribute('href')!;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const clip = element.querySelector('clipPath rect') as SVGRectElement | null;
    if (!clip) {
      const box = element.getBoundingClientRect();
      const picture = imageElement.getBoundingClientRect();
      return { clipped: false, contained: picture.left >= box.left - 1 && picture.top >= box.top - 1
        && picture.right <= box.right + 1 && picture.bottom <= box.bottom + 1, visibleHeight: picture.height };
    }
    const { x, y, width, height } = clip.getBBox();
    const dinosaur = element.getAttribute('data-character') === 'dinosaur';
    const column = element.classList.contains('raccoon-celebrate') ? 2 : element.classList.contains('raccoon-eat') ? 1 : 0;
    // Inspect the complete dinosaur cell, including pixels outside the chosen crop.
    const region = dinosaur ? [column * 724, 0, 724, 724] : [x, y, width, height];
    const [left, top, w, h] = region;
    const { data } = context.getImageData(left, top, w, h);
    let minX = w, minY = h, maxX = 0, maxY = 0;
    for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
      if (data[(py * w + px) * 4 + 3] > 20) {
        minX = Math.min(minX, px); minY = Math.min(minY, py);
        maxX = Math.max(maxX, px); maxY = Math.max(maxY, py);
      }
    }
    const matrix = (imageElement as SVGImageElement).getScreenCTM()!;
    const first = new DOMPoint(left + minX, top + minY).matrixTransform(matrix);
    const last = new DOMPoint(left + maxX + 1, top + maxY + 1).matrixTransform(matrix);
    const box = element.getBoundingClientRect();
    return {
      clipped: left + minX < x || top + minY < y || left + maxX >= x + width || top + maxY >= y + height,
      contained: first.x >= box.left - 1 && first.y >= box.top - 1 && last.x <= box.right + 1 && last.y <= box.bottom + 1,
      visibleHeight: last.y - first.y,
    };
  });
}

async function expectFullSprite(sprite: Locator) {
  const bounds = await spriteBounds(sprite);
  expect(bounds.clipped, 'all opaque sprite pixels fit inside the atlas crop').toBe(false);
  expect(bounds.contained, 'the full body fits inside the rendered SVG').toBe(true);
  return bounds;
}

for (const width of [320, 390, 430]) {
  for (const character of ['raccoon', 'dinosaur'] as const) {
    test(`mobiilis on terve ja halva enesetundega tegelane täielikult nähtav (${character}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/');
      if (character === 'dinosaur') await seedUnlockedDinosaur(page);
      let player = createPlayerState(character);
      for (const mood of ['well', 'unwell'] as const) {
        player = chooseFood(player, MOCK_FOODS.find(food => food.id === 'berrymuffin')!, 'Humal');
        await page.evaluate(({ key, player }) => localStorage.setItem(key, JSON.stringify({ version: 3, player, screen: 'map', resumeScreen: 'map', started: true })), { key: SAVE_KEY, player });
        await page.reload();
        const sprite = page.locator('.feedback-character .raccoon');
        await expect(sprite).toHaveAttribute('data-character', character);
        await expect(sprite).toHaveAttribute('data-mood', mood);
        await expectFullSprite(sprite);
        const heading = await page.locator('.feedback-modal .modal-heading').boundingBox();
        const picture = await sprite.boundingBox();
        const dialog = await page.locator('.feedback-modal').boundingBox();
        expect(picture!.y, 'character clears the sticky heading').toBeGreaterThanOrEqual(heading!.y + heading!.height + 8);
        expect(picture!.x, 'character clears the left edge').toBeGreaterThanOrEqual(dialog!.x + 16);
        expect(picture!.x + picture!.width, 'character clears the right edge').toBeLessThanOrEqual(dialog!.x + dialog!.width - 16);
        expect(picture!.y + picture!.height, 'whole character fits on screen').toBeLessThanOrEqual(844);
        await page.screenshot({ path: `test-results/full-character-${character}-${mood}-${width}.png` });
        player = nextMeal(player);
      }
    });
  }
}

for (const width of [360, 1440]) {
  test(`tegelase valik säilib kogu seikluses (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 360 ? 640 : 900 });
    await page.goto('/');
    await seedUnlockedDinosaur(page);
    await expect(page.getByRole('button', { name: 'Pesukaru', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const raccoon = await expectFullSprite(page.locator('.hero-raccoon'));
    const raccoonSize = await page.locator('.hero-raccoon').boundingBox();
    await page.getByRole('button', { name: 'Dinosaurus', exact: true }).click();
    await expect(page.locator('.hero-raccoon')).toHaveAttribute('data-character', 'dinosaur');
    const character = await page.locator('.hero-raccoon').boundingBox();
    const dinosaur = await expectFullSprite(page.locator('.hero-raccoon'));
    expect(character!.width).toBeCloseTo(raccoonSize!.width, 1);
    expect(character!.height).toBeCloseTo(raccoonSize!.height, 1);
    expect(Math.abs(dinosaur.visibleHeight - raccoon.visibleHeight), 'characters have the same visible height').toBeLessThan(2);
    const picker = await page.getByRole('group', { name: 'Vali oma tegelane' }).boundingBox();
    if (width < 600) {
      expect(picker!.x + picker!.width / 2).toBeCloseTo(width / 2, 0);
      expect(character!.x + character!.width / 2).toBeCloseTo(width / 2, 0);
      expect(raccoonSize!.x + raccoonSize!.width / 2).toBeCloseTo(width / 2, 0);
    } else {
      expect(picker!.x + picker!.width / 2).toBeGreaterThan(character!.x + character!.width / 2);
    }
    expect(picker!.y).toBeGreaterThanOrEqual(character!.y + character!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.reload();
    await expect(page.getByRole('button', { name: 'Dinosaurus', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.screenshot({ path: `test-results/dinosaur-home-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Alusta mängu', exact: true }).click();
    await expect(page.locator('.tutorial-step .raccoon')).toHaveAttribute('data-character', 'dinosaur');
    await expectFullSprite(page.locator('.tutorial-step .raccoon'));
    await page.getByRole('button', { name: 'Alustan!' }).click();
    for (let day = 1; day <= 3; day++) {
      await expect(page.locator('.raccoon-status .raccoon')).toHaveAttribute('data-character', 'dinosaur');
      for (let meal = 0; meal < 3; meal++) {
        await expect(page.locator('.restaurant-marker')).toHaveCount(5);
        await page.locator('.restaurant-marker').first().click();
        await page.getByRole('button', { name: 'Valin selle' }).first().click();
        await expect(page.locator('.feedback-character .raccoon')).toHaveAttribute('data-character', 'dinosaur');
        await expectFullSprite(page.locator('.feedback-character .raccoon'));
        await page.getByRole('button', { name: meal === 2 ? 'Vaata päeva kokkuvõtet' : meal === 0 ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile' }).click();
      }
      await expect(page.locator('.summary-character .raccoon')).toHaveAttribute('data-character', 'dinosaur');
      await expectFullSprite(page.locator('.summary-character .raccoon'));
      await page.getByRole('button', { name: day < 3 ? 'Järgmine päev' : 'Vaata lõpptulemust', exact: true }).click();
    }
    await expect(page.locator('.final-raccoon-wrap .raccoon')).toHaveAttribute('data-character', 'dinosaur');
    await expectFullSprite(page.locator('.final-raccoon-wrap .raccoon'));
    const mood = await page.locator('.result-mood').getAttribute('data-mood');
    await expect(page.locator('.final-raccoon-wrap .raccoon')).toHaveClass(new RegExp(mood === 'unwell' ? 'raccoon-unwell' : 'raccoon-celebrate'));
    await expect(page.locator('.result-mood strong')).toHaveText(/^(Hea olla|Kõht on paha)$/);
    await page.reload();
    await expect(page.locator('.final-raccoon-wrap .raccoon')).toHaveAttribute('data-character', 'dinosaur');
    await page.screenshot({ path: `test-results/dinosaur-final-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Tagasi menüüsse' }).click();
    await page.getByRole('button', { name: 'Uus mäng', exact: true }).click();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('pesukaru-seiklus-v1')!).player.character)).toBe('dinosaur');
    await expect(page.getByRole('button', { name: 'Tagasi', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Sulge', exact: true }).click();
    await page.getByRole('dialog', { name: 'Kas soovid avalehele minna?' }).getByRole('button', { name: 'Jah, avalehele', exact: true }).click();
    await page.getByRole('button', { name: 'Pesukaru', exact: true }).click();
    await expect(page.locator('.hero-raccoon')).toHaveAttribute('data-character', 'raccoon');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Pesukaru', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}
