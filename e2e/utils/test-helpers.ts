import { Page } from '@playwright/test';

export async function navigateTo(page: Page, route: string) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
}
