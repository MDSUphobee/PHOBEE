import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: /.*\.spec\.ts/,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- -p 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'system',
      testDir: 'tests/system',
    },
    {
      name: 'acceptance',
      testDir: 'tests/acceptance',
    },
  ],
});
