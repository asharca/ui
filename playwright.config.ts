import { defineConfig } from '@playwright/test';
const base = process.env.BASE_PATH || '/';
export default defineConfig({
  testDir: 'tests/browser', timeout: 45000, expect: { timeout: 10000 }, fullyParallel: false,
  use: { baseURL: `http://127.0.0.1:4173${base}`, viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: { command: 'pnpm preview --host 127.0.0.1 --port 4173', url: `http://127.0.0.1:4173${base}`, reuseExistingServer: !process.env.CI, timeout: 30000 },
});
