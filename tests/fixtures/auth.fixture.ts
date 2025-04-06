import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../data/config';
import * as fs from 'fs';

type Fixtures = {
    authenticatedPage: Page;
    loginPage: LoginPage;
};

// Extend the base test fixture with authentication
export const test = base.extend<Fixtures>({
    // Setup authentication state
    context: async ({ context }, use) => {
        // Create auth state if it doesn't exist
        if (!fs.existsSync('./auth.json')) {
            const page = await context.newPage();
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(
                config.credentials.admin.username,
                config.credentials.admin.password,
                true
            );
            await context.storageState({ path: './auth.json' });
            await page.close();
        }

        await use(context);
    },

    authenticatedPage: async ({ page }, use) => {
        await use(page);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    }
});

export { expect } from '@playwright/test'; 