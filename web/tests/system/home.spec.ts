import { expect, test } from '@playwright/test';

test('home page loads and exposes auth links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Se connecter' })).toBeVisible();
  await expect(page.getByRole('link', { name: "S'inscrire" })).toBeVisible();
});
