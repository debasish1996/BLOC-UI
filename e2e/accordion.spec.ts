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

test.describe('AccordionDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/accordion');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Accordion', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Common Patterns' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'States' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/accordion');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Rendering ─────────────────────────────────────────────────────────

    test.describe('Rendering', () => {
        test('renders bloc-accordion elements', async ({ page }) => {
            await expect(page.locator('bloc-accordion').first()).toBeVisible();
        });

        test('renders accordion triggers', async ({ page }) => {
            await expect(
                page.locator('.bloc-accordion-trigger').first(),
            ).toBeVisible();
        });

        test('Single Open Item card: first item is expanded by default', async ({ page }) => {
            const singleCard = card(page, 'Single Open Item');
            const panels = singleCard.locator('.bloc-accordion-panel');
            // First panel should be visible (not hidden)
            await expect(panels.first()).toBeVisible();
        });

        test('Multi Expand card: renders multiple expanded panels by default', async ({ page }) => {
            const multiCard = card(page, 'Multi Expand');
            const visiblePanels = multiCard.locator('.bloc-accordion-panel:not([hidden])');
            await expect(visiblePanels).toHaveCount(2);
        });
    });

    // ── Toggle behaviour ──────────────────────────────────────────────────

    test.describe('Toggle behaviour', () => {
        test('clicking a collapsed trigger expands its panel', async ({ page }) => {
            const singleCard = card(page, 'Single Open Item');
            const detailsTrigger = singleCard.locator('.bloc-accordion-trigger', {
                hasText: 'Details',
            });
            const detailsPanel = singleCard.locator('.bloc-accordion-panel').nth(1);

            await expect(detailsPanel).not.toBeVisible();
            await detailsTrigger.click();
            await expect(detailsPanel).toBeVisible();
        });

        test('single mode: opening one item collapses the previously open item', async ({
            page,
        }) => {
            const singleCard = card(page, 'Single Open Item');
            const overviewPanel = singleCard.locator('.bloc-accordion-panel').first();
            const detailsTrigger = singleCard.locator('.bloc-accordion-trigger', {
                hasText: 'Details',
            });

            // Overview is open initially
            await expect(overviewPanel).toBeVisible();
            // Open Details — Overview should collapse
            await detailsTrigger.click();
            await expect(overviewPanel).not.toBeVisible();
        });

        test('clicking an open trigger collapses it', async ({ page }) => {
            const singleCard = card(page, 'Single Open Item');
            const overviewTrigger = singleCard.locator('.bloc-accordion-trigger', {
                hasText: 'Overview',
            });
            const overviewPanel = singleCard.locator('.bloc-accordion-panel').first();

            await expect(overviewPanel).toBeVisible();
            await overviewTrigger.click();
            await expect(overviewPanel).not.toBeVisible();
        });
    });

    // ── ARIA ──────────────────────────────────────────────────────────────

    test.describe('ARIA', () => {
        test('expanded trigger has aria-expanded="true"', async ({ page }) => {
            const singleCard = card(page, 'Single Open Item');
            const overviewTrigger = singleCard.locator('.bloc-accordion-trigger', {
                hasText: 'Overview',
            });
            await expect(overviewTrigger).toHaveAttribute('aria-expanded', 'true');
        });

        test('collapsed trigger has aria-expanded="false"', async ({ page }) => {
            const singleCard = card(page, 'Single Open Item');
            const detailsTrigger = singleCard.locator('.bloc-accordion-trigger', {
                hasText: 'Details',
            });
            await expect(detailsTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('panels have role="region"', async ({ page }) => {
            const panel = page.locator('.bloc-accordion-panel').first();
            await expect(panel).toHaveAttribute('role', 'region');
        });
    });

    // ── States ────────────────────────────────────────────────────────────

    test.describe('States', () => {
        test('disabled trigger has disabled attribute', async ({ page }) => {
            const disabledCard = card(page, 'Disabled');
            const disabledTrigger = disabledCard.locator('.bloc-accordion-trigger', {
                hasText: 'Disabled section',
            });
            await expect(disabledTrigger).toBeDisabled();
        });

        test('clicking disabled trigger does not expand its panel', async ({ page }) => {
            const disabledCard = card(page, 'Disabled');
            const disabledTrigger = disabledCard.locator('.bloc-accordion-trigger', {
                hasText: 'Disabled section',
            });
            const disabledPanel = disabledCard.locator('.bloc-accordion-panel').nth(1);

            // Trigger is disabled — force click via dispatchEvent to confirm it truly blocks
            await expect(disabledPanel).not.toBeVisible();
            await disabledTrigger.click({ force: true });
            await expect(disabledPanel).not.toBeVisible();
        });
    });
});
