import { test, expect, Page } from '@playwright/test';
import { navigateTo } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-white.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('ModalDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/modal');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Modal', level: 1 })).toBeVisible();
        });

        test('renders section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Sizes' })).toBeVisible();
            // Use level-3 to disambiguate card headings from section headings
            await expect(
                page.getByRole('heading', { name: 'Default (md)', level: 3 }),
            ).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Data passing' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            await navigateTo(page, '/modal');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Default modal ─────────────────────────────────────────────────────

    test.describe('Default modal', () => {
        test('clicking "Open Modal" shows a dialog', async ({ page }) => {
            await card(page, 'Default (md)').getByRole('button', { name: 'Open Modal' }).click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('dialog has aria-modal="true"', async ({ page }) => {
            await card(page, 'Default (md)').getByRole('button', { name: 'Open Modal' }).click();
            await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
        });

        test('close button dismisses the dialog', async ({ page }) => {
            await card(page, 'Default (md)').getByRole('button', { name: 'Open Modal' }).click();
            await page.getByRole('button', { name: 'Close modal' }).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });
    });

    // ── Sizes ─────────────────────────────────────────────────────────────

    test.describe('Sizes', () => {
        test('small modal opens on "Open Small Modal"', async ({ page }) => {
            await card(page, 'Small').getByRole('button', { name: 'Open Small Modal' }).click();
            const dialog = page.getByRole('dialog');
            await expect(dialog).toBeVisible();
            await expect(dialog).toHaveClass(/bloc-modal--sm/);
        });

        test('large modal opens on "Open Large Modal"', async ({ page }) => {
            await card(page, 'Large').getByRole('button', { name: 'Open Large Modal' }).click();
            const dialog = page.getByRole('dialog');
            await expect(dialog).toBeVisible();
            await expect(dialog).toHaveClass(/bloc-modal--lg/);
        });
    });

    // ── Close button visibility ───────────────────────────────────────────

    test.describe('Close button', () => {
        test('hidden close button: no close button rendered in dialog', async ({ page }) => {
            await card(page, 'Hidden close button')
                .getByRole('button', { name: 'Open Modal' })
                .click();
            await expect(page.getByRole('button', { name: 'Close modal' })).not.toBeVisible();
        });
    });

    // ── Data passing ──────────────────────────────────────────────────────

    test.describe('Data passing', () => {
        test('injected data modal opens on "Open with Data"', async ({ page }) => {
            await card(page, 'Inject data').getByRole('button', { name: 'Open with Data' }).click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });
    });
});
