import { test, expect, type Page } from '@playwright/test';
import { MOCK_FOODS } from '../src/data/mockRestaurants';
import { createPlayerState, chooseFood, nextMeal, nextDay } from '../src/game/state';
import { SAVE_KEY } from '../src/game/storage';
import { MEAL_ORDER, type Screen } from '../src/types/game';

const viewports = [
  [320, 568], [360, 640], [390, 844], [430, 932], [600, 960], [606, 846],
  [725, 846], [768, 1024], [1024, 768], [568, 320], [667, 375], [844, 390], [1280, 720], [1440, 900],
  [1920, 1080], [2560, 1440],
];

function completedGame() {
  let player = createPlayerState();
  for (let day = 1; day <= 3; day++) {
    for (const meal of MEAL_ORDER) {
      const food = MOCK_FOODS.find(item => item.mealTimes.includes(meal))!;
      player = chooseFood(player, food, 'Testrestoran');
      if (meal !== 'dinner') player = nextMeal(player);
    }
    if (day < 3) player = nextDay(player);
  }
  return player;
}

async function openScreen(page: Page, screen: Screen, player = createPlayerState()) {
  await page.evaluate(({ key, save }) => localStorage.setItem(key, JSON.stringify(save)), {
    key: SAVE_KEY, save: { version: 1, player, screen, resumeScreen: screen, started: screen !== 'home' },
  });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
}

async function checkLayout(page: Page, label: string) {
  const size = page.viewportSize()!;
  expect(await page.evaluate(() => document.documentElement.scrollWidth), `${label}: horizontal overflow`).toBeLessThanOrEqual(size.width);
  const shell = await page.locator('.app-shell').boundingBox();
  expect(shell!.width, `${label}: viewport width`).toBe(size.width);
  expect(shell!.height, `${label}: viewport height`).toBeGreaterThanOrEqual(size.height);
  const dialog = page.getByRole('dialog');
  if (await dialog.count()) {
    const rect = await dialog.boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.y).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(size.width);
    expect(rect!.y + rect!.height).toBeLessThanOrEqual(size.height + 1);
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), `${label}: dialog overflow`).toBe(true);
  }
  const overflow = await page.locator('h1, h2, h3, .tutorial-step p, .food-card p, .group-name, .summary-meal .eyebrow').evaluateAll(elements => elements.filter(element => {
    const rect = element.getBoundingClientRect();
    return !element.closest('.sr-only') && rect.width > 0 && rect.height > 0 && element.scrollWidth > element.clientWidth + 1;
  }).map(element => element.textContent));
  expect(overflow, `${label}: text overflow`).toEqual([]);
}

for (const [width, height] of viewports) {
  test(`responsive views ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await checkLayout(page, 'home');
    const speech = page.locator('.hero-speech-bubble');
    await expect(speech).toHaveText('Aita mul veeta kolm päeva Tartus ja teha tasakaalustatud toiduvalikuid!');
    const bubble = await speech.boundingBox();
    const character = await page.locator('.hero-raccoon').boundingBox();
    expect(bubble!.y + bubble!.height, 'speech bubble above the raccoon').toBeLessThanOrEqual(character!.y);
    if (width < 600 && height > 500) {
      const picker = await page.getByRole('group', { name: 'Vali oma tegelane' }).boundingBox();
      expect(character!.x + character!.width / 2, 'character centers on mobile').toBeCloseTo(width / 2, 0);
      expect(picker!.x + picker!.width / 2, 'character picker centers on mobile').toBeCloseTo(width / 2, 0);
    }
    if (width >= 360 && height >= 640 || width >= 480) {
      const actions = await page.locator('.home-actions').boundingBox();
      expect(actions!.y + actions!.height, 'home actions fit the screen').toBeLessThanOrEqual(height);
    }
    await page.screenshot({ path: `test-results/responsive-home-${width}x${height}.png` });

    await page.getByRole('button', { name: 'Kuidas mängida?', exact: true }).click();
    await checkLayout(page, 'tutorial dialog');
    const title = await page.getByRole('dialog').locator('h2').boundingBox();
    const dialogRect = await page.getByRole('dialog').boundingBox();
    expect(Math.abs(title!.x + title!.width / 2 - dialogRect!.x - dialogRect!.width / 2)).toBeLessThanOrEqual(2);
    await page.getByRole('button', { name: 'Sain aru!' }).click();

    await page.getByRole('button', { name: 'Avasta toidupüramiidi' }).click();
    await checkLayout(page, 'pyramid guide');
    await page.keyboard.press('Escape');

    await openScreen(page, 'tutorial');
    await checkLayout(page, 'tutorial');
    await page.screenshot({ path: `test-results/responsive-tutorial-${width}x${height}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Alustan!' }).click();
    await expect(page.locator('.restaurant-marker')).toHaveCount(5);
    await page.evaluate(() => scrollTo(0, 0));
    await checkLayout(page, 'map');
    const dock = await page.locator('.map-status-dock').boundingBox();
    expect(dock!.y + dock!.height).toBeLessThanOrEqual(height + 1);
    const markers = await page.locator('.restaurant-marker').evaluateAll(elements => elements.map(element => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }));
    const header = await page.locator('.game-screen .game-header').boundingBox();
    const menuButton = await page.getByRole('button', { name: 'Ava menüü' }).boundingBox();
    expect(menuButton!.x + menuButton!.width, 'menu button stays in the screen corner').toBeCloseTo(width - 16, 0);
    expect(menuButton!.y, 'menu button stays at the top').toBeCloseTo(width < 840 ? 12 : 20, 0);
    const phone = await page.getByRole('button', { name: 'Ava toidupüramiid' }).boundingBox();
    if (width < 600) {
      expect(phone!.x + phone!.width).toBeCloseTo(width - 16, 0);
      expect(phone!.y + phone!.height).toBeCloseTo(height - 16, 0);
    } else {
      const controls = await page.locator('.map-bottom-controls').boundingBox();
      expect(controls!.x + controls!.width / 2, 'bottom controls center on tablet and desktop').toBeCloseTo(width / 2, 0);
      expect(phone!.x - dock!.x - dock!.width, 'phone sits right of the mood card with a gap').toBeCloseTo(16, 0);
      expect(phone!.y + phone!.height / 2, 'phone centers vertically beside the mood card').toBeCloseTo(dock!.y + dock!.height / 2, 0);
      expect(phone!.height, 'phone matches the mood card height').toBeCloseTo(dock!.height, 0);
    }
    if (width < 600) {
      expect(dock!.x, 'mood card aligns left').toBeCloseTo(16, 0);
      const moodCard = await page.locator('.raccoon-status').boundingBox();
      expect(moodCard!.height, 'mood card matches the phone height').toBeCloseTo(phone!.height, 0);
      expect(moodCard!.y, 'mood card aligns with the phone').toBeCloseTo(phone!.y, 0);
      expect(moodCard!.width, 'mood card keeps its width and spacing').toBeCloseTo(Math.min(414, width - 104), 0);
    }
    if (width < 840) {
      expect(header!.x, 'day controls align left').toBeCloseTo(16, 0);
      expect(header!.y, 'day controls align with settings').toBeCloseTo(menuButton!.y, 0);
      expect(header!.height, 'day controls match the settings height').toBeCloseTo(menuButton!.height, 0);
      expect(menuButton!.x - (header!.x + header!.width), 'day controls keep the gap to settings').toBeCloseTo(16, 0);
      const meal = await page.locator('.game-header .meal-badge').boundingBox();
      const dayOverview = await page.locator('.game-header .day-overview').boundingBox();
      const score = await page.locator('.game-header .score-chip').boundingBox();
      expect(meal!.x + meal!.width / 2, 'meal sits in the center of the card').toBeCloseTo(header!.x + header!.width / 2, 0);
      expect(dayOverview!.x + dayOverview!.width, 'day stays clear of the meal').toBeLessThanOrEqual(meal!.x);
      expect(meal!.x + meal!.width, 'meal stays clear of the score').toBeLessThanOrEqual(score!.x);
    }
    if (width < 600) expect(dock!.x + dock!.width).toBeLessThan(phone!.x);
    await expect(page.getByText('Toidupüramiidi täituvus', { exact: true })).toHaveCount(0);
    for (const marker of markers) {
      expect(marker.x).toBeGreaterThanOrEqual(0);
      expect(marker.x + marker.width).toBeLessThanOrEqual(width);
      expect(marker.y, 'marker below header').toBeGreaterThanOrEqual(header!.y + header!.height);
      expect(marker.y + marker.height, 'marker above dock').toBeLessThanOrEqual(dock!.y);
    }
    for (let i = 0; i < markers.length; i++) {
      for (let j = i + 1; j < markers.length; j++) {
        const a = markers[i], b = markers[j];
        expect(a.x >= b.x + b.width || b.x >= a.x + a.width || a.y >= b.y + b.height || b.y >= a.y + a.height, `markers ${i} and ${j} overlap`).toBe(true);
      }
    }
    await page.screenshot({ path: `test-results/responsive-map-${width}x${height}.png` });
    await page.getByRole('button', { name: 'Ava toidupüramiid' }).click();
    await checkLayout(page, 'progress');
    await page.keyboard.press('Escape');

    await page.locator('.restaurant-marker').first().click();
    await expect(page.locator('.food-card')).toHaveCount(3);
    await checkLayout(page, 'restaurant');
    await page.screenshot({ path: `test-results/responsive-menu-${width}x${height}.png` });
    await page.getByRole('button', { name: 'Valin selle' }).first().click();
    await checkLayout(page, 'feedback');

    const completed = completedGame();
    await openScreen(page, 'daySummary', completed);
    await checkLayout(page, 'daily summary');
    const summaryTitle = await page.locator('.summary-title h1').boundingBox();
    const dayScore = await page.locator('.day-score-total').boundingBox();
    expect(dayScore!.y, 'day score below the summary title').toBeGreaterThanOrEqual(summaryTitle!.y + summaryTitle!.height + 8);
    const summaryBubble = await page.locator('.summary-speech').boundingBox();
    const summaryCharacter = await page.locator('.summary-character .raccoon').boundingBox();
    expect(summaryBubble!.y + summaryBubble!.height, 'summary speech above character').toBeLessThanOrEqual(summaryCharacter!.y);
    await expect(page.locator('.summary-screen .feedback-card')).toHaveCount(0);
    if (width >= 900) {
      const overview = await page.locator('.summary-overview').boundingBox();
      const pyramid = await page.locator('.summary-screen .pyramid-panel').boundingBox();
      expect(overview!.x + overview!.width, 'summary character and text left of the pyramid').toBeLessThanOrEqual(pyramid!.x);
      expect(summaryCharacter!.width, 'larger summary character').toBeGreaterThan(260);
    }
    await page.screenshot({ path: `test-results/responsive-summary-${width}x${height}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Vaata lõpptulemust', exact: true }).click();
    await checkLayout(page, 'final');
    await expect(page.locator('.final-city > img')).toBeVisible();
    await page.locator('.final-city > img').evaluate(async image => {
      await (image as HTMLImageElement).decode();
    });
    await page.screenshot({ path: `test-results/responsive-final-${width}x${height}.png`, fullPage: true });
  });
}
