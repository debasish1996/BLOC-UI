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

test.describe('ToggleDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/toggle');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Toggle', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Sizes' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'States' })).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Template-driven (ngModel)' }),
            ).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Reactive forms' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/toggle');
            expect(errors).toHaveLength(0);
        });
    });

    // ── ARIA ─────────────────────────────────────────────────────────────

    test.describe('ARIA', () => {
        test('toggle has role="switch"', async ({ page }) => {
            const toggle = card(page, 'Default (off)').locator('bloc-toggle').first();
            await expect(toggle).toHaveAttribute('role', 'switch');
        });

        test('default-off toggle has aria-checked="false"', async ({ page }) => {
            const toggle = card(page, 'Default (off)').locator('bloc-toggle').first();
            await expect(toggle).toHaveAttribute('aria-checked', 'false');
        });

        test('default-on toggle has aria-checked="true"', async ({ page }) => {
            const toggle = card(page, 'Default (on)').locator('bloc-toggle').first();
            await expect(toggle).toHaveAttribute('aria-checked', 'true');
        });

        test('disabled toggle has aria-disabled="true"', async ({ page }) => {
            const toggle = card(page, 'Disabled (off)').locator('bloc-toggle').first();
            await expect(toggle).toHaveAttribute('aria-disabled', 'true');
        });
    });

    // ── Interaction ───────────────────────────────────────────────────────

    test.describe('Interaction', () => {
        test('clicking toggle flips aria-checked', async ({ page }) => {
            const toggle = card(page, 'Default (off)').locator('bloc-toggle').first();
            await toggle.click();
            await expect(toggle).toHaveAttribute('aria-checked', 'true');
        });

        test('disabled toggle cannot be toggled', async ({ page }) => {
            const toggle = card(page, 'Disabled (off)').locator('bloc-toggle').first();
            await toggle.click({ force: true });
            await expect(toggle).toHaveAttribute('aria-checked', 'false');
        });

        test('ngModel toggle updates binding label', async ({ page }) => {
            const bindingCard = card(page, 'Two-way binding');
            const toggle = bindingCard.locator('bloc-toggle').first();
            await toggle.click();
            await expect(bindingCard).toContainText(/On|true/i);
        });
    });
});
