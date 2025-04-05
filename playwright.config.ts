import { defineConfig, devices } from '@playwright/test';
import { config } from './tests/data/config';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: config.baseUrl,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        ignoreHTTPSErrors: true,
        channel: 'chrome'
    },
    projects: [
        {
            name: 'mcp-chrome',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: ['--remote-debugging-port=9222']
                }
            },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
}); 