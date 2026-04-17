import { test, expect, Page } from '@playwright/test';
import { navigateTo, collectConsoleErrors } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-gray-900.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('ProgressDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/progress');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Progress', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Sizing' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Theming' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/progress');
            expect(errors).toHaveLength(0);
        });
    });

    // ── ARIA ─────────────────────────────────────────────────────────────

    test.describe('ARIA', () => {
        test('progress bar has role="progressbar"', async ({ page }) => {
            await expect(page.getByRole('progressbar').first()).toBeVisible();
        });

        test('progress bar has aria-valuenow attribute', async ({ page }) => {
            const progressbar = page.getByRole('progressbar').first();
            const valueNow = await progressbar.getAttribute('aria-valuenow');
            expect(valueNow).not.toBeNull();
        });

        test('progress bar has aria-valuemax attribute', async ({ page }) => {
            const progressbar = page.getByRole('progressbar').first();
            await expect(progressbar).toHaveAttribute('aria-valuemax', '100');
        });
    });

    // ── Interactive label ─────────────────────────────────────────────────

    test.describe('Interactive label', () => {
        test('+12% button increases progress value', async ({ page }) => {
            const interactiveCard = card(page, 'Interactive label');
            const bar = interactiveCard.getByRole('progressbar');
            const before = Number(await bar.getAttribute('aria-valuenow'));
            await interactiveCard.getByRole('button', { name: '+12%' }).click();
            // Wait for Angular change detection to flush the updated attribute before reading it.
            await expect(bar).not.toHaveAttribute('aria-valuenow', String(before));
            const after = Number(await bar.getAttribute('aria-valuenow'));
            expect(after).toBeGreaterThan(before);
        });

        test('-12% button decreases progress value', async ({ page }) => {
            const interactiveCard = card(page, 'Interactive label');
            const bar = interactiveCard.getByRole('progressbar');
            const before = Number(await bar.getAttribute('aria-valuenow'));
            await interactiveCard.getByRole('button', { name: '-12%' }).click();
            // Wait for Angular change detection to flush the updated attribute before reading it.
            await expect(bar).not.toHaveAttribute('aria-valuenow', String(before));
            const after = Number(await bar.getAttribute('aria-valuenow'));
            expect(after).toBeLessThan(before);
        });
    });
});
