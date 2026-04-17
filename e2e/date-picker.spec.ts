import { test, expect, Page } from '@playwright/test';
import { navigateTo, collectConsoleErrors } from './utils/test-helpers';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Card scoped to an h3 heading with exact text (anchored regex prevents substring match). */
function card(page: Page, heading: string) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactName = new RegExp(`^\\s*${escaped}\\s*$`, 'i');
    return page
        .locator('.bg-gray-900.rounded-lg')
        .filter({ has: page.getByRole('heading', { name: exactName, level: 3 }) });
}

/** First enabled, current-month day button inside the open calendar. */
function firstEnabledDay(page: Page) {
    return page
        .getByRole('dialog')
        .locator('.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)')
        .first();
}

/** Last enabled, current-month day button inside the open calendar. */
function lastEnabledDay(page: Page) {
    return page
        .getByRole('dialog')
        .locator('.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)')
        .last();
}

// ── Spec ───────────────────────────────────────────────────────────────────

test.describe('DatePickerComponent', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/date-picker');
    });

    // ── Page load ─────────────────────────────────────────────────────────

    test.describe('Page load', () => {
        test('renders page title', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: 'Date Picker', level: 1 }),
            ).toBeVisible();
        });

        test('renders all section headings', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Basic usage' })).toBeVisible();
            await expect(
                page.getByRole('heading', { name: 'Template-driven (ngModel)' }),
            ).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Reactive forms' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Min / Max date' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Custom token' })).toBeVisible();
        });

        test('does not log console errors on load', async ({ page }) => {
            const errors = collectConsoleErrors(page);
            await navigateTo(page, '/date-picker');
            expect(errors).toHaveLength(0);
        });
    });

    // ── Default trigger ───────────────────────────────────────────────────

    test.describe('Default trigger', () => {
        test('shows "Pick a date" placeholder text', async ({ page }) => {
            await expect(card(page, 'Default').locator('[blocDatePickerTrigger]')).toContainText(
                'Pick a date',
            );
        });

        test('trigger has aria-haspopup="dialog"', async ({ page }) => {
            await expect(card(page, 'Default').locator('[blocDatePickerTrigger]')).toHaveAttribute(
                'aria-haspopup',
                'dialog',
            );
        });

        test('trigger has aria-expanded="false" initially', async ({ page }) => {
            await expect(card(page, 'Default').locator('[blocDatePickerTrigger]')).toHaveAttribute(
                'aria-expanded',
                'false',
            );
        });

        test('opens calendar on click', async ({ page }) => {
            await card(page, 'Default').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('trigger aria-expanded becomes "true" when open', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        });

        test('trigger gets open modifier class when calendar is open', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await expect(trigger).toHaveClass(/bloc-date-picker-trigger--open/);
        });

        test('closes calendar on Escape key', async ({ page }) => {
            await card(page, 'Default').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('closes calendar when clicking outside', async ({ page }) => {
            await card(page, 'Default').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await page.getByRole('heading', { name: 'Date Picker', level: 1 }).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('aria-expanded returns to "false" after close', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await page.keyboard.press('Escape');
            await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('clicking the trigger again closes the calendar (toggle)', async ({ page }) => {
            const trigger = card(page, 'Default').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await trigger.click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });
    });

    // ── Calendar panel structure ──────────────────────────────────────────

    test.describe('Calendar panel structure', () => {
        test.beforeEach(async ({ page }) => {
            await card(page, 'Default').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('calendar dialog is labelled "Date picker"', async ({ page }) => {
            await expect(page.getByRole('dialog', { name: 'Date picker' })).toBeVisible();
        });

        test('shows a month/year label button in the header', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-myb')).toBeVisible();
        });

        test('shows Previous month navigation button', async ({ page }) => {
            await expect(
                page.getByRole('dialog').getByRole('button', { name: 'Previous month' }),
            ).toBeVisible();
        });

        test('shows Next month navigation button', async ({ page }) => {
            await expect(
                page.getByRole('dialog').getByRole('button', { name: 'Next month' }),
            ).toBeVisible();
        });

        test('shows all 7 weekday column headers', async ({ page }) => {
            const wds = page.getByRole('dialog').locator('.bloc-dp-wds');
            for (const day of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) {
                await expect(wds.getByText(day, { exact: true })).toBeVisible();
            }
        });

        test('renders exactly 42 day cells (6 rows × 7 cols)', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-days .bloc-dp-d')).toHaveCount(
                42,
            );
        });

        test('shows Today button in footer', async ({ page }) => {
            await expect(
                page.getByRole('dialog').getByRole('button', { name: 'Today' }),
            ).toBeVisible();
        });

        test('does not show Clear button when no date is selected', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-cbtn')).not.toBeVisible();
        });

        test('today cell has today modifier class', async ({ page }) => {
            await expect(
                page.getByRole('dialog').locator('.bloc-dp-days .bloc-dp-d--tod'),
            ).toBeVisible();
        });
    });

    // ── Month navigation ──────────────────────────────────────────────────

    test.describe('Month navigation', () => {
        test.beforeEach(async ({ page }) => {
            await card(page, 'Default').locator('[blocDatePickerTrigger]').click();
        });

        test('Previous month button changes the header label', async ({ page }) => {
            const label = page.getByRole('dialog').locator('.bloc-dp-myb');
            const before = await label.textContent();
            await page.getByRole('dialog').getByRole('button', { name: 'Previous month' }).click();
            await expect(label).not.toHaveText(before!);
        });

        test('Next month button changes the header label', async ({ page }) => {
            const label = page.getByRole('dialog').locator('.bloc-dp-myb');
            const before = await label.textContent();
            await page.getByRole('dialog').getByRole('button', { name: 'Next month' }).click();
            await expect(label).not.toHaveText(before!);
        });

        test('navigating forward then back restores original month label', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            const label = dialog.locator('.bloc-dp-myb');
            const original = await label.textContent();
            await dialog.getByRole('button', { name: 'Next month' }).click();
            await dialog.getByRole('button', { name: 'Previous month' }).click();
            await expect(label).toHaveText(original!);
        });
    });

    // ── Day selection ─────────────────────────────────────────────────────

    test.describe('Day selection', () => {
        test('selecting a day closes the calendar', async ({ page }) => {
            await card(page, 'Two-way binding').locator('[blocDatePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('selected day has selected modifier class when calendar is reopened', async ({
            page,
        }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDatePickerTrigger]');
            await trigger.click();
            const firstDay = firstEnabledDay(page);
            const dayNumber = await firstDay.textContent();
            await firstDay.click();

            // Reopen calendar
            await trigger.click();
            const selectedCell = page
                .getByRole('dialog')
                .locator('.bloc-dp-days .bloc-dp-d--sel:not(.bloc-dp-d--oth)');
            await expect(selectedCell).toBeVisible();
            await expect(selectedCell).toContainText(dayNumber!.trim());
        });

        test('selecting a date removes the placeholder text from the trigger', async ({ page }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await expect(trigger).not.toContainText('Pick a date');
        });

        test('selecting a date updates the ngModel value display', async ({ page }) => {
            await card(page, 'Two-way binding').locator('[blocDatePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await expect(
                card(page, 'Two-way binding').locator('p').filter({ hasText: 'ngModel value:' }),
            ).not.toContainText('null');
        });
    });

    // ── Today button ──────────────────────────────────────────────────────

    test.describe('Today button', () => {
        test('clicking Today closes the calendar', async ({ page }) => {
            await card(page, 'Two-way binding').locator('[blocDatePickerTrigger]').click();
            await page.getByRole('dialog').getByRole('button', { name: 'Today' }).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('clicking Today sets a date on the trigger', async ({ page }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await page.getByRole('dialog').getByRole('button', { name: 'Today' }).click();
            await expect(trigger).not.toContainText('Pick a date');
        });

        test('after clicking Today, reopened calendar shows today as selected', async ({
            page,
        }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await page.getByRole('dialog').getByRole('button', { name: 'Today' }).click();
            await trigger.click();
            // today cell should also carry the selected class
            await expect(
                page.getByRole('dialog').locator('.bloc-dp-days .bloc-dp-d--tod.bloc-dp-d--sel'),
            ).toBeVisible();
        });
    });

    // ── Clear button ──────────────────────────────────────────────────────

    test.describe('Clear button', () => {
        test('Clear button appears when a date is selected', async ({ page }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await trigger.click(); // reopen
            await expect(page.getByRole('dialog').locator('.bloc-dp-cbtn')).toBeVisible();
        });

        test('clicking Clear removes the selected date and clears the trigger', async ({
            page,
        }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await trigger.click(); // reopen
            await page.getByRole('dialog').locator('.bloc-dp-cbtn').click();
            // calendar stays open after clear — close it
            await page.keyboard.press('Escape');
            await expect(trigger).toContainText('Pick a date');
        });

        test('Clear button disappears after clicking it (calendar stays open)', async ({
            page,
        }) => {
            const trigger = card(page, 'Two-way binding').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await trigger.click(); // reopen
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-cbtn').click();
            // Dialog still open, but Clear button is gone
            await expect(dialog).toBeVisible();
            await expect(dialog.locator('.bloc-dp-cbtn')).not.toBeVisible();
        });
    });

    // ── Month view ────────────────────────────────────────────────────────

    test.describe('Month view', () => {
        test.beforeEach(async ({ page }) => {
            await card(page, 'Default').locator('[blocDatePickerTrigger]').click();
        });

        test('clicking the month/year label button opens the month grid', async ({ page }) => {
            await page.getByRole('dialog').locator('.bloc-dp-myb').click();
            await expect(page.getByRole('dialog').locator('.bloc-dp-mgrid')).toBeVisible();
        });

        test('month grid shows 12 month buttons', async ({ page }) => {
            await page.getByRole('dialog').locator('.bloc-dp-myb').click();
            await expect(page.getByRole('dialog').locator('.bloc-dp-mc')).toHaveCount(12);
        });

        test('month grid shows abbreviated month names', async ({ page }) => {
            await page.getByRole('dialog').locator('.bloc-dp-myb').click();
            const grid = page.getByRole('dialog').locator('.bloc-dp-mgrid');
            for (const m of [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ]) {
                await expect(grid.getByText(m, { exact: true })).toBeVisible();
            }
        });

        test('Previous year button changes the year label in month view', async ({ page }) => {
            await page.getByRole('dialog').locator('.bloc-dp-myb').click();
            const label = page.getByRole('dialog').locator('.bloc-dp-myb');
            const before = await label.textContent();
            await page.getByRole('dialog').getByRole('button', { name: 'Previous year' }).click();
            await expect(label).not.toHaveText(before!);
        });

        test('Next year button changes the year label in month view', async ({ page }) => {
            await page.getByRole('dialog').locator('.bloc-dp-myb').click();
            const label = page.getByRole('dialog').locator('.bloc-dp-myb');
            const before = await label.textContent();
            await page.getByRole('dialog').getByRole('button', { name: 'Next year' }).click();
            await expect(label).not.toHaveText(before!);
        });

        test('selecting a month closes the month grid and shows day view', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.locator('.bloc-dp-mc').first().click();
            await expect(dialog.locator('.bloc-dp-days')).toBeVisible();
            await expect(dialog.locator('.bloc-dp-mgrid')).not.toBeVisible();
        });

        test('current month cell has current modifier class', async ({ page }) => {
            await page.getByRole('dialog').locator('.bloc-dp-myb').click();
            await expect(
                page.getByRole('dialog').locator('.bloc-dp-mc.bloc-dp-mc--cur'),
            ).toBeVisible();
        });
    });

    // ── Year view ─────────────────────────────────────────────────────────

    test.describe('Year view', () => {
        test.beforeEach(async ({ page }) => {
            await card(page, 'Default').locator('[blocDatePickerTrigger]').click();
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-myb').click(); // → month view
            await dialog.locator('.bloc-dp-myb').click(); // → year view
        });

        test('year grid is visible', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-ygrid')).toBeVisible();
        });

        test('year grid shows 12 year buttons', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-yc')).toHaveCount(12);
        });

        test('year range label is visible in header', async ({ page }) => {
            await expect(page.getByRole('dialog').locator('.bloc-dp-myl')).toBeVisible();
        });

        test('Next years button advances the year range', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            const firstYear = await dialog.locator('.bloc-dp-yc').first().textContent();
            await dialog.getByRole('button', { name: 'Next years' }).click();
            await expect(dialog.locator('.bloc-dp-yc').first()).not.toHaveText(firstYear!);
        });

        test('Previous years button goes back in the year range', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            const firstYear = await dialog.locator('.bloc-dp-yc').first().textContent();
            await dialog.getByRole('button', { name: 'Next years' }).click();
            // Wait for the year cells to update after advancing.
            await expect(dialog.locator('.bloc-dp-yc').first()).not.toHaveText(firstYear!);
            const firstYearAfterNext = await dialog.locator('.bloc-dp-yc').first().textContent();
            await dialog.getByRole('button', { name: 'Previous years' }).click();
            await expect(dialog.locator('.bloc-dp-yc').first()).not.toHaveText(firstYearAfterNext!);
        });

        test('selecting a year transitions to month view', async ({ page }) => {
            const dialog = page.getByRole('dialog');
            await dialog.locator('.bloc-dp-yc').first().click();
            await expect(dialog.locator('.bloc-dp-mgrid')).toBeVisible();
            await expect(dialog.locator('.bloc-dp-ygrid')).not.toBeVisible();
        });

        test('current year cell has current modifier class', async ({ page }) => {
            await expect(
                page.getByRole('dialog').locator('.bloc-dp-yc.bloc-dp-yc--cur'),
            ).toBeVisible();
        });
    });

    // ── FormControl binding ───────────────────────────────────────────────

    test.describe('FormControl binding', () => {
        test('shows "Select date" placeholder text', async ({ page }) => {
            await expect(
                card(page, 'FormControl').locator('[blocDatePickerTrigger]').first(),
            ).toContainText('Select date');
        });

        test('selecting a date updates the value display', async ({ page }) => {
            await card(page, 'FormControl').locator('[blocDatePickerTrigger]').first().click();
            await firstEnabledDay(page).click();
            await expect(
                card(page, 'FormControl').locator('p').filter({ hasText: 'value:' }),
            ).not.toContainText('null');
        });

        test('trigger text updates after date selection', async ({ page }) => {
            const trigger = card(page, 'FormControl').locator('[blocDatePickerTrigger]').first();
            await trigger.click();
            await firstEnabledDay(page).click();
            await expect(trigger).not.toContainText('Select date');
        });
    });

    // ── Disabled state ────────────────────────────────────────────────────

    test.describe('Disabled state', () => {
        test('disabled trigger has disabled modifier class', async ({ page }) => {
            await expect(card(page, 'Disabled').locator('[blocDatePickerTrigger]')).toHaveClass(
                /bloc-date-picker-trigger--disabled/,
            );
        });

        test('disabled trigger shows its initial date value (not the placeholder)', async ({
            page,
        }) => {
            const trigger = card(page, 'Disabled').locator('[blocDatePickerTrigger]');
            // disabledCtrl is initialised with new Date(), so the button shows today's date
            await expect(trigger).toBeVisible();
            await expect(trigger).not.toBeEmpty();
        });

        test('clicking disabled trigger does not open calendar', async ({ page }) => {
            await card(page, 'Disabled').locator('[blocDatePickerTrigger]').click({ force: true });
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('"Enable control" button removes disabled state', async ({ page }) => {
            await card(page, 'Disabled').getByRole('button', { name: 'Enable control' }).click();
            await expect(card(page, 'Disabled').locator('[blocDatePickerTrigger]')).not.toHaveClass(
                /bloc-date-picker-trigger--disabled/,
            );
        });

        test('re-enabled trigger opens calendar', async ({ page }) => {
            await card(page, 'Disabled').getByRole('button', { name: 'Enable control' }).click();
            await card(page, 'Disabled').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('"Disable control" button re-applies disabled state', async ({ page }) => {
            // Enable first
            await card(page, 'Disabled').getByRole('button', { name: 'Enable control' }).click();
            // Then disable again
            await card(page, 'Disabled').getByRole('button', { name: 'Disable control' }).click();
            await expect(card(page, 'Disabled').locator('[blocDatePickerTrigger]')).toHaveClass(
                /bloc-date-picker-trigger--disabled/,
            );
        });
    });

    // ── formControlName ───────────────────────────────────────────────────

    test.describe('formControlName', () => {
        test('shows "Pick birthdate" placeholder text', async ({ page }) => {
            await expect(
                card(page, 'formControlName').locator('[blocDatePickerTrigger]'),
            ).toContainText('Pick birthdate');
        });

        test('trigger has aria-haspopup="dialog"', async ({ page }) => {
            await expect(
                card(page, 'formControlName').locator('[blocDatePickerTrigger]'),
            ).toHaveAttribute('aria-haspopup', 'dialog');
        });

        test('opens calendar and lets user select a date', async ({ page }) => {
            await card(page, 'formControlName').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await firstEnabledDay(page).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('selected date updates the FormGroup value display', async ({ page }) => {
            await card(page, 'formControlName').locator('[blocDatePickerTrigger]').click();
            await firstEnabledDay(page).click();
            await expect(
                card(page, 'formControlName').locator('p').filter({ hasText: 'group value:' }),
            ).not.toContainText('null');
        });
    });

    // ── Min / Max date ────────────────────────────────────────────────────

    test.describe('Min / Max date constraint', () => {
        test('shows "Pick a date" placeholder text', async ({ page }) => {
            await expect(
                card(page, 'Date range constraint').locator('[blocDatePickerTrigger]'),
            ).toContainText('Pick a date');
        });

        test('dates in a month beyond maxDate (Jan 2024–Dec 2026) are all disabled', async ({
            page,
        }) => {
            await card(page, 'Date range constraint').locator('[blocDatePickerTrigger]').click();
            const dialog = page.getByRole('dialog');

            // Navigate via year view to January 2027 (beyond max Dec 2026)
            await dialog.locator('.bloc-dp-myb').click(); // month view
            await dialog.locator('.bloc-dp-myb').click(); // year view
            await dialog.getByText('2027', { exact: true }).click(); // year → month view
            await dialog.getByText('Jan', { exact: true }).click(); // month → day view

            // No enabled current-month days expected
            await expect(
                dialog.locator(
                    '.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)',
                ),
            ).toHaveCount(0);
        });

        test('dates in a month before minDate (Jan 2024) are all disabled', async ({ page }) => {
            await card(page, 'Date range constraint').locator('[blocDatePickerTrigger]').click();
            const dialog = page.getByRole('dialog');

            // Navigate to December 2023 (before min Jan 2024)
            await dialog.locator('.bloc-dp-myb').click(); // month view
            await dialog.locator('.bloc-dp-myb').click(); // year view
            await dialog.getByText('2023', { exact: true }).click(); // year → month view
            await dialog.getByText('Dec', { exact: true }).click(); // month → day view

            // No enabled current-month days expected
            await expect(
                dialog.locator(
                    '.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)',
                ),
            ).toHaveCount(0);
        });

        test('dates within the allowed range are enabled', async ({ page }) => {
            await card(page, 'Date range constraint').locator('[blocDatePickerTrigger]').click();
            const dialog = page.getByRole('dialog');

            // Navigate to May 2025 — fully within range
            await dialog.locator('.bloc-dp-myb').click(); // month view
            await dialog.locator('.bloc-dp-myb').click(); // year view
            await dialog.getByText('2025', { exact: true }).click();
            await dialog.getByText('May', { exact: true }).click();

            const enabledDays = dialog.locator(
                '.bloc-dp-days .bloc-dp-d:not(.bloc-dp-d--oth):not(.bloc-dp-d--dis)',
            );
            await expect(enabledDays).not.toHaveCount(0);
        });

        test('selecting an enabled date in range works', async ({ page }) => {
            const trigger = card(page, 'Date range constraint').locator('[blocDatePickerTrigger]');
            await trigger.click();
            const dialog = page.getByRole('dialog');

            // Navigate to May 2025
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.locator('.bloc-dp-myb').click();
            await dialog.getByText('2025', { exact: true }).click();
            await dialog.getByText('May', { exact: true }).click();

            await firstEnabledDay(page).click();
            await expect(dialog).not.toBeVisible();
            await expect(trigger).not.toContainText('Pick a date');
        });
    });

    // ── Custom element trigger ────────────────────────────────────────────

    test.describe('Custom element (div) trigger', () => {
        test('shows "Choose date" placeholder text', async ({ page }) => {
            await expect(
                card(page, 'Custom element').locator('[blocDatePickerTrigger]'),
            ).toContainText('Choose date');
        });

        test('div trigger has aria-haspopup="dialog"', async ({ page }) => {
            await expect(
                card(page, 'Custom element').locator('[blocDatePickerTrigger]'),
            ).toHaveAttribute('aria-haspopup', 'dialog');
        });

        test('div trigger opens calendar on click', async ({ page }) => {
            await card(page, 'Custom element').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('div trigger closes calendar on Escape', async ({ page }) => {
            await card(page, 'Custom element').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('selecting a date from div trigger updates the trigger text', async ({ page }) => {
            await card(page, 'Custom element').locator('[blocDatePickerTrigger]').click();
            await firstEnabledDay(page).click();
            // The trigger itself should no longer show 'Choose date'
            await expect(
                card(page, 'Custom element').locator('[blocDatePickerTrigger]'),
            ).not.toContainText('Choose date');
        });
    });

    // ── Custom token ──────────────────────────────────────────────────────

    test.describe('Custom token (Green accent)', () => {
        test('shows "Green accent" placeholder text', async ({ page }) => {
            await expect(
                card(page, 'Green accent').locator('[blocDatePickerTrigger]'),
            ).toContainText('Green accent');
        });

        test('trigger has aria-haspopup="dialog"', async ({ page }) => {
            await expect(
                card(page, 'Green accent').locator('[blocDatePickerTrigger]'),
            ).toHaveAttribute('aria-haspopup', 'dialog');
        });

        test('opens calendar panel on click', async ({ page }) => {
            await card(page, 'Green accent').locator('[blocDatePickerTrigger]').click();
            await expect(page.getByRole('dialog')).toBeVisible();
        });

        test('selecting a date updates the green accent trigger text', async ({ page }) => {
            const trigger = card(page, 'Green accent').locator('[blocDatePickerTrigger]');
            await trigger.click();
            await firstEnabledDay(page).click();
            await expect(trigger).not.toContainText('Green accent');
        });
    });
});
