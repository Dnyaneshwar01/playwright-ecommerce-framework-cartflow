// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Global test timeout */
  timeout: 30 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  /* Run tests in parallel */
  fullyParallel: true,

  /* Reporter */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  use: {
    /* Base settings */
    headless: process.env.CI ? true : false,
    browserName: 'chromium',

    /* Better debugging */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    /* Launch options */
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
  },

//   /* Optional: Multi-browser setup */
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },
//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },
//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },
//   ],
});