import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BlocCalendarPanelComponent } from './calendar-panel.component';

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
  imports: [BlocCalendarPanelComponent],
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
        <ng-content select="[blocDatePickerIcon]" />
      </span>
    </div>

    @if (isOpen()) {
      <div class="bloc-date-picker__dropdown" role="dialog" aria-label="Date picker">
        <bloc-calendar-panel
          [selectedDate]="_selectedDate()"
          [minDate]="minDate()"
          [maxDate]="maxDate()"
          (dateSelect)="_onDateSelect($event)"
          (cleared)="_onClear()" />
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
    '[class.bloc-date-picker--upward]': '_openUpward()',
  },
})
export class BlocDatePickerComponent implements ControlValueAccessor {
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _panel = viewChild(BlocCalendarPanelComponent);

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

  /** Currently selected date. */
  readonly _selectedDate = signal<Date | null>(null);

  /** Whether the calendar dropdown is open. */
  readonly isOpen = signal<boolean>(false);

  /** Whether the dropdown should open upward (set on each open based on available viewport space). */
  readonly _openUpward = signal<boolean>(false);

  private readonly _formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  private _onChange: (val: Date | null) => void = () => { };
  _onTouched: () => void = () => { };

  readonly displayValue = computed(() => {
    const d = this._selectedDate();
    if (!d) return '';
    return this._formatDate(d);
  });

  toggleCalendar(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      const rect = this._el.nativeElement.getBoundingClientRect();
      this._openUpward.set(window.innerHeight - rect.bottom < 320);
      // Reset panel view when opening
      queueMicrotask(() => this._panel()?.resetView(this._selectedDate()));
    }
  }

  _onDateSelect(date: Date): void {
    this._selectedDate.set(date);
    this._onChange(date);
    this.isOpen.set(false);
  }

  _onClear(): void {
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
