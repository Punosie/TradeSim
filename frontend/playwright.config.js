import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the production build (`vite preview`) and a local
// backend. Both are started automatically, or reused if already running.
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:4173'
const API_URL = process.env.E2E_API_URL || 'http://127.0.0.1:8000'
const python = process.platform === 'win32' ? '.venv\\Scripts\\python' : '.venv/bin/python'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 20_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: `${python} server.py`,
          cwd: '../backend',
          url: `${API_URL}/health`,
          reuseExistingServer: true,
          timeout: 120_000,
          env: { ENV: 'prod', PORT: '8000' },
        },
        {
          command: 'npm run build && npm run preview -- --port 4173 --strictPort',
          url: BASE_URL,
          reuseExistingServer: true,
          timeout: 180_000,
          env: { VITE_API_URL: API_URL, VITE_WS_URL: API_URL.replace(/^http/, 'ws') },
        },
      ],
})
