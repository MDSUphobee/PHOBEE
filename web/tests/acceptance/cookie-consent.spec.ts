import { expect, test } from '@playwright/test';

test('cookie banner can be accepted and stays hidden on reload', async ({ page }) => {
  await page.goto('/');

  const bannerTitle = page.getByText('Gestion des cookies');
  await expect(bannerTitle).toBeVisible();

  await page.getByRole('button', { name: 'Accepter' }).click();
  await expect(bannerTitle).toBeHidden();

  await page.reload();
  await expect(bannerTitle).toBeHidden();
});
