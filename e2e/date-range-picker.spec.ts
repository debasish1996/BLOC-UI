import { test, expect, Page } from '@playwright/test';
import { navigateTo, collectConsoleErrors } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Card scoped to an h3 heading with exact text (anchored regex prevents substring match). */
function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-white.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

/** All enabled, current-month day buttons inside the open calendar. */
function enabledCurrentMonthDays(page: Page) {
    return page
        .getByRole('dialog')
        .locator('.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)');
}

/** First enabled current-month day. */
function firstEnabledDay(page: Page) {
    return enabledCurrentMonthDays(page).first();
}

/** Last enabled current-month day. */
function lastEnabledDay(page: Page) {
    return enabledCurrentMonthDays(page).last();
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('DateRangePickerComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/date-range-picker');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Date Range Picker', level: 1 }),
            ).toBeVisible();
        });

        test('renders all section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basic range' })).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Template-driven (ngModel)' }),
            ).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Reactive forms' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Min / Max date' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Custom token' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/date-range-picker');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Default (basic) trigger ───────────────────────────────────────────

    test.describe('Default trigger', () => {
        test('shows "Pick a range" placeholder text', async ({ page }) => {
            await expect(
                card(page, 'Default').locator('[blocDateRangePickerTrigger]'),
            ).toContainText('Pick a range');
        });

        test('trigger has aria-haspopup="dialog"', async ({ page }) => {
            await expect(
                card(page, 'Default').locator('[blocDateRangePickerTrigger]'),
            ).toHaveAttribute('aria-haspopup', 'dialog');
        });

        test('trigger has aria-expanded="false" initially', async ({ page }) => {
            await expect(
                card(page, 'Default').locator('[blocDateRangePickerTrigger]'),
            ).toHaveAttribute('aria-expanded', 'false');
        });

        test('opens calendar on click', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('calendar dialog is labelled "Date range picker"', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await expect(page.getByRole('dialog', { name: 'Date range picker' })).toBeVisible();
        });

        test('aria-expanded becomes "true" when open', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        });

        test('closes calendar on Escape key', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('closes calendar when clicking outside', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await page.getByRole('heading', { name: 'Date Range Picker', level: 1 }).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('clicking the trigger again toggles the calendar closed', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await trigger.click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });
    });

    // ── Calendar panel structure (range mode) ─────────────────────────────

    test.describe('Calendar panel structure', () => {
        test.beforeEach(async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('shows month/year label button in header', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-myb')).toBeVisible();
        });

        test('shows Previous month and Next month navigation buttons', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            await expect(dialog.getByRole('button', { name: 'Previous month' })).toBeVisible();
            await expect(dialog.getByRole('button', { name: 'Next month' })).toBeVisible();
        });

        test('shows all 7 weekday column headers', async ({ page }) => {
            const wds = page.getByRole('dialog').locator('.bloc-dp-wds');
            for (const day of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) {
                await expect(wds.getByText(day, { exact: true })).toBeVisible();
            }
        });

        test('renders exactly 42 day cells', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-days .bloc-dp-d')).toHaveCount(
                42,
            );
        });

        test('shows Today button in footer', async ({ page }) => {
            await expect(
                page.getByRole('dialog').getByRole('button', { name: 'Today' }),
            ).toBeVisible();
        });

        test('does not show Clear button when no range is selected', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-cbtn')).not.toBeVisible();
        });
    });

    // ── Two-step range selection ──────────────────────────────────────────

    test.describe('Two-step range selection', () => {
        test('calendar stays open after selecting the first date', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            // Calendar must remain open while waiting for the second date
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('first selected date gets range-start CSS class', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            const firstDay = firstEnabledDay(page);
            const text = await firstDay.textContent();
            await firstDay.click();
            // After first pick, the day should carry range-start class
            await expect(
                page
                    .getByRole('dialog')
                    .locator('.bloc-dp-days .bloc-dp-d--rs:not(.bloc-dp-d--oth)'),
            ).toContainText(text!.trim());
        });

        test('calendar closes after selecting the second date', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click(); // first pick — stays open
            await lastEnabledDay(page).click(); // second pick — closes
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('trigger text shows a range with "→" separator after both dates are picked', async ({
            page,
        }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(trigger).toContainText('→');
            await expect(trigger).not.toContainText('Pick a range');
        });
    });

    // ── Auto-sort ─────────────────────────────────────────────────────────

    test.describe('Range auto-sort', () => {
        test('picking a later date first, then an earlier date, produces a sorted range', async ({
            page,
        }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            // Click the last available current-month day first (the "later" date)
            await lastEnabledDay(page).click();
            // Then click the first available current-month day (the "earlier" date)
            await firstEnabledDay(page).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();

            // Reopen to inspect range-start / range-end CSS classes
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            const dialog = page.getByRole('dialog');

            const startDay = dialog.locator('.bloc-dp-days .bloc-dp-d--rs:not(.bloc-dp-d--oth)');
            const endDay = dialog.locator('.bloc-dp-days .bloc-dp-d--re:not(.bloc-dp-d--oth)');

            await expect(startDay).toBeVisible();
            await expect(endDay).toBeVisible();

            // Start day number must be less than end day number (sorted range)
            const startText = parseInt((await startDay.textContent())!.trim(), 10);
            const endText = parseInt((await endDay.textContent())!.trim(), 10);
            expect(startText).toBeLessThan(endText);
        });

        test('picking an earlier date first, then a later date, also produces a sorted range', async ({
            page,
        }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click(); // earlier date first
            await lastEnabledDay(page).click(); // later date second
            await expect(page.getByRole('dialog')).not.toBeVisible();

            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            const dialog = page.getByRole('dialog');

            const startText = parseInt(
                (await dialog
                    .locator('.bloc-dp-days .bloc-dp-d--rs:not(.bloc-dp-d--oth)')
                    .textContent())!.trim(),
                10,
            );
            const endText = parseInt(
                (await dialog
                    .locator('.bloc-dp-days .bloc-dp-d--re:not(.bloc-dp-d--oth)')
                    .textContent())!.trim(),
                10,
            );
            expect(startText).toBeLessThan(endText);
        });
    });

    // ── Range highlighting ────────────────────────────────────────────────

    test.describe('Range highlighting', () => {
        test.beforeEach(async ({ page }) => {
            // Select a range spanning at least 3 days using the Default card
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            // Reopen to inspect classes
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
        });

        test('range-start cell has bloc-dp-d--rs class', async ({ page }) => {
            await expect(
                page
                    .getByRole('dialog')
                    .locator('.bloc-dp-days .bloc-dp-d--rs:not(.bloc-dp-d--oth)'),
            ).toBeVisible();
        });

        test('range-end cell has bloc-dp-d--re class', async ({ page }) => {
            await expect(
                page
                    .getByRole('dialog')
                    .locator('.bloc-dp-days .bloc-dp-d--re:not(.bloc-dp-d--oth)'),
            ).toBeVisible();
        });

        test('in-range cells have bloc-dp-d--ir class', async ({ page }) => {
            // Only meaningful if range spans >2 days; March has 31 days so first→last is large
            const inRangeCells = page
                .getByRole('dialog')
                .locator('.bloc-dp-days .bloc-dp-d--ir:not(.bloc-dp-d--oth)');
            await expect(inRangeCells.first()).toBeVisible();
        });
    });

    // ── Clear button ──────────────────────────────────────────────────────

    test.describe('Clear button', () => {
        test('Clear button appears after a range is selected', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click(); // reopen
            await expect(page.getByRole('dialog').locator('.bloc-dp-cbtn')).toBeVisible();
        });

        test('clicking Clear removes the range (calendar stays open)', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await trigger.click(); // reopen
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-cbtn').click();

            // Calendar stays open, no range-start or range-end classes
            await expect(dialog).toBeVisible();
            await expect(dialog.locator('.bloc-dp-days .bloc-dp-d--rs')).not.toBeVisible();
        });

        test('Clear button disappears after clicking it', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await trigger.click();
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-cbtn').click();
            await expect(dialog.locator('.bloc-dp-cbtn')).not.toBeVisible();
        });

        test('trigger returns to "Pick a range" placeholder after clearing', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await trigger.click();
            await page.getByRole('dialog').locator('.bloc-dp-cbtn').click();
            await page.keyboard.press('Escape'); // close the still-open dialog
            await expect(trigger).toContainText('Pick a range');
        });
    });

    // ── Today button in range mode ────────────────────────────────────────

    test.describe('Today button (range mode)', () => {
        test('clicking Today as first pick keeps the calendar open', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await page.getByRole('dialog').getByRole('button', { name: 'Today' }).click();
            // Calendar stays open waiting for second pick
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('clicking Today as second pick closes the calendar', async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click(); // first pick
            await page.getByRole('dialog').getByRole('button', { name: 'Today' }).click(); // second
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('using Today produces a valid range on the trigger', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await page.getByRole('dialog').getByRole('button', { name: 'Today' }).click();
            await expect(trigger).not.toContainText('Pick a range');
        });
    });

    // ── ngModel binding ───────────────────────────────────────────────────

    test.describe('ngModel (Two-way binding)', () => {
        test('shows "Pick a range" placeholder initially', async ({ page }) => {
            await expect(
                card(page, 'Two-way binding').locator('[blocDateRangePickerTrigger]'),
            ).toContainText('Pick a range');
        });

        test('selecting a range updates the "from:" value display', async ({ page }) => {
            await card(page, 'Two-way binding').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(
                card(page, 'Two-way binding').locator('p').filter({ hasText: 'from:' }),
            ).not.toContainText('null');
        });

        test('selecting a range updates the "to:" value display', async ({ page }) => {
            await card(page, 'Two-way binding').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(
                card(page, 'Two-way binding').locator('p').filter({ hasText: 'to:' }),
            ).not.toContainText('null');
        });

        test('trigger text updates to show the selected range', async ({ page }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(trigger).toContainText('→');
        });
    });

    // ── FormControl binding ───────────────────────────────────────────────

    test.describe('FormControl binding', () => {
        test('shows "Select range" placeholder initially', async ({ page }) => {
            await expect(
                card(page, 'FormControl').locator('[blocDateRangePickerTrigger]'),
            ).toContainText('Select range');
        });

        test('selecting a range updates the "from:" value display', async ({ page }) => {
            await card(page, 'FormControl').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(
                card(page, 'FormControl').locator('p').filter({ hasText: 'from:' }),
            ).not.toContainText('null');
        });

        test('selecting a range updates the "to:" value display', async ({ page }) => {
            await card(page, 'FormControl').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(
                card(page, 'FormControl').locator('p').filter({ hasText: 'to:' }),
            ).not.toContainText('null');
        });
    });

    // ── FormGroup binding ─────────────────────────────────────────────────

    test.describe('FormGroup binding', () => {
        test('shows "Select range" placeholder initially', async ({ page }) => {
            await expect(
                card(page, 'FormGroup').locator('[blocDateRangePickerTrigger]'),
            ).toContainText('Select range');
        });

        test('selecting a range updates the "from control:" value', async ({ page }) => {
            await card(page, 'FormGroup').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(
                card(page, 'FormGroup').locator('p').filter({ hasText: 'from control:' }),
            ).not.toContainText('null');
        });

        test('selecting a range updates the "to control:" value', async ({ page }) => {
            await card(page, 'FormGroup').locator('[blocDateRangePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(
                card(page, 'FormGroup').locator('p').filter({ hasText: 'to control:' }),
            ).not.toContainText('null');
        });

        test('trigger text reflects selected range', async ({ page }) => {
            const trigger = card(page, 'FormGroup').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(trigger).toContainText('→');
        });
    });

    // ── Min / Max date ────────────────────────────────────────────────────

    test.describe('Min / Max date constraint', () => {
        test('shows "Pick a range" placeholder initially', async ({ page }) => {
            await expect(
                card(page, 'Constrained range').locator('[blocDateRangePickerTrigger]'),
            ).toContainText('Pick a range');
        });

        test('dates in a month beyond maxDate are all disabled', async ({ page }) => {
            await card(page, 'Constrained range').locator('[blocDateRangePickerTrigger]').click();
            const dialog = page.getByRole('dialog');

            // Navigate to January 2027 (beyond max Dec 2026)
            await dialog.locator('.bloc-dp-myb').click(); // month view
            await dialog.locator('.bloc-dp-myb').click(); // year view
            await dialog.getByText('2027', { exact: true }).click();
            await dialog.getByText('Jan', { exact: true }).click();

            await expect(
                dialog.locator(
                    '.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)',
                ),
            ).toHaveCount(0);
        });

        test('dates in a month before minDate are all disabled', async ({ page }) => {
            await card(page, 'Constrained range').locator('[blocDateRangePickerTrigger]').click();
            const dialog = page.getByRole('dialog');

            // Navigate to December 2023 (before min Jan 2024)
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.getByText('2023', { exact: true }).click();
            await dialog.getByText('Dec', { exact: true }).click();

            await expect(
                dialog.locator(
                    '.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)',
                ),
            ).toHaveCount(0);
        });

        test('dates within the allowed range are selectable', async ({ page }) => {
            const trigger = card(page, 'Constrained range').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            const dialog = page.getByRole('dialog');

            // Navigate to March 2025 — fully within range
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.getByText('2025', { exact: true }).click();
            await dialog.getByText('Mar', { exact: true }).click();

            await firstEnabledDay(page).click(); // first pick
            await lastEnabledDay(page).click(); // second pick
            await expect(dialog).not.toBeVisible();
            await expect(trigger).toContainText('→');
        });
    });

    // ── Month navigation in range mode ────────────────────────────────────

    test.describe('Month navigation', () => {
        test.beforeEach(async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
        });

        test('Previous month changes the header label', async ({ page }) => {
            const label = page.getByRole('dialog').locator('.bloc-dp-myb');
            const before = await label.textContent();
            await page.getByRole('dialog').getByRole('button', { name: 'Previous month' }).click();
            await expect(label).not.toHaveText(before!);
        });

        test('Next month changes the header label', async ({ page }) => {
            const label = page.getByRole('dialog').locator('.bloc-dp-myb');
            const before = await label.textContent();
            await page.getByRole('dialog').getByRole('button', { name: 'Next month' }).click();
            await expect(label).not.toHaveText(before!);
        });
    });

    // ── Month / Year view in range mode ───────────────────────────────────

    test.describe('Month and year view', () => {
        test.beforeEach(async ({ page }) => {
            await card(page, 'Default').locator('[blocDateRangePickerTrigger]').click();
        });

        test('clicking the month/year label opens the month grid', async ({ page }) => {
            await page.getByRole('dialog').locator('.bloc-dp-myb').click();
            await expect(page.getByRole('dialog').locator('.bloc-dp-mgrid')).toBeVisible();
        });

        test('clicking the year label in month view opens the year grid', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-myb').click(); // month view
            await dialog.locator('.bloc-dp-myb').click(); // year view
            await expect(dialog.locator('.bloc-dp-ygrid')).toBeVisible();
        });

        test('selecting a month returns to day view', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.locator('.bloc-dp-mc').first().click();
            await expect(dialog.locator('.bloc-dp-days')).toBeVisible();
        });

        test('selecting a year transitions to month view', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.locator('.bloc-dp-yc').first().click();
            await expect(dialog.locator('.bloc-dp-mgrid')).toBeVisible();
        });
    });

    // ── Escape cancels partial range selection ────────────────────────────

    test.describe('Escape during partial range selection', () => {
        test('pressing Escape after first pick closes calendar and resets partial selection', async ({
            page,
        }) => {
            const trigger = card(page, 'Default').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click(); // partial pick — stays open

            await page.keyboard.press('Escape');
            await expect(page.getByRole('dialog')).not.toBeVisible();

            // Trigger should still show placeholder (partial selection discarded)
            await expect(trigger).toContainText('Pick a range');
        });
    });

    // ── Custom token ──────────────────────────────────────────────────────

    test.describe('Custom token (Purple accent)', () => {
        test('shows "Purple accent" placeholder text', async ({ page }) => {
            await expect(
                card(page, 'Custom colour').locator('[blocDateRangePickerTrigger]'),
            ).toContainText('Purple accent');
        });

        test('trigger has aria-haspopup="dialog"', async ({ page }) => {
            await expect(
                card(page, 'Custom colour').locator('[blocDateRangePickerTrigger]'),
            ).toHaveAttribute('aria-haspopup', 'dialog');
        });

        test('opens calendar on click', async ({ page }) => {
            await card(page, 'Custom colour').locator('[blocDateRangePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('selecting a range updates the purple accent trigger', async ({ page }) => {
            const trigger = card(page, 'Custom colour').locator('[blocDateRangePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await lastEnabledDay(page).click();
            await expect(trigger).toContainText('→');
            await expect(trigger).not.toContainText('Purple accent');
        });
    });
});
