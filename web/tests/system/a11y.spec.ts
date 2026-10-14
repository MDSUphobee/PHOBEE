import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Pages publiques (pas besoin d'être connecté ni d'API pour s'afficher).
const ROUTES = [
  '/',
  '/abonnements',
  '/contact',
  '/faq',
  '/guide',
  '/dictionary',
  '/login',
  '/signup',
  '/inscription',
  '/mentions-legales',
  '/confidentialite',
];

for (const route of ROUTES) {
  test(`a11y WCAG 2.1 AA : ${route}`, async ({ page }) => {
    await page.goto(route);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(violations.map((v) => `${v.id} (${v.nodes.length}) : ${v.help}`)).toEqual([]);
  });
}
