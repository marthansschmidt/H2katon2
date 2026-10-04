import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { FOOD_IMAGES } from '../src/data/foodImages';
import { MOCK_FOODS } from '../src/data/mockRestaurants';

test('all menu illustrations are distinct transparent PNGs and load in the browser', async ({ page }) => {
  const hashes = MOCK_FOODS.map(food => {
    const bytes = readFileSync(resolve('public', FOOD_IMAGES[food.id].slice(1)));
    expect(bytes.subarray(0, 8).toString('hex'), food.id).toBe('89504e470d0a1a0a');
    expect(bytes.readUInt32BE(16), food.id).toBe(320);
    expect(bytes.readUInt32BE(20), food.id).toBe(320);
    expect([4, 6], food.id).toContain(bytes[25]);
    return createHash('sha256').update(bytes).digest('hex');
  });
  expect(new Set(hashes).size).toBe(MOCK_FOODS.length);
  await page.goto('/');
  const images = await page.evaluate(async paths => Promise.all(paths.map(async src => {
    const image = new Image();
    image.src = src;
    await image.decode();
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const cornerAlpha = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]]
      .map(([x, y]) => context.getImageData(x, y, 1, 1).data[3]);
    return { src, width, height, cornerAlpha };
  })), Object.values(FOOD_IMAGES));
  expect(images).toHaveLength(MOCK_FOODS.length);
  for (const image of images) {
    expect(image.width, image.src).toBe(320);
    expect(image.height, image.src).toBe(320);
    // Allow up to 2/255 alpha from generation/resampling at otherwise clear edges.
    for (const alpha of image.cornerAlpha) expect(alpha, image.src).toBeLessThanOrEqual(2);
  }
});
