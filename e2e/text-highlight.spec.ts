import { expect, Page, test } from '@playwright/test';
import { collectConsoleErrors, navigateTo } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-white.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('TextHighlightDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/text-highlight');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Text Highlight', level: 1 }),
            ).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basic Usage' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Interactive Search' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Case Sensitivity' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Highlight Color' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/text-highlight');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Rendering ─────────────────────────────────────────────────────────

    test.describe('Rendering', () => {
        test('Simple Highlight card wraps matching text in <mark> elements', async ({ page }) => {
            const simpleCard = card(page, 'Simple Highlight');
            const marks = simpleCard.locator('mark');
            await expect(marks.first()).toBeVisible();
        });

        test('matched marks have the bloc-text-highlight__match class', async ({ page }) => {
            const simpleCard = card(page, 'Simple Highlight');
            const mark = simpleCard.locator('mark.bloc-text-highlight__match').first();
            await expect(mark).toBeVisible();
        });

        test('Simple Highlight card: "App" is highlighted in Apple and Application', async ({
            page,
        }) => {
            const simpleCard = card(page, 'Simple Highlight');
            const marks = simpleCard.locator('mark');
            // At least Apple and Application should have a mark for "App"/"app"
            await expect(marks).toHaveCount(3);
        });

        test('No Match card renders text without any <mark> element', async ({ page }) => {
            const noMatchCard = card(page, 'No Match');
            await expect(noMatchCard.locator('mark')).toHaveCount(0);
            await expect(noMatchCard.locator('[blocTextHighlight]')).toContainText('Banana');
        });
    });

    // ── Interactive search ─────────────────────────────────────────────────

    test.describe('Interactive search', () => {
        test('typing in filter input highlights matching list items', async ({ page }) => {
            const filterCard = card(page, 'Filter List');
            const input = filterCard.locator('input[placeholder="Search fruits..."]');
            await input.fill('apple');
            const marks = filterCard.locator('mark');
            await expect(marks.first()).toBeVisible();
        });

        test('clearing the search input removes highlights', async ({ page }) => {
            const filterCard = card(page, 'Filter List');
            const input = filterCard.locator('input[placeholder="Search fruits..."]');
            await input.fill('apple');
            await input.fill('');
            await expect(filterCard.locator('mark')).toHaveCount(0);
        });

        test('no-match query shows the empty state message', async ({ page }) => {
            const filterCard = card(page, 'Filter List');
            const input = filterCard.locator('input[placeholder="Search fruits..."]');
            await input.fill('zzzzzz');
            await expect(filterCard.locator('li', { hasText: 'No matches' })).toBeVisible();
        });
    });

    // ── Case sensitivity ──────────────────────────────────────────────────

    test.describe('Case sensitivity', () => {
        test('case-insensitive mode highlights regardless of casing', async ({ page }) => {
            const caseCard = card(page, 'Case-Sensitive Mode');
            // The first row uses case-insensitive (default) and query "app" — should match "App"
            const insensitiveMark = caseCard.locator('mark').first();
            await expect(insensitiveMark).toBeVisible();
        });

        test('case-sensitive mode does not match when case differs', async ({ page }) => {
            const caseCard = card(page, 'Case-Sensitive Mode');
            // The second row uses [caseSensitive]="true" with query "app" against "Apple Application"
            // "app" won't match "App" with capital A — no mark in the second span
            const spans = caseCard.locator('[blocTextHighlight]');
            const secondSpan = spans.nth(1);
            await expect(secondSpan.locator('mark')).toHaveCount(0);
        });
    });

    // ── Highlight color ───────────────────────────────────────────────────

    test.describe('Highlight color', () => {
        test('With Color card: marks have the highlighted class', async ({ page }) => {
            const colorCard = card(page, 'With Color');
            const highlightedMark = colorCard.locator(
                'mark.bloc-text-highlight__match--highlighted',
            );
            await expect(highlightedMark.first()).toBeVisible();
        });
    });
});
