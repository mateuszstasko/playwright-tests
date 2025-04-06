import { test as base, expect } from './fixtures/auth.fixture';
import { config } from './data/config';
import { LoginPage } from './pages/LoginPage';

// Define a test fixture for LoginPage
type LoginFixture = {
    loginPage: LoginPage;
};

const test = base.extend<LoginFixture>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        // Verify initial page state
        await expect.soft(page, 'Should start on login page').toHaveURL(/.*ast-stage-wobble.axence.net\/?$/);
        await expect.soft(loginPage.loginButton, 'Login button should be visible').toBeVisible({ timeout: config.timeouts.short });
        await expect.soft(loginPage.pageTitle, 'Page should have correct title').toHaveText('Zaloguj się na platformę Axence SecureTeam');

        await use(loginPage);
    },
});

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

// Shared verification functions
const verifyLoggedIn = async (loginPage: LoginPage, isAdmin: boolean = true) => {
    const menuButton = isAdmin ? loginPage.adminMenuButton : loginPage.userMenuButton;

    // Use Promise.all to run assertions in parallel
    await Promise.all([
        expect(menuButton, 'Menu button should be visible after login').toBeVisible({ timeout: config.timeouts.medium }),
        expect(loginPage.loginButton, 'Login button should not be visible after login').not.toBeVisible(),
        expect(loginPage.emailInput, 'Email input should not be visible after login').not.toBeVisible(),
        expect(loginPage.passwordInput, 'Password input should not be visible after login').not.toBeVisible()
    ]);
};

const verifyLoginError = async (loginPage: LoginPage) => {
    // Use Promise.all to run assertions in parallel
    await Promise.all([
        expect(loginPage.page, 'Should remain on login page').toHaveURL(/.*ast-stage-wobble.axence.net\/?$/),
        expect(loginPage.errorMessage, 'Error message should be visible').toBeVisible({ timeout: config.timeouts.medium }),
        expect(loginPage.errorMessage, 'Error message should have correct text').toHaveText(/Nieprawidłowy e-mail lub hasło/i),
        expect(loginPage.loginButton, 'Login button should remain visible').toBeVisible(),
        expect(loginPage.emailInput, 'Email input should remain visible and enabled').toBeEnabled(),
        expect(loginPage.passwordInput, 'Password input should remain visible and enabled').toBeEnabled()
    ]);
};

const verifyLoggedOut = async (loginPage: LoginPage) => {
    // Use Promise.all to run assertions in parallel
    await Promise.all([
        expect(loginPage.loginButton, 'Login button should be visible after logout').toBeVisible(),
        expect(loginPage.emailInput, 'Email input should be visible after logout').toBeVisible(),
        expect(loginPage.passwordInput, 'Password input should be visible after logout').toBeVisible(),
        expect(loginPage.page, 'Should return to login page after logout').toHaveURL(/.*ast-stage-wobble.axence.net\/?$/)
    ]);
};

test.describe('Admin Login Tests', () => {
    test('should successfully login with valid admin credentials', async ({ loginPage }) => {
        const { username, password } = config.credentials.admin;

        await loginPage.login(username, password, true);
        await verifyLoggedIn(loginPage, true);

        await loginPage.logout(true);
        await verifyLoggedOut(loginPage);
    });
});

test.describe('User Login Tests', () => {
    test('should successfully login with valid user credentials', async ({ loginPage }) => {
        const { username, password } = config.credentials.user;

        await loginPage.login(username, password, true);
        await verifyLoggedIn(loginPage, false);

        await loginPage.logout(false);
        await verifyLoggedOut(loginPage);
    });
});

test.describe('Invalid Login Tests', () => {
    test('should show error with valid email but invalid password', async ({ loginPage }) => {
        const { username, password } = config.credentials.invalid.validEmailInvalidPass;

        await loginPage.login(username, password, false);
        await verifyLoginError(loginPage);
    });

    test('should show error with invalid email format', async ({ loginPage }) => {
        const { username, password } = config.credentials.invalid.invalidEmail;

        await loginPage.login(username, password, false);
        await verifyLoginError(loginPage);
    });
}); 