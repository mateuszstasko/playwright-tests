import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../data/config';

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly adminMenuButton: Locator;
    readonly userMenuButton: Locator;
    readonly logoutButton: Locator;
    readonly errorMessage: Locator;
    readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        // Login form elements
        this.emailInput = page.getByRole('textbox', { name: 'Adres e-mail' });
        this.passwordInput = page.getByRole('textbox', { name: 'Hasło' });
        this.loginButton = page.getByRole('button', { name: 'Zaloguj się' });
        this.pageTitle = page.getByRole('heading');

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
    async login(email: string, password: string, expectSuccess: boolean = true) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

        if (expectSuccess) {
            // For successful login, wait for menu buttons
            await Promise.race([
                this.adminMenuButton.waitFor({ state: 'visible', timeout: config.timeouts.medium }),
                this.userMenuButton.waitFor({ state: 'visible', timeout: config.timeouts.medium })
            ]);
        } else {
            // For failed login, wait for error message
            await this.errorMessage.waitFor({ state: 'visible', timeout: config.timeouts.medium });
        }
    }

    async logout(isAdmin: boolean = true) {
        const menuButton = isAdmin ? this.adminMenuButton : this.userMenuButton;
        await menuButton.click();
        await this.logoutButton.click();
        // Wait for return to login page
        await this.loginButton.waitFor({ state: 'visible', timeout: config.timeouts.short });
    }
} 