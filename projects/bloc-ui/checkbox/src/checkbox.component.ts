import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'bloc-checkbox',
  standalone: true,
  template: `
    <span class="bloc-checkbox__box">
      <svg
        class="bloc-checkbox__check"
        viewBox="0 0 12 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="1.5 5 4.5 8 10.5 2"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <ng-content />
  `,
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BlocCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    role: 'checkbox',
    '[attr.aria-checked]': '_checked().toString()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[class.bloc-checkbox--sm]': 'size() === "sm"',
    '[class.bloc-checkbox--lg]': 'size() === "lg"',
    '[class.bloc-checkbox--checked]': '_checked()',
    '[class.bloc-checkbox--disabled]': 'isDisabled()',
    '[class.bloc-checkbox--label-before]': 'labelPosition() === "before"',
    '(click)': '_onHostClick()',
    '(keydown.space)': '_onSpace($event)',
    '(blur)': '_onTouched()',
  },
})
export class BlocCheckboxComponent implements ControlValueAccessor {
  /** Preset size of the checkbox. Defaults to `'md'`. */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  /** Position of the projected label relative to the checkbox. Defaults to `'after'`. */
  readonly labelPosition = input<'before' | 'after'>('after');

  /**
   * Disable the checkbox via template binding.
   * The Angular form can also disable it via `setDisabledState`.
   */
  readonly disabled = input<boolean>(false);

  protected readonly _checked = signal<boolean>(false);

  private readonly _formDisabled = signal<boolean>(false);

  /** Effective disabled state — true if either the `disabled` input or the form disables this control. */
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  private _onChange: (val: boolean) => void = () => { };

  _onTouched: () => void = () => { };

  // — ControlValueAccessor —

  writeValue(val: unknown): void {
    this._checked.set(!!val);
  }

  registerOnChange(fn: (val: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  // — Internal handlers —

  _onHostClick(): void {
    if (this.isDisabled()) return;
    this._toggle();
  }

  _onSpace(event: Event): void {
    event.preventDefault();
    if (this.isDisabled()) return;
    this._toggle();
  }

  private _toggle(): void {
    const next = !this._checked();
    this._checked.set(next);
    this._onChange(next);
  }
}
