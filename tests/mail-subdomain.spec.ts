import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { config } from './data/config';

// Validate required environment variables before running tests
test.beforeAll(async () => {
    const requiredEnvVars = [
        'ADMIN_USERNAME',
        'ADMIN_PASSWORD',
        'INVALID_PASSWORD',
        'INVALID_EMAIL',
        'RANDOM_PASSWORD'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
            'Please set these variables in GitHub Secrets or your local .env file for development.'
        );
    }
});

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
        const { username, password } = config.credentials.invalid.validEmailInvalidPass;

        // Fill in login form with valid email but wrong password
        await loginPage.fillLoginForm(username, password);

        // Verify the values were entered correctly
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);

        // Submit form and wait for page load
        await loginPage.clickLoginButton();

        // Verify login failed with appropriate error message
        await loginPage.verifyLoginError();
    });

    test('should fail login with invalid email', async () => {
        const { username, password } = config.credentials.invalid.invalidEmail;

        // Fill in login form with invalid email
        await loginPage.fillLoginForm(username, password);

        // Verify the values were entered correctly
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);

        // Submit form and wait for page load
        await loginPage.clickLoginButton();

        // Verify login failed with appropriate error message
        await loginPage.verifyLoginError();
    });
}); 