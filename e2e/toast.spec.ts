import { test, expect, Page } from '@playwright/test';
import { navigateTo, collectConsoleErrors } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-white.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('ToastDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/toast');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Toast', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Types' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Options' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/toast');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Types ─────────────────────────────────────────────────────────────

    test.describe('Types', () => {
        test('"Show Info" triggers an alert/status toast', async ({ page }) => {
            await card(page, 'Info').getByRole('button', { name: 'Show Info' }).click();
            await expect(page.locator('bloc-toast').first()).toBeVisible();
        });

        test('"Show Success" triggers a success toast', async ({ page }) => {
            await card(page, 'Success').getByRole('button', { name: 'Show Success' }).click();
            const toast = page.locator('bloc-toast.bloc-toast--success');
            await expect(toast).toBeVisible();
        });

        test('"Show Warning" triggers a warning toast', async ({ page }) => {
            await card(page, 'Warning').getByRole('button', { name: 'Show Warning' }).click();
            const toast = page.locator('bloc-toast.bloc-toast--warning');
            await expect(toast).toBeVisible();
        });

        test('"Show Error" triggers an error toast', async ({ page }) => {
            await card(page, 'Error').getByRole('button', { name: 'Show Error' }).click();
            const toast = page.locator('bloc-toast.bloc-toast--error');
            await expect(toast).toBeVisible();
        });
    });

    // ── Options ───────────────────────────────────────────────────────────

    test.describe('Options', () => {
        test('"Show Persistent" toast remains visible', async ({ page }) => {
            await card(page, 'Persistent (no auto-dismiss)')
                .getByRole('button', { name: 'Show Persistent' })
                .click();
            await expect(page.locator('bloc-toast').first()).toBeVisible();
        });

        test('"Show Non-Dismissible" toast has no dismiss button', async ({ page }) => {
            await card(page, 'Non-dismissible')
                .getByRole('button', { name: 'Show Non-Dismissible' })
                .click();
            const toast = page.locator('bloc-toast').first();
            await expect(toast).toBeVisible();
            // No dismiss button inside this toast
            await expect(toast.getByRole('button', { name: /dismiss/i })).not.toBeVisible();
        });

        test('"Dismiss All" removes all visible toasts', async ({ page }) => {
            // Show a persistent toast first so there is something to dismiss
            await card(page, 'Persistent (no auto-dismiss)')
                .getByRole('button', { name: 'Show Persistent' })
                .click();
            await expect(page.locator('bloc-toast').first()).toBeVisible();

            await card(page, 'Dismiss all').getByRole('button', { name: 'Dismiss All' }).click();
            await expect(page.locator('bloc-toast')).toHaveCount(0);
        });
    });
});
