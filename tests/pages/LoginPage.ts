import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../data/config';

interface UserInfo {
    sub: string;
    email: string;
    phone_number: string;
    tid: string;
    role: string[];
    docsa: boolean;
    fullname: string;
}

export class LoginPage extends BasePage {
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private userMenuButton: Locator;
    private logoutButton: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        // Login form elements
        this.emailInput = page.getByRole('textbox', { name: 'Adres e-mail' });
        this.passwordInput = page.getByRole('textbox', { name: 'Hasło' });
        this.loginButton = page.getByTestId('submit-button');

        // Post-login elements
        this.userMenuButton = page.getByRole('button', { name: 'MS' });
        this.logoutButton = page.getByText('Wyloguj się');
        this.errorMessage = page.getByText('Nieprawidłowy e-mail lub hasło')
    }

    // Navigation
    async goto() {
        await super.goto('/');
    }

    // Actions
    async fillLoginForm(email: string, password: string) {
        await this.fillWithValidation(this.emailInput, email);
        await this.fillWithValidation(this.passwordInput, password);
    }

    async clickLoginButton() {
        await this.clickWithRetry(this.loginButton);
        await this.waitForLoadComplete();
    }

    async waitForPostLoginState() {
        // Wait for network requests to complete
        await this.waitForLoadComplete();

        // Wait for the user menu button to be visible (indicates successful login)
        await this.userMenuButton.waitFor({
            state: 'visible',
            timeout: config.timeouts.medium
        });

        // Additional wait for any background processes
        await this.page.waitForTimeout(2000);
    }

    async login(email: string, password: string) {
        await this.fillLoginForm(email, password);
        await this.clickLoginButton();
        await this.waitForPostLoginState();
    }

    async logout() {
        await this.clickWithRetry(this.userMenuButton);
        await this.clickWithRetry(this.logoutButton);
        await this.waitForLoadComplete();
    }

    // Verifications
    async verifyEmailField(expectedValue: string) {
        await this.softAssert(async () => {
            await expect(this.emailInput).toHaveValue(expectedValue);
        });
    }

    async verifyPasswordField(expectedValue: string) {
        await this.softAssert(async () => {
            await expect(this.passwordInput).toHaveValue(expectedValue);
        });
    }

    async verifyLoginError() {
        // Verify we're still on login page
        await expect(this.page).toHaveURL(/.*ast-stage-wobble.axence.net\/?$/);

        // Check for error message with retry
        await this.errorMessage.waitFor({ state: 'visible', timeout: config.timeouts.short });

        // Verify login form is still accessible
        const formVisible = await this.softAssert(async () => {
            await expect(this.loginButton).toBeVisible();
            await expect(this.emailInput).toBeVisible();
            await expect(this.passwordInput).toBeVisible();
        });

        if (!formVisible) {
            await this.takeScreenshot('login-error-form-not-visible');
        }
    }

    async verifyUserInfoAPI() {
        const response = await this.makeApiRequest('https://mailsubdomeny1.ast-stage-wobble.axence.net/connect/userinfo');

        // Verify response status
        expect(response.status()).toBe(200);

        // Parse and verify response body
        const userInfo: UserInfo = await response.json();

        // Verify the structure and types of the response
        expect(userInfo).toMatchObject({
            sub: expect.any(String),
            email: expect.any(String),
            phone_number: expect.any(String),
            tid: expect.any(String),
            role: expect.any(Array),
            docsa: expect.any(Boolean),
            fullname: expect.any(String)
        });

        // Verify specific values
        expect(userInfo.email).toBe(process.env.ADMIN_USERNAME);
        expect(userInfo.role).toContain('admin');

        return userInfo;
    }
} 