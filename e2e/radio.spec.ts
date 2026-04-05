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

test.describe('RadioDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/radio');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Radio', level: 1 })).toBeVisible();
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
            await navigateTo(page, '/radio');
            expect(errors).toHaveLength(0);
        });
    });

    // ── ARIA roles ────────────────────────────────────────────────────────

    test.describe('ARIA roles', () => {
        test('radio group has role="radiogroup"', async ({ page }) => {
            await expect(
                card(page, 'Medium (default)').locator('bloc-radio-group').first(),
            ).toHaveAttribute('role', 'radiogroup');
        });

        test('individual radio items have role="radio"', async ({ page }) => {
            const radios = card(page, 'Medium (default)').locator('bloc-radio[role="radio"]');
            await expect(radios.first()).toBeVisible();
        });
    });

    // ── States ────────────────────────────────────────────────────────────

    test.describe('States', () => {
        test('disabled radio group has aria-disabled on children', async ({ page }) => {
            const disabledRadio = card(page, 'Group disabled').locator('bloc-radio').first();
            await expect(disabledRadio).toHaveAttribute('aria-disabled', 'true');
        });
    });

    // ── Interaction ───────────────────────────────────────────────────────

    test.describe('Interaction', () => {
        test('clicking radio item sets aria-checked="true"', async ({ page }) => {
            const ngModelCard = card(page, 'Two-way binding');
            const firstRadio = ngModelCard.locator('bloc-radio').first();
            await firstRadio.click();
            await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
        });

        test('second radio click updates selection', async ({ page }) => {
            const ngModelCard = card(page, 'Two-way binding');
            const radios = ngModelCard.locator('bloc-radio');
            await radios.nth(1).click();
            await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
            await expect(radios.first()).toHaveAttribute('aria-checked', 'false');
        });
    });
});
