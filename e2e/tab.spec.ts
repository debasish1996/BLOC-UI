import { test, expect, Page } from '@playwright/test';
import { navigateTo, collectConsoleErrors } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-gray-900.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('TabDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/tab');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Tab', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basic usage' })).toBeVisible();
            // Use level 3 to disambiguate card heading from section heading
            await expect(
                page.getByRole('heading', { name: 'One disabled tab', level: 3 }),
            ).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Programmatic selection' }),
            ).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/tab');
            expect(errors).toHaveLength(0);
        });
    });

    // ── ARIA ─────────────────────────────────────────────────────────────

    test.describe('ARIA', () => {
        test('tab group has role="tablist"', async ({ page }) => {
            await expect(card(page, 'Default').getByRole('tablist').first()).toBeVisible();
        });

        test('tab buttons have role="tab"', async ({ page }) => {
            await expect(card(page, 'Default').getByRole('tab', { name: 'Profile' })).toBeVisible();
        });
    });

    // ── Basic usage ───────────────────────────────────────────────────────

    test.describe('Basic usage', () => {
        test('Profile tab panel is active by default', async ({ page }) => {
            const demoTabs = card(page, 'Default').locator('bloc-tab-group').first();
            await expect(demoTabs.getByRole('tabpanel')).toBeVisible();
        });

        test('clicking Settings tab shows Settings panel', async ({ page }) => {
            const defaultCard = card(page, 'Default');
            const demoTabs = defaultCard.locator('bloc-tab-group').first();
            await demoTabs.getByRole('tab', { name: 'Settings' }).click();
            await expect(demoTabs.getByRole('tabpanel')).toBeVisible();
        });

        test('clicking Billing tab switches active panel', async ({ page }) => {
            const defaultCard = card(page, 'Default');
            const demoTabs = defaultCard.locator('bloc-tab-group').first();
            await demoTabs.getByRole('tab', { name: 'Billing' }).click();
            await expect(demoTabs.getByRole('tabpanel')).toBeVisible();
        });
    });

    // ── Disabled tab ──────────────────────────────────────────────────────

    test.describe('Disabled tab', () => {
        test('disabled tab button has disabled attribute', async ({ page }) => {
            await expect(
                card(page, 'One disabled tab').getByRole('tab', { name: 'Disabled' }),
            ).toBeDisabled();
        });
    });

    // ── Programmatic selection ────────────────────────────────────────────

    test.describe('Programmatic selection', () => {
        test('clicking Second tab updates "Current index:" display', async ({ page }) => {
            const progCard = card(page, 'selectedIndex binding');
            await progCard.getByRole('tab', { name: 'Second' }).click();
            await expect(progCard).toContainText('Current index: 1');
        });

        test('clicking Third tab updates "Current index:" display', async ({ page }) => {
            const progCard = card(page, 'selectedIndex binding');
            await progCard.getByRole('tab', { name: 'Third' }).click();
            await expect(progCard).toContainText('Current index: 2');
        });
    });
});
