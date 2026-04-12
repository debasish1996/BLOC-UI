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

test.describe('InputDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/input');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Input', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basic types' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Prefix / Suffix' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Validation' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/input');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Basic types ───────────────────────────────────────────────────────

    test.describe('Basic types', () => {
        test('text input renders with correct placeholder', async ({ page }) => {
            const input = card(page, 'Text').locator('input[id="input-name"]');
            await expect(input).toBeVisible();
            await expect(input).toHaveAttribute('placeholder', 'Enter your name');
        });

        test('typing in text input updates its value', async ({ page }) => {
            const input = card(page, 'Text').locator('input[id="input-name"]');
            await input.fill('Hello Bloc');
            await expect(input).toHaveValue('Hello Bloc');
        });

        test('disabled input is not editable', async ({ page }) => {
            const input = card(page, 'Disabled').locator('input[id="input-disabled"]');
            await expect(input).toBeDisabled();
        });
    });

    // ── Validation ────────────────────────────────────────────────────────

    test.describe('Validation', () => {
        test('manual error shows error message text', async ({ page }) => {
            const errorCard = card(page, 'Error — manual');
            await expect(errorCard.locator('bloc-input-error')).toBeVisible();
            await expect(errorCard.locator('bloc-input-error')).toContainText(
                'This field is required.',
            );
        });
    });

    // ── Prefix / Suffix ───────────────────────────────────────────────────

    test.describe('Prefix / Suffix', () => {
        test('prefix group renders bloc-input-group element', async ({ page }) => {
            await expect(card(page, 'Prefix icon').locator('bloc-input-group')).toBeVisible();
        });

        test('suffix group renders bloc-input-group element', async ({ page }) => {
            await expect(card(page, 'Suffix icon').locator('bloc-input-group')).toBeVisible();
        });
    });
});
