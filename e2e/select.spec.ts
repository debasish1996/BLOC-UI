import { expect, Page, test } from '@playwright/test';
import { collectConsoleErrors, navigateTo } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-gray-900.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('SelectDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/select');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Select', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basic Usage' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Search And States' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/select');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Rendering ─────────────────────────────────────────────────────────

    test.describe('Rendering', () => {
        test('renders bloc-select elements', async ({ page }) => {
            await expect(page.locator('bloc-select').first()).toBeVisible();
        });

        test('shows placeholder text before any selection', async ({ page }) => {
            const simpleCard = card(page, 'Simple Select');
            await expect(simpleCard.locator('bloc-select')).toContainText('Select fruit');
        });

        test('select has combobox role', async ({ page }) => {
            const select = page.locator('bloc-select').first();
            await expect(select).toHaveAttribute('role', 'combobox');
        });

        test('select is closed by default (aria-expanded false)', async ({ page }) => {
            const select = page.locator('bloc-select').first();
            await expect(select).toHaveAttribute('aria-expanded', 'false');
        });
    });

    // ── Open / close ──────────────────────────────────────────────────────

    test.describe('Open / close', () => {
        test('clicking the select opens the dropdown', async ({ page }) => {
            const simpleCard = card(page, 'Simple Select');
            const select = simpleCard.locator('bloc-select');
            await select.click();
            await expect(select).toHaveAttribute('aria-expanded', 'true');
        });

        test('dropdown panel contains the projected options', async ({ page }) => {
            const simpleCard = card(page, 'Simple Select');
            await simpleCard.locator('bloc-select').click();
            const panel = page.locator('.bloc-overlay-container .bloc-select__panel');
            await expect(panel.locator('[role="option"]', { hasText: 'Apple' })).toBeVisible();
            await expect(panel.locator('[role="option"]', { hasText: 'Banana' })).toBeVisible();
            await expect(panel.locator('[role="option"]', { hasText: 'Orange' })).toBeVisible();
        });

        test('pressing Escape closes the dropdown', async ({ page }) => {
            const simpleCard = card(page, 'Simple Select');
            const select = simpleCard.locator('bloc-select');
            await select.click();
            await expect(select).toHaveAttribute('aria-expanded', 'true');
            await page.keyboard.press('Escape');
            await expect(select).toHaveAttribute('aria-expanded', 'false');
        });
    });

    // ── Selection ─────────────────────────────────────────────────────────

    test.describe('Selection', () => {
        test('clicking an option selects it and closes the panel', async ({ page }) => {
            const simpleCard = card(page, 'Simple Select');
            const select = simpleCard.locator('bloc-select');
            await select.click();
            const panel = page.locator('.bloc-overlay-container .bloc-select__panel');
            await panel.locator('[role="option"]', { hasText: 'Banana' }).click();
            await expect(select).toHaveAttribute('aria-expanded', 'false');
            await expect(select).toContainText('Banana');
        });

        test('reactive FormControl card reflects selected value below select', async ({ page }) => {
            const reactiveCard = card(page, 'Reactive FormControl');
            await reactiveCard.locator('bloc-select').click();
            const panel = page.locator('.bloc-overlay-container .bloc-select__panel');
            await panel.locator('[role="option"]', { hasText: 'Apple' }).click();
            await expect(reactiveCard.locator('strong')).toContainText('apple');
        });
    });

    // ── States ────────────────────────────────────────────────────────────

    test.describe('States', () => {
        test('disabled select cannot be opened', async ({ page }) => {
            const disabledCard = card(page, 'Disabled');
            const select = disabledCard.locator('bloc-select');
            await expect(select).toHaveAttribute('aria-disabled', 'true');
            await select.click({ force: true });
            await expect(select).toHaveAttribute('aria-expanded', 'false');
        });

        test('searchable select shows a search input when opened', async ({ page }) => {
            const searchCard = card(page, 'Search + Clear');
            await searchCard.locator('bloc-select').click();
            const panel = page.locator('.bloc-overlay-container .bloc-select__panel');
            await expect(panel.locator('.bloc-select__search-input')).toBeVisible();
        });

        test('typing in search input filters options', async ({ page }) => {
            const searchCard = card(page, 'Search + Clear');
            await searchCard.locator('bloc-select').click();
            const panel = page.locator('.bloc-overlay-container .bloc-select__panel');
            await panel.locator('.bloc-select__search-input').fill('ban');
            await expect(
                panel.locator('[role="option"]:not([hidden])', { hasText: 'Banana' }),
            ).toBeVisible();
        });
    });
});
