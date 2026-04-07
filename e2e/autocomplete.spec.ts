import { test, expect, Page } from '@playwright/test';
import { navigateTo } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Scopes assertions to the card whose h3 heading matches the given text. */
function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-white.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

/** Returns the bloc-autocomplete input inside a card. */
function autocompleteInput(page: Page, heading: string) {
    return card(page, heading).locator('.bloc-autocomplete__input');
}

/**
 * Returns the overlay panel for the autocomplete in a given card.
 * The panel is teleported to the global overlay container (body) by
 * OverlayService, so it is no longer a descendant of the card.
 * We resolve it via the input's `aria-controls` attribute.
 */
async function panelForCard(page: Page, heading: string) {
    const panelId = await autocompleteInput(page, heading).getAttribute('aria-controls');
    return page.locator(`#${panelId}`);
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('AutocompleteDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/autocomplete');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Autocomplete', level: 1 }),
            ).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Basic Usage', level: 2 }),
            ).toBeVisible();
            await expect(page.getByRole('heading', { name: 'States', level: 2 })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Theming', level: 2 })).toBeVisible();
        });

        test('renders card headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Quick Pick', level: 3 })).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Reactive FormControl', level: 3 }),
            ).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Disabled', level: 3 })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Loading', level: 3 })).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Custom Token', level: 3 }),
            ).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            await navigateTo(page, '/autocomplete');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Quick Pick ────────────────────────────────────────────────────────

    test.describe('Quick Pick', () => {
        test('input is visible and empty on load', async ({ page }) => {
            const inp = autocompleteInput(page, 'Quick Pick');
            await expect(inp).toBeVisible();
            await expect(inp).toHaveValue('');
        });

        test('opens option panel on focus', async ({ page }) => {
            const inp = autocompleteInput(page, 'Quick Pick');
            await inp.click();
            const panel = await panelForCard(page, 'Quick Pick');
            await expect(panel).toBeVisible();
        });

        test('shows options with descriptions', async ({ page }) => {
            await autocompleteInput(page, 'Quick Pick').click();
            const panel = await panelForCard(page, 'Quick Pick');
            await expect(panel).toBeVisible();
            await expect(panel.locator('.bloc-autocomplete__option').first()).toContainText(
                'Design',
            );
        });

        test('filters options by typed query', async ({ page }) => {
            const inp = autocompleteInput(page, 'Quick Pick');
            await inp.click();
            await inp.fill('eng');
            const panel = await panelForCard(page, 'Quick Pick');
            await expect(panel.locator('.bloc-autocomplete__option')).toHaveCount(1);
            await expect(panel.locator('.bloc-autocomplete__option')).toContainText('Engineering');
        });

        test('shows no-results state when query matches nothing', async ({ page }) => {
            const inp = autocompleteInput(page, 'Quick Pick');
            await inp.click();
            await inp.fill('zzz');
            const panel = await panelForCard(page, 'Quick Pick');
            await expect(panel.locator('.bloc-autocomplete__state')).toContainText(
                'No results found',
            );
        });

        test('selects option on click and reflects value', async ({ page }) => {
            const c = card(page, 'Quick Pick');
            await autocompleteInput(page, 'Quick Pick').click();
            const panel = await panelForCard(page, 'Quick Pick');
            await panel.locator('.bloc-autocomplete__option', { hasText: 'Growth' }).click();
            await expect(c.locator('strong')).toContainText('growth');
        });

        test('shows clear button after selection', async ({ page }) => {
            const c = card(page, 'Quick Pick');
            await autocompleteInput(page, 'Quick Pick').click();
            const panel = await panelForCard(page, 'Quick Pick');
            await panel.locator('.bloc-autocomplete__option', { hasText: 'Growth' }).click();
            await expect(c.locator('.bloc-autocomplete__clear')).toBeVisible();
        });

        test('clears selection when × is clicked', async ({ page }) => {
            const c = card(page, 'Quick Pick');
            await autocompleteInput(page, 'Quick Pick').click();
            const panel = await panelForCard(page, 'Quick Pick');
            await panel.locator('.bloc-autocomplete__option', { hasText: 'Growth' }).click();
            await c.locator('.bloc-autocomplete__clear').click();
            await expect(c.locator('strong')).toContainText('(none)');
        });

        test('closes panel on Escape', async ({ page }) => {
            const inp = autocompleteInput(page, 'Quick Pick');
            await inp.click();
            const panel = await panelForCard(page, 'Quick Pick');
            await expect(panel).toBeVisible();
            await inp.press('Escape');
            await expect(panel).not.toBeVisible();
        });

        test('navigates options with keyboard and selects on Enter', async ({ page }) => {
            const inp = autocompleteInput(page, 'Quick Pick');
            await inp.click();
            // Panel opens with active index 0 (Design); one ArrowDown moves to index 1 (Engineering)
            await inp.press('ArrowDown');
            await inp.press('Enter');
            const c = card(page, 'Quick Pick');
            await expect(c.locator('strong')).toContainText('engineering');
        });
    });

    // ── Reactive FormControl ──────────────────────────────────────────────

    test.describe('Reactive FormControl', () => {
        test('input shows initial value from FormControl', async ({ page }) => {
            const inp = autocompleteInput(page, 'Reactive FormControl');
            // FormControl initialised with 'design'
            await expect(inp).toHaveValue('Design');
        });

        test('form value reflects new selection', async ({ page }) => {
            const c = card(page, 'Reactive FormControl');
            const inp = autocompleteInput(page, 'Reactive FormControl');
            await inp.click();
            // Clear the pre-filled "Design" query so all options are visible
            await inp.fill('');
            const panel = await panelForCard(page, 'Reactive FormControl');
            await panel.locator('.bloc-autocomplete__option', { hasText: 'Engineering' }).click();
            await expect(c.locator('strong')).toContainText('engineering');
        });
    });

    // ── Disabled ──────────────────────────────────────────────────────────

    test.describe('Disabled', () => {
        test('input is visible but disabled', async ({ page }) => {
            const inp = autocompleteInput(page, 'Disabled');
            await expect(inp).toBeDisabled();
        });

        test('panel does not open when control is disabled', async ({ page }) => {
            await autocompleteInput(page, 'Disabled').click({ force: true });
            await expect(
                card(page, 'Disabled').locator('.bloc-autocomplete__panel'),
            ).not.toBeVisible();
        });
    });

    // ── Loading ───────────────────────────────────────────────────────────

    test.describe('Loading', () => {
        test('panel shows options by default (loading=false)', async ({ page }) => {
            await autocompleteInput(page, 'Loading').click();
            const panel = await panelForCard(page, 'Loading');
            await expect(panel.locator('.bloc-autocomplete__option').first()).toBeVisible();
        });

        test('shows loading message when Toggle Loading is clicked', async ({ page }) => {
            await card(page, 'Loading').getByRole('button', { name: 'Toggle Loading' }).click();
            await autocompleteInput(page, 'Loading').click();
            const panel = await panelForCard(page, 'Loading');
            await expect(panel.locator('.bloc-autocomplete__state')).toContainText(
                'Loading options...',
            );
        });

        test('restores options when loading is toggled off again', async ({ page }) => {
            const toggleBtn = card(page, 'Loading').getByRole('button', {
                name: 'Toggle Loading',
            });
            await toggleBtn.click(); // on
            await toggleBtn.click(); // off
            await autocompleteInput(page, 'Loading').click();
            const panel = await panelForCard(page, 'Loading');
            await expect(panel.locator('.bloc-autocomplete__option').first()).toBeVisible();
        });
    });
});
