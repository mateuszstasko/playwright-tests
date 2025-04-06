import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../data/config';

type Fixtures = {
    authenticatedPage: Page;
    loginPage: LoginPage;
};

// Extend the base test fixture with authentication
export const test = base.extend<Fixtures>({
    authenticatedPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(
            config.credentials.admin.username,
            config.credentials.admin.password
        );

        // Make the authenticated page available to the test
        await use(page);

        // Clean up after the test
        await loginPage.logout();
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    }
});

export { expect } from '@playwright/test'; 