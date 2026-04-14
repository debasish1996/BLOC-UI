import { test, expect, Page } from '@playwright/test';
import { navigateTo, collectConsoleErrors } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Card scoped to an h3 heading with exact text. */
function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-gray-900.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('ButtonDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/button');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Button', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Variants' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'States' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Composition' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/button');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Variants ──────────────────────────────────────────────────────────

    test.describe('Variants', () => {
        test('Primary button is visible', async ({ page }) => {
            await expect(
                card(page, 'Primary').getByRole('button', { name: 'Primary Button' }),
            ).toBeVisible();
        });

        test('Secondary button is visible', async ({ page }) => {
            await expect(
                card(page, 'Secondary').getByRole('button', { name: 'Secondary Button' }),
            ).toBeVisible();
        });

        test('Outline button is visible', async ({ page }) => {
            await expect(
                card(page, 'Outline').getByRole('button', { name: 'Outline Button' }),
            ).toBeVisible();
        });
    });

    // ── States ────────────────────────────────────────────────────────────

    test.describe('States', () => {
        test('disabled button has disabled attribute', async ({ page }) => {
            await expect(
                card(page, 'Disabled').getByRole('button', { name: 'Disabled Button' }),
            ).toBeDisabled();
        });

        test('loading button applies bloc-button--loading class after click', async ({ page }) => {
            const loadingBtn = card(page, 'Loading — Primary').getByRole('button', {
                name: 'Submit',
            });
            // Button should be in normal state initially (not loading)
            await expect(loadingBtn).toBeVisible();
            await loadingBtn.click();
            await expect(loadingBtn).toHaveClass(/bloc-button--loading/);
        });

        test('loading button is disabled while loading', async ({ page }) => {
            const loadingBtn = card(page, 'Loading — Primary').getByRole('button', {
                name: 'Submit',
            });
            await loadingBtn.click();
            await expect(loadingBtn).toBeDisabled();
        });
    });

    // ── Composition ───────────────────────────────────────────────────────

    test.describe('Composition', () => {
        test('Full Width button fills container', async ({ page }) => {
            const btn = card(page, 'Full Width').getByRole('button', { name: 'Full Width' });
            await expect(btn).toBeVisible();
        });
    });
});
