import { Page } from '@playwright/test';

export async function navigateTo(page: Page, route: string) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
}

/**
 * Patterns that match transient Vite dev-server noise — not application errors.
 * 504 "Outdated Optimize Dep" is Vite's cache-invalidation signal and the
 * highlight.js import failure is its cascading side-effect.
 */
const IGNORED_ERROR_PATTERNS = [
    /Outdated Optimize Dep/,
    /Failed to fetch dynamically imported module/,
];

/**
 * Starts collecting console errors on `page`, filtering out known
 * Vite dev-server transient messages.  Returns a reference to the
 * live array so the test can assert on it after navigation.
 */
export function collectConsoleErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const text = msg.text();
            if (!IGNORED_ERROR_PATTERNS.some((re) => re.test(text))) {
                errors.push(text);
            }
        }
    });
    return errors;
}
