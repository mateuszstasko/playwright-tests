import { test, expect } from './fixtures/auth.fixture';
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
    test('should login with valid credentials and verify user info', async ({ loginPage }) => {
        await loginPage.goto();
        const { username, password } = config.credentials.admin;

        // Fill in login form and verify
        await loginPage.fillLoginForm(username, password);
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);

        // Submit form and verify user info
        await loginPage.clickLoginButton();
        // const userInfo = await loginPage.verifyUserInfoAPI();

        // Additional specific checks
        //expect(userInfo.email).toBe(username);
        //expect(userInfo.role).toContain('admin');
        //expect(userInfo.docsa).toBe(true);

        // Cleanup
        await loginPage.logout();
    });

    test('should fail login with valid email but invalid password', async ({ loginPage }) => {
        await loginPage.goto();
        const { username, password } = config.credentials.invalid.validEmailInvalidPass;

        // Attempt login with invalid credentials
        await loginPage.fillLoginForm(username, password);
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);
        await loginPage.clickLoginButton();

        // Verify error state
        await loginPage.verifyLoginError();
    });

    test('should fail login with invalid email', async ({ loginPage }) => {
        await loginPage.goto();
        const { username, password } = config.credentials.invalid.invalidEmail;

        // Attempt login with invalid email
        await loginPage.fillLoginForm(username, password);
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);
        await loginPage.clickLoginButton();

        // Verify error state
        await loginPage.verifyLoginError();
    });

    test('should maintain session after successful login', async ({ authenticatedPage }) => {
        // This test uses the authenticatedPage fixture which handles login automatically
        await expect(authenticatedPage).toHaveURL(/.*ast-stage-wobble.axence.net/);
    });
}); 