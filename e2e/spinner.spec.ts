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

test.describe('SpinnerDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/spinner');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Spinner', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            // Check h3-level card headings (h2 section labels use CSS uppercase which
            // some Chromium accessibility tree builds report differently)
            await expect(
                page.getByRole('heading', { name: 'Preset Sizes', level: 3 }),
            ).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Custom Size via Inputs', level: 3 }),
            ).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Custom token', level: 3 }),
            ).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/spinner');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Preset sizes ──────────────────────────────────────────────────────

    test.describe('Preset sizes', () => {
        test('renders bloc-spinner elements', async ({ page }) => {
            const spinners = card(page, 'Preset Sizes').locator('bloc-spinner');
            await expect(spinners.first()).toBeVisible();
        });

        test('renders all five size variants (xs, sm, md, lg, xl)', async ({ page }) => {
            const spinnerCard = card(page, 'Preset Sizes');
            await expect(spinnerCard.locator('bloc-spinner[size="xs"]')).toBeVisible();
            await expect(spinnerCard.locator('bloc-spinner[size="sm"]')).toBeVisible();
            await expect(spinnerCard.locator('bloc-spinner[size="md"]')).toBeVisible();
            await expect(spinnerCard.locator('bloc-spinner[size="lg"]')).toBeVisible();
            await expect(spinnerCard.locator('bloc-spinner[size="xl"]')).toBeVisible();
        });
    });

    // ── Default (attribute selector) ──────────────────────────────────────

    test.describe('Default', () => {
        test('renders span[blocSpinner] element', async ({ page }) => {
            await expect(card(page, 'Default').locator('[blocSpinner]')).toBeVisible();
        });
    });

    // ── Custom sizing ─────────────────────────────────────────────────────

    test.describe('Custom sizing', () => {
        test('Custom Size via Inputs card is visible', async ({ page }) => {
            await expect(card(page, 'Custom Size via Inputs')).toBeVisible();
        });
    });
});
