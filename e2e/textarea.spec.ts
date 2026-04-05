import { test, expect, Page } from '@playwright/test';
import { navigateTo } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-white.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('TextareaDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/textarea');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Textarea', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basics' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Validation' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Angular Forms' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            await navigateTo(page, '/textarea');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Basic ─────────────────────────────────────────────────────────────

    test.describe('Basic', () => {
        test('textarea element is visible', async ({ page }) => {
            await expect(card(page, 'Basic').locator('textarea[blocTextarea]')).toBeVisible();
        });

        test('typing in textarea updates its value', async ({ page }) => {
            const textarea = card(page, 'Basic').locator('textarea[blocTextarea]');
            await textarea.fill('Hello world');
            await expect(textarea).toHaveValue('Hello world');
        });

        test('disabled textarea is not editable', async ({ page }) => {
            await expect(card(page, 'Disabled').locator('textarea[blocTextarea]')).toBeDisabled();
        });
    });

    // ── Validation ────────────────────────────────────────────────────────

    test.describe('Validation', () => {
        test('manual error textarea has aria-invalid="true"', async ({ page }) => {
            await expect(
                card(page, 'Error, manual').locator('textarea[blocTextarea]'),
            ).toHaveAttribute('aria-invalid', 'true');
        });

        test('manual error shows error message element', async ({ page }) => {
            await expect(card(page, 'Error, manual').locator('bloc-input-error')).toBeVisible();
        });
    });
});
