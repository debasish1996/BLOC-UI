import { test, expect, Page } from '@playwright/test';
import { navigateTo } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns the visible tooltip panel, if any. */
function tooltipPanel(page: Page) {
    return page.locator('.bloc-tooltip-panel');
}

/** Hovers a button whose visible text matches the given label. */
async function hoverButton(page: Page, label: string) {
    await page.getByRole('button', { name: label }).hover();
}

/** Moves the mouse away from any interactive element. */
async function moveAway(page: Page) {
    await page.mouse.move(0, 0);
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('TooltipDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/tooltip');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page heading', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Tooltip', level: 1 })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            await navigateTo(page, '/tooltip');
            expect(errors).toHaveLength(0);
        });

        test('no tooltip panel is visible on load', async ({ page }) => {
            await expect(tooltipPanel(page)).not.toBeVisible();
        });
    });

    // ── Hover show / hide ─────────────────────────────────────────────────

    test.describe('Hover show/hide', () => {
        test('tooltip appears on hover over "Save" button', async ({ page }) => {
            await hoverButton(page, 'Save');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });
        });

        test('tooltip disappears after mouse leaves "Save" button', async ({ page }) => {
            await hoverButton(page, 'Save');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });

            await moveAway(page);
            await expect(tooltipPanel(page)).not.toBeVisible({ timeout: 1000 });
        });

        test('tooltip shows correct text on hover', async ({ page }) => {
            await hoverButton(page, 'Save');
            await expect(tooltipPanel(page)).toHaveText('Save changes', { timeout: 1000 });
        });
    });

    // ── Positions ─────────────────────────────────────────────────────────

    test.describe('Positions', () => {
        test('tooltip appears for "Top" position button', async ({ page }) => {
            await hoverButton(page, 'Top');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });
            await expect(tooltipPanel(page)).toHaveText('Top tooltip');
        });

        test('tooltip appears for "Bottom" position button', async ({ page }) => {
            await moveAway(page); // ensure no tooltip from previous test
            await hoverButton(page, 'Bottom');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });
            await expect(tooltipPanel(page)).toHaveText('Bottom tooltip');
        });

        test('tooltip appears for "Left" position button', async ({ page }) => {
            await moveAway(page);
            await hoverButton(page, 'Left');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });
            await expect(tooltipPanel(page)).toHaveText('Left tooltip');
        });

        test('tooltip appears for "Right" position button', async ({ page }) => {
            await moveAway(page);
            await hoverButton(page, 'Right');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });
            await expect(tooltipPanel(page)).toHaveText('Right tooltip');
        });
    });

    // ── Disabled ──────────────────────────────────────────────────────────

    test.describe('Disabled tooltip', () => {
        test('tooltip does not appear when tooltipDisabled is true', async ({ page }) => {
            await hoverButton(page, 'Disabled tooltip');
            // Wait longer than default show delay to confirm it never shows
            await page.waitForTimeout(400);
            await expect(tooltipPanel(page)).not.toBeVisible();
        });
    });

    // ── Accessibility ─────────────────────────────────────────────────────

    test.describe('Accessibility', () => {
        test('tooltip panel has role="tooltip"', async ({ page }) => {
            await hoverButton(page, 'Save');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });
            await expect(tooltipPanel(page)).toHaveAttribute('role', 'tooltip');
        });

        test('host button gets aria-describedby when tooltip is shown', async ({ page }) => {
            const saveButton = page.getByRole('button', { name: 'Save' });
            await saveButton.hover();
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });

            const describedById = await saveButton.getAttribute('aria-describedby');
            expect(describedById).toBeTruthy();
            expect(describedById).toMatch(/^bloc-tooltip-\d+$/);
        });

        test('aria-describedby matches the tooltip panel id', async ({ page }) => {
            const saveButton = page.getByRole('button', { name: 'Save' });
            await saveButton.hover();
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });

            const panelId = await tooltipPanel(page).getAttribute('id');
            const describedById = await saveButton.getAttribute('aria-describedby');
            expect(describedById).toBe(panelId);
        });

        test('aria-describedby is removed after tooltip hides', async ({ page }) => {
            const saveButton = page.getByRole('button', { name: 'Save' });
            await saveButton.hover();
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });

            await moveAway(page);
            await expect(tooltipPanel(page)).not.toBeVisible({ timeout: 1000 });

            const describedById = await saveButton.getAttribute('aria-describedby');
            expect(describedById).toBeNull();
        });

        test('tooltip shows on keyboard focus and hides on blur', async ({ page }) => {
            const saveButton = page.getByRole('button', { name: 'Save' });
            await saveButton.focus();
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });

            // Tab away → blur fires on Save button → tooltip hides after hideDelay
            await page.keyboard.press('Tab');
            await expect(tooltipPanel(page)).not.toBeVisible({ timeout: 1000 });
        });

        test('Escape key dismisses visible tooltip (WCAG 1.4.13)', async ({ page }) => {
            await hoverButton(page, 'Save');
            await expect(tooltipPanel(page)).toBeVisible({ timeout: 1000 });

            await page.keyboard.press('Escape');
            await expect(tooltipPanel(page)).not.toBeVisible({ timeout: 500 });
        });

        test('tooltip remains visible when pointer enters the panel', async ({ page }) => {
            await hoverButton(page, 'Save');
            const panel = tooltipPanel(page);
            await expect(panel).toBeVisible({ timeout: 1000 });

            // Move pointer into the panel — panelEnter clears the hide timer
            await panel.hover();

            // Wait longer than hideDelay (100 ms) to confirm the timer was cancelled
            await page.waitForTimeout(300);
            await expect(panel).toBeVisible();
        });
    });
});
