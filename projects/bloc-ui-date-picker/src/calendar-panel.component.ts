import { Component, computed, input, output, signal } from '@angular/core';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

@Component({
  selector: 'bloc-calendar-panel',
  standalone: true,
  template: `
    <div class="bloc-date-picker__header">
      @if (_view() === 'day') {
        <button type="button" class="bloc-date-picker__nav" (click)="prevMonth()" aria-label="Previous month">&#8249;</button>
        <button type="button" class="bloc-date-picker__month-year-btn" (click)="openMonthView()">{{ monthYearLabel() }}</button>
        <button type="button" class="bloc-date-picker__nav" (click)="nextMonth()" aria-label="Next month">&#8250;</button>
      }
      @if (_view() === 'month') {
        <button type="button" class="bloc-date-picker__nav" (click)="prevYear()" aria-label="Previous year">&#8249;</button>
        <button type="button" class="bloc-date-picker__month-year-btn" (click)="openYearView()">{{ viewYear() }}</button>
        <button type="button" class="bloc-date-picker__nav" (click)="nextYear()" aria-label="Next year">&#8250;</button>
      }
      @if (_view() === 'year') {
        <button type="button" class="bloc-date-picker__nav" (click)="prevYearRange()" aria-label="Previous years">&#8249;</button>
        <span class="bloc-date-picker__month-year-label">{{ yearRange()[0] }} – {{ yearRange()[11] }}</span>
        <button type="button" class="bloc-date-picker__nav" (click)="nextYearRange()" aria-label="Next years">&#8250;</button>
      }
    </div>

    @if (_view() === 'day') {
      <div class="bloc-date-picker__weekdays">
        @for (day of weekdays; track day) {
          <span class="bloc-date-picker__weekday">{{ day }}</span>
        }
      </div>

      <div class="bloc-date-picker__days">
        @for (day of calendarDays(); track day.date.getTime()) {
          <button
            type="button"
            class="bloc-date-picker__day"
            [class.bloc-date-picker__day--other]="!day.isCurrentMonth"
            [class.bloc-date-picker__day--today]="day.isToday"
            [class.bloc-date-picker__day--selected]="day.isSelected"
            [class.bloc-date-picker__day--disabled]="day.isDisabled"
            [class.bloc-date-picker__day--range-start]="day.isRangeStart"
            [class.bloc-date-picker__day--range-end]="day.isRangeEnd"
            [class.bloc-date-picker__day--in-range]="day.isInRange"
            [disabled]="day.isDisabled"
            (click)="selectDay(day)"
            (mouseenter)="onDayHover(day)">
            {{ day.day }}
          </button>
        }
      </div>
    }

    @if (_view() === 'month') {
      <div class="bloc-date-picker__month-grid">
        @for (m of months; track $index) {
          <button
            type="button"
            class="bloc-date-picker__month-cell"
            [class.bloc-date-picker__month-cell--selected]="selectedDate() && viewYear() === selectedDate()!.getFullYear() && $index === selectedDate()!.getMonth()"
            [class.bloc-date-picker__month-cell--current]="viewYear() === currentYear && $index === currentMonth"
            (click)="selectMonth($index)">
            {{ m }}
          </button>
        }
      </div>
    }

    @if (_view() === 'year') {
      <div class="bloc-date-picker__year-grid">
        @for (y of yearRange(); track y) {
          <button
            type="button"
            class="bloc-date-picker__year-cell"
            [class.bloc-date-picker__year-cell--selected]="selectedDate() && y === selectedDate()!.getFullYear()"
            [class.bloc-date-picker__year-cell--current]="y === currentYear"
            (click)="selectYear(y)">
            {{ y }}
          </button>
        }
      </div>
    }

    @if (_view() === 'day') {
      <div class="bloc-date-picker__footer">
        <button type="button" class="bloc-date-picker__today-btn" (click)="goToToday()">
          Today
        </button>
        @if (selectedDate() || rangeStart()) {
          <button type="button" class="bloc-date-picker__clear-btn" (click)="clear()">
            Clear
          </button>
        }
      </div>
    }
  `,
  styleUrl: './calendar-panel.component.scss',
  host: { class: 'bloc-calendar-panel' },
})
export class BlocCalendarPanelComponent {
  /** Currently selected date (passed in by parent). */
  readonly selectedDate = input<Date | null>(null);

  /** Minimum selectable date. */
  readonly minDate = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly maxDate = input<Date | null>(null);

  /** Panel mode: 'single' for single date, 'range' for date range. */
  readonly mode = input<'single' | 'range'>('single');

  /** Range start date (range mode). */
  readonly rangeStart = input<Date | null>(null);

  /** Range end date (range mode). */
  readonly rangeEnd = input<Date | null>(null);

  /** Hover date for range preview (range mode). */
  readonly hoverDate = input<Date | null>(null);

  /** Emitted when a day is picked or "Today" is clicked. */
  readonly dateSelect = output<Date>();

  /** Emitted when "Clear" is clicked. */
  readonly cleared = output<void>();

  /** Emitted when a day is hovered (range mode). */
  readonly dateHover = output<Date>();

  readonly weekdays = DAYS_OF_WEEK;
  readonly months = MONTHS_SHORT;

  readonly _viewDate = signal<Date>(new Date());
  readonly _view = signal<'day' | 'month' | 'year'>('day');
  readonly _yearRangeStart = signal<number>(new Date().getFullYear() - 4);

  readonly yearRange = computed(() =>
    Array.from({ length: 12 }, (_, i) => this._yearRangeStart() + i)
  );

  readonly viewYear = computed(() => this._viewDate().getFullYear());
  readonly viewMonth = computed(() => this._viewDate().getMonth());

  readonly currentYear = new Date().getFullYear();
  readonly currentMonth = new Date().getMonth();

  readonly monthYearLabel = computed(() => {
    const d = this._viewDate();
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const viewDate = this._viewDate();
    const selected = this.selectedDate();
    const today = new Date();
    const min = this.minDate();
    const max = this.maxDate();
    const rStart = this.rangeStart();
    const rEnd = this.rangeEnd();
    const hover = this.hoverDate();
    const isRange = this.mode() === 'range';

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: CalendarDay[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push(this._buildDay(date, false, today, selected, min, max, isRange, rStart, rEnd, hover));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      days.push(this._buildDay(date, true, today, selected, min, max, isRange, rStart, rEnd, hover));
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push(this._buildDay(date, false, today, selected, min, max, isRange, rStart, rEnd, hover));
    }

    return days;
  });

  /** Reset the panel to day view, optionally centred on the given date. */
  resetView(date?: Date | null): void {
    this._view.set('day');
    if (date) {
      this._viewDate.set(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }

  // — Navigation —

  prevMonth(): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  openMonthView(): void {
    this._view.set('month');
  }

  openYearView(): void {
    const viewYear = this._viewDate().getFullYear();
    this._yearRangeStart.set(viewYear - 4);
    this._view.set('year');
  }

  selectMonth(monthIndex: number): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear(), monthIndex, 1));
    this._view.set('day');
  }

  selectYear(year: number): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(year, d.getMonth(), 1));
    this._view.set('month');
  }

  prevYear(): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear() - 1, d.getMonth(), 1));
  }

  nextYear(): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear() + 1, d.getMonth(), 1));
  }

  prevYearRange(): void {
    this._yearRangeStart.update((v) => v - 12);
  }

  nextYearRange(): void {
    this._yearRangeStart.update((v) => v + 12);
  }

  selectDay(day: CalendarDay): void {
    if (day.isDisabled) return;
    this.dateSelect.emit(day.date);
  }

  onDayHover(day: CalendarDay): void {
    if (this.mode() === 'range' && !day.isDisabled) {
      this.dateHover.emit(day.date);
    }
  }

  goToToday(): void {
    const today = new Date();
    this._viewDate.set(new Date(today.getFullYear(), today.getMonth(), 1));
    this.dateSelect.emit(today);
  }

  clear(): void {
    this.cleared.emit();
  }

  // — Private helpers —

  private _buildDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    selected: Date | null,
    min: Date | null,
    max: Date | null,
    isRange = false,
    rangeStart: Date | null = null,
    rangeEnd: Date | null = null,
    hoverDate: Date | null = null,
  ): CalendarDay {
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    const isSelected = selected
      ? date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
      : false;

    let isDisabled = false;
    if (min) {
      const minDay = new Date(min.getFullYear(), min.getMonth(), min.getDate());
      isDisabled = date < minDay;
    }
    if (max && !isDisabled) {
      const maxDay = new Date(max.getFullYear(), max.getMonth(), max.getDate());
      isDisabled = date > maxDay;
    }

    let isRangeStart = false;
    let isRangeEnd = false;
    let isInRange = false;

    if (isRange) {
      const dt = this._stripTime(date).getTime();
      const s = rangeStart ? this._stripTime(rangeStart).getTime() : null;
      const e = rangeEnd ? this._stripTime(rangeEnd).getTime() : null;
      const h = hoverDate ? this._stripTime(hoverDate).getTime() : null;

      if (s !== null && e !== null) {
        // Complete range
        isRangeStart = dt === s;
        isRangeEnd = dt === e;
        isInRange = dt > s && dt < e;
      } else if (s !== null && h !== null) {
        // Preview range (one click done, hovering)
        const lo = Math.min(s, h);
        const hi = Math.max(s, h);
        isRangeStart = dt === lo;
        isRangeEnd = dt === hi;
        isInRange = dt > lo && dt < hi;
      } else if (s !== null) {
        isRangeStart = dt === s;
      }
    }

    return { date, day: date.getDate(), isCurrentMonth, isToday, isSelected, isDisabled, isRangeStart, isRangeEnd, isInRange };
  }

  private _stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
}
