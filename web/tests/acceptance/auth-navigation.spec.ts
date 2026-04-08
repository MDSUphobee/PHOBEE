import { expect, test } from '@playwright/test';

test('visitor can navigate home → login → signup', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Bon retour !' })).toBeVisible();

  await page.getByRole('link', { name: "S'inscrire" }).click();
  await expect(page).toHaveURL(/\/signup/);
  await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
});
