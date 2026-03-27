import { Component, computed, input, output, signal } from '@angular/core';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_SHORT = [
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
];

export interface CalendarDay {
  date: Date;
  day: number;
  cls: string;
  dis: boolean;
}

@Component({
  selector: 'bloc-calendar-panel',
  standalone: true,
  templateUrl: './calendar-panel.component.html',
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
    Array.from({ length: 12 }, (_, i) => this._yearRangeStart() + i),
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

    const todayKey = this._dk(today);
    const selKey = selected ? this._dk(selected) : 0;
    const minKey = min ? this._dk(min) : 0;
    const maxKey = max ? this._dk(max) : 0;
    const sKey = rStart ? this._dk(rStart) : 0;
    const eKey = rEnd ? this._dk(rEnd) : 0;
    const hKey = hover ? this._dk(hover) : 0;

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: CalendarDay[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        this._buildDay(
          new Date(year, month - 1, prevMonthDays - i),
          false,
          todayKey,
          selKey,
          minKey,
          maxKey,
          isRange,
          sKey,
          eKey,
          hKey,
        ),
      );
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(
        this._buildDay(
          new Date(year, month, d),
          true,
          todayKey,
          selKey,
          minKey,
          maxKey,
          isRange,
          sKey,
          eKey,
          hKey,
        ),
      );
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push(
        this._buildDay(
          new Date(year, month + 1, d),
          false,
          todayKey,
          selKey,
          minKey,
          maxKey,
          isRange,
          sKey,
          eKey,
          hKey,
        ),
      );
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

  navMonth(delta: number): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  openMonthView(): void {
    this._view.set('month');
  }

  openYearView(): void {
    this._yearRangeStart.set(this._viewDate().getFullYear() - 4);
    this._view.set('year');
  }

  selectMonth(m: number): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear(), m, 1));
    this._view.set('day');
  }

  selectYear(y: number): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(y, d.getMonth(), 1));
    this._view.set('month');
  }

  navYear(delta: number): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear() + delta, d.getMonth(), 1));
  }

  navYearRange(delta: number): void {
    this._yearRangeStart.update((v) => v + delta);
  }

  selectDay(day: CalendarDay): void {
    if (day.dis) return;
    this.dateSelect.emit(day.date);
  }

  onDayHover(day: CalendarDay): void {
    if (this.mode() === 'range' && !day.dis) {
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
    todayKey: number,
    selectedKey: number,
    minKey: number,
    maxKey: number,
    isRange: boolean,
    sKey: number,
    eKey: number,
    hKey: number,
  ): CalendarDay {
    const dk = this._dk(date);
    const dis = (minKey > 0 && dk < minKey) || (maxKey > 0 && dk > maxKey);

    let rs = false,
      re = false,
      ir = false;
    if (isRange && sKey) {
      if (eKey) {
        rs = dk === sKey;
        re = dk === eKey;
        ir = dk > sKey && dk < eKey;
      } else if (hKey) {
        const lo = Math.min(sKey, hKey),
          hi = Math.max(sKey, hKey);
        rs = dk === lo;
        re = dk === hi;
        ir = dk > lo && dk < hi;
      } else {
        rs = dk === sKey;
      }
    }

    let cls = 'bloc-dp-d';
    if (!isCurrentMonth) cls += ' bloc-dp-d--oth';
    if (dk === todayKey) cls += ' bloc-dp-d--tod';
    if (dk === selectedKey) cls += ' bloc-dp-d--sel';
    if (dis) cls += ' bloc-dp-d--dis';
    if (rs) cls += ' bloc-dp-d--rs';
    if (re) cls += ' bloc-dp-d--re';
    if (ir) cls += ' bloc-dp-d--ir';

    return { date, day: date.getDate(), cls, dis };
  }

  /** Date → numeric key yyyymmdd for fast comparison */
  private _dk(d: Date): number {
    return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
  }
}
