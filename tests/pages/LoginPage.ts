import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../data/config';

export class LoginPage extends BasePage {
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private adminMenuButton: Locator;
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
        this.adminMenuButton = page.getByRole('button', { name: 'MS' });
        this.userMenuButton = page.getByRole('button', { name: 'tm' });
        this.logoutButton = page.getByText('Wyloguj się');
        this.errorMessage = page.locator('.text-error-500');
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

    async waitForPostLoginState(isAdmin: boolean = true) {
        // Wait for network requests to complete
        await this.waitForLoadComplete();

        // Wait for the appropriate menu button to be visible
        const menuButton = isAdmin ? this.adminMenuButton : this.userMenuButton;
        await menuButton.waitFor({
            state: 'visible',
            timeout: config.timeouts.medium
        });

        // Additional wait for any background processes
        await this.page.waitForTimeout(2000);
    }

    async login(email: string, password: string, isAdmin: boolean = true) {
        await this.fillLoginForm(email, password);
        await this.clickLoginButton();
        await this.waitForPostLoginState(isAdmin);
    }

    async logout(isAdmin: boolean = true) {
        const menuButton = isAdmin ? this.adminMenuButton : this.userMenuButton;
        await this.clickWithRetry(menuButton);
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

        // Wait for any network requests to complete
        await this.waitForLoadComplete();

        // Check for error message with retry
        await this.errorMessage.waitFor({
            state: 'visible',
            timeout: config.timeouts.medium  // Using medium timeout instead of short
        });

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
} 