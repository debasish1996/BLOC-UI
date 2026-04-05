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

test.describe('TableDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/table');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Table', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basic usage' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'States' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Variants' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            await navigateTo(page, '/table');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Basic usage ───────────────────────────────────────────────────────

    test.describe('Basic usage', () => {
        test('default table renders column headers', async ({ page }) => {
            const defaultCard = card(page, 'Default');
            await expect(defaultCard.locator('th').filter({ hasText: 'Name' })).toBeVisible();
            await expect(defaultCard.locator('th').filter({ hasText: 'Email' })).toBeVisible();
            await expect(defaultCard.locator('th').filter({ hasText: 'Role' })).toBeVisible();
        });

        test('default table renders at least one data row', async ({ page }) => {
            const rows = card(page, 'Default').locator('tbody tr');
            await expect(rows.first()).toBeVisible();
            expect(await rows.count()).toBeGreaterThan(0);
        });
    });

    // ── States ────────────────────────────────────────────────────────────

    test.describe('States', () => {
        test('empty data table renders no tbody rows', async ({ page }) => {
            const emptyCard = card(page, 'Empty data');
            const rows = emptyCard.locator('tbody tr');
            expect(await rows.count()).toBe(0);
        });
    });

    // ── Variants ─────────────────────────────────────────────────────────

    test.describe('Variants', () => {
        test('striped table has bloc-table--striped class', async ({ page }) => {
            await expect(card(page, 'Striped').locator('bloc-table')).toHaveClass(
                /bloc-table--striped/,
            );
        });

        test('bordered table has bloc-table--bordered class', async ({ page }) => {
            await expect(card(page, 'Bordered').locator('bloc-table')).toHaveClass(
                /bloc-table--bordered/,
            );
        });

        test('hoverable table has bloc-table--hoverable class', async ({ page }) => {
            await expect(card(page, 'Hoverable').locator('bloc-table')).toHaveClass(
                /bloc-table--hoverable/,
            );
        });
    });

    // ── Sizes ─────────────────────────────────────────────────────────────

    test.describe('Sizes', () => {
        test('small table has bloc-table--sm class', async ({ page }) => {
            await expect(card(page, 'Small').locator('bloc-table')).toHaveClass(/bloc-table--sm/);
        });

        test('large table has bloc-table--lg class', async ({ page }) => {
            await expect(card(page, 'Large').locator('bloc-table')).toHaveClass(/bloc-table--lg/);
        });
    });
});
