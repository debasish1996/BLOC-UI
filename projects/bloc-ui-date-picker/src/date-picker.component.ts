import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

/**
 * Date picker component with calendar dropdown.
 *
 * ```html
 * <bloc-date-picker [(ngModel)]="selectedDate" />
 * <bloc-date-picker [formControl]="dateCtrl" placeholder="Choose date" />
 * ```
 */
@Component({
  selector: 'bloc-date-picker',
  standalone: true,
  template: `
    <div class="bloc-date-picker__input-wrapper" (click)="toggleCalendar()">
      <input
        class="bloc-date-picker__input"
        type="text"
        readonly
        [value]="displayValue()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="dialog" />
      <span class="bloc-date-picker__icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
          <line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" stroke-width="1.3"/>
          <line x1="5" y1="1.5" x2="5" y2="4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          <line x1="11" y1="1.5" x2="11" y2="4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </span>
    </div>

    @if (isOpen()) {
      <div class="bloc-date-picker__dropdown" role="dialog" aria-label="Date picker">
        <div class="bloc-date-picker__header">
          <button type="button" class="bloc-date-picker__nav" (click)="prevMonth()" aria-label="Previous month">
            &#8249;
          </button>
          <span class="bloc-date-picker__month-year">
            {{ monthYearLabel() }}
          </span>
          <button type="button" class="bloc-date-picker__nav" (click)="nextMonth()" aria-label="Next month">
            &#8250;
          </button>
        </div>

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
              [disabled]="day.isDisabled"
              (click)="selectDay(day)">
              {{ day.day }}
            </button>
          }
        </div>

        <div class="bloc-date-picker__footer">
          <button type="button" class="bloc-date-picker__today-btn" (click)="goToToday()">
            Today
          </button>
          @if (_selectedDate()) {
            <button type="button" class="bloc-date-picker__clear-btn" (click)="clear()">
              Clear
            </button>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BlocDatePickerComponent),
      multi: true,
    },
  ],
  host: {
    '[class.bloc-date-picker]': 'true',
    '[class.bloc-date-picker--disabled]': 'isDisabled()',
    '[class.bloc-date-picker--open]': 'isOpen()',
  },
})
export class BlocDatePickerComponent implements ControlValueAccessor {
  private readonly _el = inject(ElementRef<HTMLElement>);

  /** Placeholder text for the input. */
  readonly placeholder = input<string>('Select date');

  /** Date format for display. Defaults to `'yyyy-MM-dd'`. */
  readonly format = input<string>('yyyy-MM-dd');

  /** Disable the date picker via template binding. */
  readonly disabled = input<boolean>(false);

  /** Minimum selectable date. */
  readonly minDate = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly maxDate = input<Date | null>(null);

  readonly weekdays = DAYS_OF_WEEK;

  /** Currently selected date. */
  readonly _selectedDate = signal<Date | null>(null);

  /** Whether the calendar dropdown is open. */
  readonly isOpen = signal<boolean>(false);

  /** The month being viewed (year + month). */
  readonly _viewDate = signal<Date>(new Date());

  private readonly _formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  private _onChange: (val: Date | null) => void = () => { };
  _onTouched: () => void = () => { };

  readonly displayValue = computed(() => {
    const d = this._selectedDate();
    if (!d) return '';
    return this._formatDate(d);
  });

  readonly monthYearLabel = computed(() => {
    const d = this._viewDate();
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const viewDate = this._viewDate();
    const selected = this._selectedDate();
    const today = new Date();
    const min = this.minDate();
    const max = this.maxDate();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: CalendarDay[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push(this._buildDay(date, false, today, selected, min, max));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      days.push(this._buildDay(date, true, today, selected, min, max));
    }

    // Fill remaining to complete 6 rows (42 cells)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push(this._buildDay(date, false, today, selected, min, max));
    }

    return days;
  });

  toggleCalendar(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      const selected = this._selectedDate();
      if (selected) {
        this._viewDate.set(new Date(selected.getFullYear(), selected.getMonth(), 1));
      }
    }
  }

  selectDay(day: CalendarDay): void {
    if (day.isDisabled) return;
    this._selectedDate.set(day.date);
    this._onChange(day.date);
    this.isOpen.set(false);
  }

  prevMonth(): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this._viewDate();
    this._viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  goToToday(): void {
    const today = new Date();
    this._selectedDate.set(today);
    this._viewDate.set(new Date(today.getFullYear(), today.getMonth(), 1));
    this._onChange(today);
    this.isOpen.set(false);
  }

  clear(): void {
    this._selectedDate.set(null);
    this._onChange(null);
  }

  @HostListener('document:click', ['$event'])
  _onDocClick(event: MouseEvent): void {
    if (!this._el.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown.escape')
  _onEsc(): void {
    this.isOpen.set(false);
  }

  // — ControlValueAccessor —

  writeValue(val: unknown): void {
    this._selectedDate.set(val instanceof Date ? val : val ? new Date(val as string) : null);
  }

  registerOnChange(fn: (val: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  // — Private helpers —

  private _buildDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    selected: Date | null,
    min: Date | null,
    max: Date | null,
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

    return { date, day: date.getDate(), isCurrentMonth, isToday, isSelected, isDisabled };
  }

  private _formatDate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    return this.format()
      .replace('yyyy', String(yyyy))
      .replace('MM', mm)
      .replace('dd', dd);
  }
}
