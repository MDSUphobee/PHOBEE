import { expect, test } from '@playwright/test';

test('GET /api/health returns auth-ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  await expect(res.json()).resolves.toEqual({ status: 'auth-ok' });
});
