import type { Page } from '@playwright/test';
import { DINOSAUR_UNLOCK_KEY } from '../../src/game/characters';

// Character artwork tests start with a previously earned unlock.
export async function seedUnlockedDinosaur(page: Page) {
  await page.evaluate(key => localStorage.setItem(key, 'true'), DINOSAUR_UNLOCK_KEY);
  await page.reload();
}
