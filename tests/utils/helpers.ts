import { Page } from '@playwright/test';

export async function waitForNetworkIdle(page: Page) {
    await page.waitForLoadState('networkidle');
}

export async function takeScreenshot(page: Page, name: string) {
    await page.screenshot({ path: `./screenshots/${name}.png` });
}

export function generateRandomEmail() {
    return `test${Date.now()}@example.com`;
}

export function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
} 