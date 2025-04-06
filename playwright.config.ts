import { defineConfig, devices } from '@playwright/test';
import { config } from './tests/data/config';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Verify required environment variables
const requiredEnvVars = [
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'INVALID_PASSWORD',
    'INVALID_EMAIL',
    'RANDOM_PASSWORD'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}\nPlease set these variables in GitHub Secrets or your local .env file for development.`);
}

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