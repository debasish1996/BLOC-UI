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

test.describe('SliderDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/slider');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Slider', level: 1 })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/slider');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Rendering ─────────────────────────────────────────────────────────

    test.describe('Rendering', () => {
        test('renders bloc-slider elements', async ({ page }) => {
            await expect(page.locator('bloc-slider').first()).toBeVisible();
        });

        test('renders range input inside each slider', async ({ page }) => {
            const sliderInput = page.locator('bloc-slider input[type="range"]').first();
            await expect(sliderInput).toBeVisible();
        });

        test('renders label in the Reactive Forms card', async ({ page }) => {
            const reactiveCard = card(page, 'Reactive Forms');
            const label = reactiveCard.locator('.bloc-slider__label');
            await expect(label).toBeVisible();
            await expect(label).toHaveText('Volume');
        });

        test('renders current value display in the Reactive Forms card', async ({ page }) => {
            const reactiveCard = card(page, 'Reactive Forms');
            const valueSpan = reactiveCard.locator('.bloc-slider__value');
            await expect(valueSpan).toBeVisible();
        });

        test('renders Custom Range card with a slider', async ({ page }) => {
            const customCard = card(page, 'Custom Range');
            const slider = customCard.locator('bloc-slider input[type="range"]');
            await expect(slider).toBeVisible();
        });
    });

    // ── Interaction ───────────────────────────────────────────────────────

    test.describe('Interaction', () => {
        test('current value display updates when the reactive form control value changes', async ({
            page,
        }) => {
            const reactiveCard = card(page, 'Reactive Forms');
            const slider = reactiveCard.locator('bloc-slider input[type="range"]');
            const valueParagraph = reactiveCard.locator('p').filter({ hasText: 'Current value' });

            // Read the initial value shown in the UI
            const initialText = await valueParagraph.textContent();

            // Move the slider to a different value (fill moves it to 0%)
            await slider.fill('20');

            // The displayed value text should have changed (we just verify it updated at all)
            const updatedText = await valueParagraph.textContent();
            expect(updatedText).not.toBe(initialText);
        });

        test('Custom Range slider enforces min/max attributes', async ({ page }) => {
            const customCard = card(page, 'Custom Range');
            const slider = customCard.locator('bloc-slider input[type="range"]');
            const min = await slider.getAttribute('min');
            const max = await slider.getAttribute('max');
            expect(Number(min)).toBeGreaterThanOrEqual(0);
            expect(Number(max)).toBeGreaterThan(Number(min));
        });
    });
});
