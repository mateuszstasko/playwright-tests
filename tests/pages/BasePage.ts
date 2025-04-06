import { Page, Locator, expect, APIRequestContext } from '@playwright/test';
import { config } from '../data/config';

export class BasePage {
    readonly page: Page;
    readonly request: APIRequestContext;

    constructor(page: Page) {
        this.page = page;
        this.request = page.request;
    }

    // Navigation with retry mechanism
    async goto(path: string, options = { retry: 3 }) {
        for (let attempt = 1; attempt <= options.retry; attempt++) {
            try {
                await this.page.goto(path, {
                    waitUntil: 'networkidle',
                    timeout: config.timeouts.medium
                });
                await this.page.waitForLoadState('networkidle');
                return;
            } catch (error) {
                if (attempt === options.retry) throw error;
                await this.page.waitForTimeout(1000 * attempt); // Exponential backoff
            }
        }
    }

    // Enhanced element interaction methods
    async clickWithRetry(locator: Locator, options = { timeout: config.timeouts.medium }) {
        await locator.waitFor({ state: 'visible', timeout: options.timeout });
        await locator.click();
    }

    async fillWithValidation(locator: Locator, value: string) {
        console.log('Attempting to fill form field with value:', value);
        if (!value) {
            throw new Error(`Cannot fill form field with undefined or empty value`);
        }
        await locator.waitFor({ state: 'visible', timeout: config.timeouts.medium });
        await locator.fill(value);
        await expect(locator).toHaveValue(value);
    }

    // Common wait conditions
    async waitForLoadComplete() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Screenshot and logging utilities
    async takeScreenshot(name: string) {
        await this.page.screenshot({
            path: `./screenshots/${name}-${new Date().toISOString()}.png`,
            fullPage: true
        });
    }

    // API request wrapper with error handling
    async makeApiRequest(url: string, options = {}) {
        return await this.request.get(url, {
            timeout: config.timeouts.medium,
            ...options
        });
    }

    // Soft assertions wrapper
    async softAssert(assertion: () => Promise<void>): Promise<boolean> {
        try {
            await assertion();
            return true;
        } catch (error) {
            console.warn(`Soft assertion failed: ${error}`);
            return false;
        }
    }
} 