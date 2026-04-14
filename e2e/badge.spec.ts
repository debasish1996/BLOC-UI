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

test.describe('BadgeDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/badge');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Badge', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Variants' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Sizing' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'In context' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/badge');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Variants ─────────────────────────────────────────────────────────

    test.describe('Variants', () => {
        test('renders bloc-badge elements', async ({ page }) => {
            await expect(card(page, 'Intent badges').locator('bloc-badge').first()).toBeVisible();
        });

        test('renders primary/success/warning/danger variant badges', async ({ page }) => {
            const variantCard = card(page, 'Intent badges');
            await expect(
                variantCard.locator('bloc-badge[variant="primary"]').first(),
            ).toBeVisible();
            await expect(
                variantCard.locator('bloc-badge[variant="success"]').first(),
            ).toBeVisible();
            await expect(
                variantCard.locator('bloc-badge[variant="warning"]').first(),
            ).toBeVisible();
            await expect(variantCard.locator('bloc-badge[variant="danger"]').first()).toBeVisible();
        });
    });

    // ── In context ────────────────────────────────────────────────────────

    test.describe('In context', () => {
        test('button with count badge renders Notifications button', async ({ page }) => {
            await expect(
                card(page, 'Button with count').getByRole('button', { name: /Notifications/ }),
            ).toBeVisible();
        });
    });
});
