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

test.describe('CheckboxDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/checkbox');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Checkbox', level: 1 })).toBeVisible();
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
            const errors: string[] = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            await navigateTo(page, '/checkbox');
            expect(errors).toHaveLength(0);
        });
    });

    // ── States ────────────────────────────────────────────────────────────

    test.describe('States', () => {
        test('unchecked checkbox has aria-checked="false"', async ({ page }) => {
            const checkbox = card(page, 'Default (unchecked)').locator('bloc-checkbox').first();
            await expect(checkbox).toHaveAttribute('aria-checked', 'false');
        });

        test('pre-checked checkbox has aria-checked="true"', async ({ page }) => {
            const checkbox = card(page, 'Default (checked)').locator('bloc-checkbox').first();
            await expect(checkbox).toHaveAttribute('aria-checked', 'true');
        });

        test('disabled checkbox has aria-disabled="true"', async ({ page }) => {
            const checkbox = card(page, 'Disabled (unchecked)').locator('bloc-checkbox').first();
            await expect(checkbox).toHaveAttribute('aria-disabled', 'true');
        });
    });

    // ── Interaction ───────────────────────────────────────────────────────

    test.describe('Interaction', () => {
        test('clicking checkbox toggles aria-checked', async ({ page }) => {
            const checkbox = card(page, 'Default (unchecked)').locator('bloc-checkbox').first();
            await expect(checkbox).toHaveAttribute('aria-checked', 'false');
            await checkbox.click();
            await expect(checkbox).toHaveAttribute('aria-checked', 'true');
        });

        test('disabled checkbox cannot be toggled', async ({ page }) => {
            const checkbox = card(page, 'Disabled (unchecked)').locator('bloc-checkbox').first();
            await checkbox.click({ force: true });
            await expect(checkbox).toHaveAttribute('aria-checked', 'false');
        });
    });

    // ── ngModel two-way binding ───────────────────────────────────────────

    test.describe('Template-driven (ngModel)', () => {
        test('clicking checkbox updates the binding label', async ({ page }) => {
            const bindingCard = card(page, 'Two-way binding');
            const checkbox = bindingCard.locator('bloc-checkbox').first();
            // Toggle on
            await checkbox.click();
            await expect(bindingCard).toContainText(/Checked|true/i);
        });
    });
});
