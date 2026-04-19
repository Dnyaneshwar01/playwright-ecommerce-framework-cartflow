// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
   testDir: './tests',
   timeout: 30 * 1000,
   expect: {
      timeout: 30 * 1000,
   },
   reporter: 'html',
   use: {
      browserName: 'chromium',
      headless: false,
      viewport: null,
      launchOptions: {
         args: ['--start-maximized']
      }
   }

});

module.exports = config