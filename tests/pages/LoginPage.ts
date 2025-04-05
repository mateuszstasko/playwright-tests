import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private userMenuButton: Locator;
    private logoutButton: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Login form elements
        this.emailInput = page.getByRole('textbox', { name: 'Adres e-mail' });
        this.passwordInput = page.getByRole('textbox', { name: 'Hasło' });
        this.loginButton = page.getByTestId('submit-button');

        // Post-login elements
        this.userMenuButton = page.getByRole('button', { name: 'MS' })
        this.logoutButton = page.getByText('Wyloguj się')
        this.errorMessage = page.getByText(/Nieprawidłowe dane logowania|Invalid credentials/i);
    }

    // Navigation
    async goto() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    // Actions
    async fillLoginForm(email: string, password: string) {
        await this.emailInput.click();
        await this.emailInput.fill(email);

        await this.emailInput.press('Tab');
        await this.passwordInput.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
        await this.waitForPageLoadAfterLogin();
    }

    async login(email: string, password: string) {
        await this.fillLoginForm(email, password);
        await this.clickLoginButton();
    }

    async logout() {
        await this.userMenuButton.click();
        await this.logoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Verifications
    async verifyOnMailPage() {
        await expect(this.page).toHaveURL(/.*ast-stage-wobble.axence.net/);
    }

    async verifyEmailField(expectedValue: string) {
        await expect(this.emailInput).toHaveValue(expectedValue);
    }

    async verifyPasswordField(expectedValue: string) {
        await expect(this.passwordInput).toHaveValue(expectedValue);
    }

    async waitForPageLoadAfterLogin() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('[role="progressbar"]', { state: 'detached', timeout: 10000 }).catch(() => { });
    }

    async verifyLoginError() {
        // Verify we're still on login page
        await expect(this.page).toHaveURL(/.*ast-stage-wobble.axence.net\/?$/);

        // Check for error message
        await expect(this.errorMessage).toBeVisible({ timeout: 5000 });

        // Verify login form is still accessible
        await expect(this.loginButton).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }
} 