import { defineConfig, devices } from '@playwright/test';

const appHost = 'localhost:4200';
const appUrl = `http://${appHost}`;

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env['CI'],
    retries: process.env['CI'] ? 2 : 0,
    workers: process.env['CI'] ? 4 : undefined,
    reporter: [['html', { outputFolder: 'playwright-report' }]],
    use: {
        baseURL: appUrl,
        trace: 'on-first-retry',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: process.env['CI'] ? 'npm run serve:demo' : 'npm start',
        url: appUrl,
        reuseExistingServer: !process.env['CI'],
        timeout: 120_000,
    },
});
