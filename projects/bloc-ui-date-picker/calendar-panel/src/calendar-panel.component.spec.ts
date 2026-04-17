import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { BlocCalendarPanelComponent } from './calendar-panel.component';

// ── Test host ──────────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [BlocCalendarPanelComponent],
    template: `
        <bloc-calendar-panel
            [selectedDate]="selectedDate()"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
            (dateSelect)="onDateSelect($event)"
            (cleared)="onCleared()"
        />
    `,
})
class CalendarPanelTestHost {
    readonly selectedDate = signal<Date | null>(null);
    readonly minDate = signal<Date | null>(null);
    readonly maxDate = signal<Date | null>(null);
    lastSelectedDate: Date | null = null;
    clearCount = 0;
    onDateSelect(d: Date) {
        this.lastSelectedDate = d;
    }
    onCleared() {
        this.clearCount++;
    }
}

// ── BlocCalendarPanelComponent ─────────────────────────────────────────────

describe('BlocCalendarPanelComponent', () => {
    let fixture: ComponentFixture<CalendarPanelTestHost>;
    let host: CalendarPanelTestHost;

    function el(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    function dayButtons(): HTMLButtonElement[] {
        return Array.from(el().querySelectorAll<HTMLButtonElement>('.bloc-dp-days .bloc-dp-d'));
    }

    function enabledDayButtons(): HTMLButtonElement[] {
        return dayButtons().filter((b) => !b.disabled);
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarPanelTestHost],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarPanelTestHost);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Creation ──────────────────────────────────────────────────────────

    it('should render the calendar panel', () => {
        expect(el().querySelector('bloc-calendar-panel')).toBeTruthy();
    });

    // ── Day grid ──────────────────────────────────────────────────────────

    it('renders exactly 42 day cells', () => {
        expect(dayButtons().length).toBe(42);
    });

    it("today's cell has the --tod modifier class", () => {
        const today = new Date();
        const todLabel = today.getDate().toString();
        const todCell = dayButtons().find(
            (b) => b.classList.contains('bloc-dp-d--tod') && b.textContent?.trim() === todLabel,
        );
        expect(todCell).toBeTruthy();
    });

    // ── Day selection ─────────────────────────────────────────────────────

    it('clicking an enabled day emits dateSelect with that date', () => {
        const btn = enabledDayButtons().find((b) => !b.classList.contains('bloc-dp-d--oth'));
        expect(btn).toBeTruthy();
        btn!.click();
        fixture.detectChanges();
        expect(host.lastSelectedDate).toBeInstanceOf(Date);
    });

    it('emitted date matches the day number of the clicked cell', () => {
        const btn = enabledDayButtons().find((b) => !b.classList.contains('bloc-dp-d--oth'))!;
        const dayNum = Number(btn.textContent?.trim());
        btn.click();
        fixture.detectChanges();
        expect(host.lastSelectedDate!.getDate()).toBe(dayNum);
    });

    // ── Selected date CSS class ───────────────────────────────────────────

    it('selected date cell has the --sel modifier class', () => {
        // Set selectedDate to today
        const today = new Date();
        host.selectedDate.set(today);
        fixture.detectChanges();
        const selCell = dayButtons().find((b) => b.classList.contains('bloc-dp-d--sel'));
        expect(selCell).toBeTruthy();
    });

    // ── Clear button ──────────────────────────────────────────────────────

    it('Clear button is not visible when no date is selected', () => {
        expect(el().querySelector('.bloc-dp-cbtn')).toBeNull();
    });

    it('Clear button appears when a date is selected', () => {
        host.selectedDate.set(new Date());
        fixture.detectChanges();
        expect(el().querySelector('.bloc-dp-cbtn')).not.toBeNull();
    });

    it('clicking Clear emits the cleared output', () => {
        host.selectedDate.set(new Date());
        fixture.detectChanges();
        (el().querySelector('.bloc-dp-cbtn') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(host.clearCount).toBe(1);
    });

    // ── Today button ──────────────────────────────────────────────────────

    it('Today button is visible', () => {
        expect(el().querySelector('.bloc-dp-tbtn')).not.toBeNull();
    });

    it("clicking Today emits dateSelect with today's date", () => {
        const today = new Date();
        (el().querySelector('.bloc-dp-tbtn') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(host.lastSelectedDate).not.toBeNull();
        expect(host.lastSelectedDate!.getDate()).toBe(today.getDate());
        expect(host.lastSelectedDate!.getMonth()).toBe(today.getMonth());
        expect(host.lastSelectedDate!.getFullYear()).toBe(today.getFullYear());
    });

    // ── Month navigation ──────────────────────────────────────────────────

    it('clicking Prev month changes the month/year label', () => {
        const before = el().querySelector('.bloc-dp-myb')!.textContent?.trim();
        (el().querySelector('[aria-label="Previous month"]') as HTMLButtonElement).click();
        fixture.detectChanges();
        const after = el().querySelector('.bloc-dp-myb')!.textContent?.trim();
        expect(after).not.toBe(before);
    });

    it('clicking Next month changes the month/year label', () => {
        const before = el().querySelector('.bloc-dp-myb')!.textContent?.trim();
        (el().querySelector('[aria-label="Next month"]') as HTMLButtonElement).click();
        fixture.detectChanges();
        const after = el().querySelector('.bloc-dp-myb')!.textContent?.trim();
        expect(after).not.toBe(before);
    });

    it('Next then Prev returns to original month label', () => {
        const original = el().querySelector('.bloc-dp-myb')!.textContent?.trim();
        (el().querySelector('[aria-label="Next month"]') as HTMLButtonElement).click();
        fixture.detectChanges();
        (el().querySelector('[aria-label="Previous month"]') as HTMLButtonElement).click();
        fixture.detectChanges();
        const restored = el().querySelector('.bloc-dp-myb')!.textContent?.trim();
        expect(restored).toBe(original);
    });

    // ── Min / Max date constraints ────────────────────────────────────────

    it('days before minDate are disabled', () => {
        // set minDate to the 20th of current month so days 1–19 should be disabled
        const today = new Date();
        host.minDate.set(new Date(today.getFullYear(), today.getMonth(), 20));
        fixture.detectChanges();
        const currentMonthDays = dayButtons().filter(
            (b) => !b.classList.contains('bloc-dp-d--oth'),
        );
        const disabledBeforeMin = currentMonthDays.filter(
            (b) => Number(b.textContent?.trim()) < 20 && b.disabled,
        );
        expect(disabledBeforeMin.length).toBeGreaterThan(0);
    });

    it('days after maxDate are disabled', () => {
        const today = new Date();
        host.maxDate.set(new Date(today.getFullYear(), today.getMonth(), 5));
        fixture.detectChanges();
        const currentMonthDays = dayButtons().filter(
            (b) => !b.classList.contains('bloc-dp-d--oth'),
        );
        const disabledAfterMax = currentMonthDays.filter(
            (b) => Number(b.textContent?.trim()) > 5 && b.disabled,
        );
        expect(disabledAfterMax.length).toBeGreaterThan(0);
    });

    // ── Month and year views ──────────────────────────────────────────────

    it('clicking month/year label opens month grid', () => {
        (el().querySelector('.bloc-dp-myb') as HTMLButtonElement).click();
        fixture.detectChanges();
        const monthGrid = el().querySelectorAll('.bloc-dp-mc');
        expect(monthGrid.length).toBe(12);
    });

    it('selecting a month from month grid returns to day view', () => {
        (el().querySelector('.bloc-dp-myb') as HTMLButtonElement).click();
        fixture.detectChanges();
        (el().querySelector('.bloc-dp-mc') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(el().querySelector('.bloc-dp-days')).not.toBeNull();
    });
});
