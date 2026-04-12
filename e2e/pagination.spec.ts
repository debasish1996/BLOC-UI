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

test.describe('PaginationDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/pagination');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Pagination', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Default' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Configurations' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'States' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/pagination');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Rendering ─────────────────────────────────────────────────────────

    test.describe('Rendering', () => {
        test('renders bloc-pagination elements', async ({ page }) => {
            await expect(page.locator('bloc-pagination').first()).toBeVisible();
        });

        test('renders page buttons inside the basic card', async ({ page }) => {
            const basicCard = card(page, 'Basic');
            const pageButtons = basicCard.locator('.bloc-pagination__page');
            await expect(pageButtons.first()).toBeVisible();
        });

        test('first page button is marked active by default', async ({ page }) => {
            const basicCard = card(page, 'Basic');
            const activeBtn = basicCard.locator('.bloc-pagination__page.is-active');
            await expect(activeBtn).toBeVisible();
            await expect(activeBtn).toHaveText('1');
        });

        test('renders nav element with aria-label', async ({ page }) => {
            const nav = page.locator('nav.bloc-pagination__nav').first();
            await expect(nav).toBeVisible();
            await expect(nav).toHaveAttribute('aria-label', 'Pagination');
        });

        test('active page button has aria-current="page"', async ({ page }) => {
            const basicCard = card(page, 'Basic');
            const activeBtn = basicCard.locator('.bloc-pagination__page[aria-current="page"]');
            await expect(activeBtn).toBeVisible();
        });
    });

    // ── Navigation ────────────────────────────────────────────────────────

    test.describe('Navigation', () => {
        test('clicking Next advances to page 2', async ({ page }) => {
            const basicCard = card(page, 'Basic');
            const nextBtn = basicCard.locator('.bloc-pagination__control').last();
            await nextBtn.click();
            const activeBtn = basicCard.locator('.bloc-pagination__page.is-active');
            await expect(activeBtn).toHaveText('2');
        });

        test('clicking a page button marks it active', async ({ page }) => {
            const basicCard = card(page, 'Basic');
            const page3Btn = basicCard.locator('.bloc-pagination__page', { hasText: '3' });
            await page3Btn.click();
            await expect(page3Btn).toHaveClass(/is-active/);
        });

        test('Prev button is disabled on first page', async ({ page }) => {
            const basicCard = card(page, 'Basic');
            const prevBtn = basicCard.locator('.bloc-pagination__control').first();
            await expect(prevBtn).toBeDisabled();
        });
    });

    // ── States ────────────────────────────────────────────────────────────

    test.describe('States', () => {
        test('renders globally disabled pagination', async ({ page }) => {
            const disabledCard = card(page, 'Globally Disabled');
            const pageButtons = disabledCard.locator('.bloc-pagination__page');
            await expect(pageButtons.first()).toBeDisabled();
        });

        test('single-page pagination: both controls disabled', async ({ page }) => {
            const singleCard = card(page, 'Single Page');
            const controls = singleCard.locator('.bloc-pagination__control');
            await expect(controls.first()).toBeDisabled();
            await expect(controls.last()).toBeDisabled();
        });
    });

    // ── First & Last buttons ──────────────────────────────────────────────

    test.describe('First & Last Buttons', () => {
        test('renders first and last controls when showFirstLast is true', async ({ page }) => {
            const firstLastCard = card(page, 'Show First & Last');
            const controls = firstLastCard.locator('.bloc-pagination__control');
            // 4 controls expected: first + prev + next + last
            await expect(controls).toHaveCount(4);
        });
    });
});
