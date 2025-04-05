import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { config } from './data/config';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should login with valid credentials', async () => {
        const { username, password } = config.credentials.admin;

        // Fill in login form
        await loginPage.fillLoginForm(username, password);

        // Verify form values before submission
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);

        // Submit form and wait for page load
        await loginPage.clickLoginButton();

        // Optional: Logout after successful verification
        await loginPage.logout();
    });

    test('should fail login with valid email but invalid password', async () => {
        const { username } = config.credentials.admin;
        const invalidPassword = 'wrongPassword123';

        // Fill in login form with valid email but wrong password
        await loginPage.fillLoginForm(username, invalidPassword);

        // Verify the values were entered correctly
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(invalidPassword);

        // Submit form and wait for page load
        await loginPage.clickLoginButton();

        // Verify login failed with appropriate error message
        await loginPage.verifyLoginError();
    });
}); 