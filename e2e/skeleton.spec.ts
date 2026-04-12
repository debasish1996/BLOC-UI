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

test.describe('SkeletonDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/skeleton');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Skeleton', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Patterns' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Animation' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Theming' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/skeleton');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Skeleton elements ─────────────────────────────────────────────────

    test.describe('Skeleton elements', () => {
        test('renders blocSkeleton directive elements', async ({ page }) => {
            await expect(card(page, 'Text lines').locator('.bloc-skeleton').first()).toBeVisible();
        });

        test('skeleton elements have the animated class by default', async ({ page }) => {
            const skeleton = card(page, 'Text lines').locator('.bloc-skeleton').first();
            await expect(skeleton).toHaveClass(/bloc-skeleton--animated/);
        });

        test('static placeholder skeleton does not have animated class', async ({ page }) => {
            const skeleton = card(page, 'Static placeholder').locator('.bloc-skeleton').first();
            await expect(skeleton).not.toHaveClass(/bloc-skeleton--animated/);
        });

        test('circle-shaped skeleton renders', async ({ page }) => {
            await expect(
                card(page, 'Common shapes').locator('.bloc-skeleton.bloc-skeleton--circle').first(),
            ).toBeVisible();
        });
    });
});
