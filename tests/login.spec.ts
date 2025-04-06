import { test } from './fixtures/auth.fixture';
import { config } from './data/config';
import { LoginPage } from './pages/LoginPage';

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

test.describe('Admin Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should successfully login with valid admin credentials', async () => {
        const { username, password } = config.credentials.admin;

        // Fill in login form and verify
        await loginPage.fillLoginForm(username, password);
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);

        // Submit form and wait for login completion
        await loginPage.clickLoginButton();
        await loginPage.waitForPostLoginState(true);

        // Cleanup
        await loginPage.logout(true);
    });
});

test.describe('User Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should successfully login with valid user credentials', async () => {
        const { username, password } = config.credentials.user;

        // Fill in login form and verify
        await loginPage.fillLoginForm(username, password);
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);

        // Submit form and wait for login completion
        await loginPage.clickLoginButton();
        await loginPage.waitForPostLoginState(false);

        // Cleanup
        await loginPage.logout(false);
    });
});

test.describe('Invalid Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should show error with valid email but invalid password', async ({ page }) => {
        const { username, password } = config.credentials.invalid.validEmailInvalidPass;

        // Attempt login with invalid credentials
        await loginPage.fillLoginForm(username, password);
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);
        await loginPage.clickLoginButton();

        // Verify error state
        await loginPage.verifyLoginError();
    });

    test('should show error with invalid email format', async () => {
        const { username, password } = config.credentials.invalid.invalidEmail;

        // Attempt login with invalid email
        await loginPage.fillLoginForm(username, password);
        await loginPage.verifyEmailField(username);
        await loginPage.verifyPasswordField(password);
        await loginPage.clickLoginButton();

        // Verify error state
        await loginPage.verifyLoginError();
    });
}); 