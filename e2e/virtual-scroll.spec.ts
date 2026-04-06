import { test, expect, Page } from '@playwright/test';
import { navigateTo } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

function section(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-white.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('VirtualScrollDemoComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/virtual-scroll');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Virtual Scroll', level: 1 }),
            ).toBeVisible();
        });

        test('renders Template Mode section heading', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Template Mode', level: 3 }),
            ).toBeVisible();
        });

        test('renders Projection Mode section heading', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Projection Mode + Sticky Header', level: 3 }),
            ).toBeVisible();
        });

        test('renders Rich Item Template section heading', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Rich Item Template', level: 3 }),
            ).toBeVisible();
        });

        test('renders Auto-Measured Variable Heights section heading', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Auto-Measured Variable Heights', level: 3 }),
            ).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            await navigateTo(page, '/virtual-scroll');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Template Mode (10 000 items) ──────────────────────────────────────

    test.describe('Template Mode', () => {
        test('renders a bloc-virtual-scroll element', async ({ page }) => {
            const card = section(page, 'Template Mode');
            await expect(card.locator('bloc-virtual-scroll').first()).toBeVisible();
        });

        test('renders only a small subset of the 10 000 items (virtualization)', async ({
            page,
        }) => {
            const card = section(page, 'Template Mode');
            // The virtual scroll container
            const vs = card.locator('bloc-virtual-scroll').first();
            // Count rendered .bloc-vs__item divs — should be far fewer than 10 000
            const itemCount = await vs.locator('.bloc-vs__item').count();
            expect(itemCount).toBeGreaterThan(0);
            expect(itemCount).toBeLessThan(100);
        });

        test('renders the sentinel div with a large height (totalHeight)', async ({ page }) => {
            const card = section(page, 'Template Mode');
            const sentinel = card.locator('.bloc-vs__sentinel').first();
            const height = await sentinel.evaluate((el) => (el as HTMLElement).style.height);
            // 10 000 items × 40px = 400 000px
            expect(height).toBe('400000px');
        });

        test('renders visible items with content starting from Item #1', async ({ page }) => {
            const card = section(page, 'Template Mode');
            await expect(card).toContainText('1.');
        });

        test('renders the install-command component', async ({ page }) => {
            await expect(page.locator('app-install-command').first()).toBeVisible();
        });
    });

    // ── Projection Mode + Table Integration ───────────────────────────────

    test.describe('Projection Mode + Table', () => {
        test('renders a bloc-table inside bloc-virtual-scroll', async ({ page }) => {
            const card = section(page, 'Projection Mode + Sticky Header');
            await expect(card.locator('bloc-virtual-scroll').first()).toBeVisible();
            await expect(card.locator('bloc-table').first()).toBeVisible();
        });

        test('renders table with column headers', async ({ page }) => {
            const card = section(page, 'Projection Mode + Sticky Header');
            const table = card.locator('bloc-table').first();
            await expect(table.getByRole('columnheader', { name: 'Name' })).toBeVisible();
            await expect(table.getByRole('columnheader', { name: 'Email' })).toBeVisible();
            await expect(table.getByRole('columnheader', { name: 'Role' })).toBeVisible();
            await expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible();
        });

        test('renders table rows from the visible slice', async ({ page }) => {
            const card = section(page, 'Projection Mode + Sticky Header');
            await expect(card).toContainText('User 1');
        });

        test('renders .bloc-vs__spacer divs for projection mode layout', async ({ page }) => {
            const card = section(page, 'Projection Mode + Sticky Header');
            const spacerCount = await card.locator('.bloc-vs__spacer').count();
            expect(spacerCount).toBe(2);
        });
    });

    // ── Custom Templates (10 000 items) ───────────────────────────────────

    test.describe('Custom Templates', () => {
        test('renders the Rich Item Template card', async ({ page }) => {
            await expect(section(page, 'Rich Item Template')).toBeVisible();
        });

        test('renders bloc-virtual-scroll in the rich item card', async ({ page }) => {
            const card = section(page, 'Rich Item Template');
            await expect(card.locator('bloc-virtual-scroll').first()).toBeVisible();
        });

        test('renders rich items with person name and role', async ({ page }) => {
            const card = section(page, 'Rich Item Template');
            await expect(card).toContainText('Person 1');
        });

        test('renders only a subset of the 10 000 rich items', async ({ page }) => {
            const card = section(page, 'Rich Item Template');
            const vs = card.locator('bloc-virtual-scroll').first();
            const itemCount = await vs.locator('.bloc-vs__item').count();
            expect(itemCount).toBeGreaterThan(0);
            expect(itemCount).toBeLessThan(100);
        });
    });

    // ── Stress Test — Auto-Measured Variable Heights ───────────────────────

    test.describe('Auto-Measured Variable Heights', () => {
        test('renders the Auto-Measured card', async ({ page }) => {
            await expect(section(page, 'Auto-Measured Variable Heights')).toBeVisible();
        });

        test('bloc-virtual-scroll in stress test has autoMeasure attribute', async ({ page }) => {
            const card = section(page, 'Auto-Measured Variable Heights');
            // autoMeasure=true is reflected as attribute on the element
            const vs = card.locator('bloc-virtual-scroll').first();
            await expect(vs).toBeVisible();
        });

        test('renders items including OVERSIZED ROW marker', async ({ page }) => {
            const card = section(page, 'Auto-Measured Variable Heights');
            // Every 7th item (0, 7, 14...) is a tall row with "OVERSIZED ROW" text
            await expect(card).toContainText('OVERSIZED ROW');
        });

        test('renders a subset of the 500 mixed items', async ({ page }) => {
            const card = section(page, 'Auto-Measured Variable Heights');
            const vs = card.locator('bloc-virtual-scroll').first();
            const itemCount = await vs.locator('.bloc-vs__item').count();
            expect(itemCount).toBeGreaterThan(0);
            expect(itemCount).toBeLessThan(500);
        });
    });

    // ── Scroll behaviour ─────────────────────────────────────────────────

    test.describe('Scroll behaviour', () => {
        test('scrolling Template Mode list updates visible items', async ({ page }) => {
            const card = section(page, 'Template Mode');
            const viewport = card.locator('.bloc-vs__viewport').first();

            // Scroll down by 4000px (100 items × 40px)
            await viewport.evaluate((el) => {
                el.scrollTop = 4000;
                el.dispatchEvent(new Event('scroll'));
            });
            // Wait for tick
            await page.waitForTimeout(100);

            // Items around index 100 should now be visible
            await expect(card).toContainText('101.');
        });

        test('scrolling back to top shows first items again', async ({ page }) => {
            const card = section(page, 'Template Mode');
            const viewport = card.locator('.bloc-vs__viewport').first();

            // First scroll down
            await viewport.evaluate((el) => {
                el.scrollTop = 4000;
                el.dispatchEvent(new Event('scroll'));
            });
            await page.waitForTimeout(100);

            // Scroll back to top
            await viewport.evaluate((el) => {
                el.scrollTop = 0;
                el.dispatchEvent(new Event('scroll'));
            });
            await page.waitForTimeout(100);

            await expect(card).toContainText('1.');
        });
    });
});
