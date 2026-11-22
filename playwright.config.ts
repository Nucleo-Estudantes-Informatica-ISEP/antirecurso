import { randomBytes } from 'node:crypto';
import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:43188';
process.env.E2E_SESSION_SECRET ||= randomBytes(32).toString('hex');

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  use: { baseURL, browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'node e2e/backend.mjs',
      url: 'http://127.0.0.1:43189/health'
    },
    {
      command: 'node node_modules/next/dist/bin/next dev --hostname localhost --port 43188',
      gracefulShutdown: { signal: 'SIGTERM', timeout: 3000 },
      url: `${baseURL}/en`,
      timeout: 90_000,
      env: {
        API_BASE_URL: 'http://127.0.0.1:43189',
        NEXT_PUBLIC_BASE_URL: '/api/public',
        NEXTAUTH_URL: baseURL,
        AUTH_SECRET: process.env.E2E_SESSION_SECRET,
        AUTH_ISSUER_URL: 'http://127.0.0.1:43189',
        AUTH_CLIENT_ID: 'e2e'
      }
    }
  ]
});
