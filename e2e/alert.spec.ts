import { test, expect, Page } from '@playwright/test';
import { navigateTo, collectConsoleErrors } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Scopes assertions to the card whose h3 heading matches the given text. */
function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-gray-900.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('AlertDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/alert');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Alert', level: 1 })).toBeVisible();
        });

        test('renders section card headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Variants', level: 3 })).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Dismissible', level: 3 }),
            ).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/alert');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Variants ──────────────────────────────────────────────────────────

    test.describe('Variants', () => {
        test('info variant alert is visible', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="info"]'),
            ).toBeVisible();
        });

        test('success variant alert is visible', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="success"]'),
            ).toBeVisible();
        });

        test('danger variant alert is visible', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="danger"]'),
            ).toBeVisible();
        });

        test('warning variant alert is visible in Dismissible card', async ({ page }) => {
            await expect(
                card(page, 'Dismissible').locator('bloc-alert[variant="warning"]'),
            ).toBeVisible();
        });
    });

    // ── Titles ────────────────────────────────────────────────────────────

    test.describe('Titles', () => {
        test('info alert renders "Heads up" title', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="info"] .bloc-alert__title'),
            ).toHaveText('Heads up');
        });

        test('success alert renders "Saved" title', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="success"] .bloc-alert__title'),
            ).toHaveText('Saved');
        });

        test('danger alert renders "Action required" title', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="danger"] .bloc-alert__title'),
            ).toHaveText('Action required');
        });

        test('warning alert renders "Sync paused" title', async ({ page }) => {
            await expect(
                card(page, 'Dismissible').locator(
                    'bloc-alert[variant="warning"] .bloc-alert__title',
                ),
            ).toHaveText('Sync paused');
        });
    });

    // ── Content ───────────────────────────────────────────────────────────

    test.describe('Content', () => {
        test('info alert body contains expected text', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="info"] .bloc-alert__content'),
            ).toContainText('Alerts work well for inline guidance');
        });

        test('warning alert body contains expected text', async ({ page }) => {
            await expect(
                card(page, 'Dismissible').locator(
                    'bloc-alert[variant="warning"] .bloc-alert__content',
                ),
            ).toContainText('Reconnect to resume background sync');
        });

        test('non-dismissible alerts do not show a dismiss button', async ({ page }) => {
            await expect(
                card(page, 'Variants').getByRole('button', { name: 'Dismiss alert' }),
            ).not.toBeVisible();
        });
    });

    // ── Dismissible ───────────────────────────────────────────────────────

    test.describe('Dismissible', () => {
        test('dismissible alert has a dismiss button', async ({ page }) => {
            await expect(
                card(page, 'Dismissible').getByRole('button', { name: 'Dismiss alert' }),
            ).toBeVisible();
        });

        test('dismiss button is inside the alert element', async ({ page }) => {
            const dismissBtn = card(page, 'Dismissible')
                .locator('bloc-alert[variant="warning"]')
                .getByRole('button', { name: 'Dismiss alert' });
            await expect(dismissBtn).toBeVisible();
        });

        test('clicking the dismiss button hides the alert', async ({ page }) => {
            const dismissibleCard = card(page, 'Dismissible');
            await dismissibleCard.getByRole('button', { name: 'Dismiss alert' }).click();
            await expect(dismissibleCard.locator('bloc-alert')).not.toBeVisible();
        });

        test('shows Restore Alert button after dismissal', async ({ page }) => {
            const dismissibleCard = card(page, 'Dismissible');
            await dismissibleCard.getByRole('button', { name: 'Dismiss alert' }).click();
            await expect(
                dismissibleCard.getByRole('button', { name: 'Restore Alert' }),
            ).toBeVisible();
        });

        test('clicking Restore Alert makes the alert visible again', async ({ page }) => {
            const dismissibleCard = card(page, 'Dismissible');
            await dismissibleCard.getByRole('button', { name: 'Dismiss alert' }).click();
            await dismissibleCard.getByRole('button', { name: 'Restore Alert' }).click();
            await expect(dismissibleCard.locator('bloc-alert[variant="warning"]')).toBeVisible();
        });
    });

    // ── ARIA roles ────────────────────────────────────────────────────────

    test.describe('ARIA roles', () => {
        test('info alert has role="status"', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="info"]'),
            ).toHaveAttribute('role', 'status');
        });

        test('success alert has role="status"', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="success"]'),
            ).toHaveAttribute('role', 'status');
        });

        test('warning alert has role="alert"', async ({ page }) => {
            await expect(
                card(page, 'Dismissible').locator('bloc-alert[variant="warning"]'),
            ).toHaveAttribute('role', 'alert');
        });

        test('danger alert has role="alert"', async ({ page }) => {
            await expect(
                card(page, 'Variants').locator('bloc-alert[variant="danger"]'),
            ).toHaveAttribute('role', 'alert');
        });
    });
});
