import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const useProdPreview = process.env.PLAYWRIGHT_PROD === '1';
const port = useProdPreview ? 4173 : 5173;
const baseURL = `http://127.0.0.1:${port}`;

const webServer = useProdPreview
  ? {
      command: 'npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
      url: baseURL,
      reuseExistingServer: !isCI,
      timeout: 30_000,
    }
  : {
      command: 'npx vite --host 127.0.0.1 --port 5173 --strictPort',
      url: baseURL,
      reuseExistingServer: !isCI,
      timeout: 60_000,
    };

export default defineConfig({
  testDir: './e2e',
  fullyParallel: !useProdPreview,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : useProdPreview ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer,
});
