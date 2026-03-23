import { Component, input, output, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'bloc-input',
  standalone: true,
  imports: [],
  template: `
    <label class="bloc-input" [class.bloc-input--disabled]="disabled()">
      @if (label()) {
        <span class="bloc-input__label">{{ label() }}</span>
      }
      <input
        class="bloc-input__field"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .bloc-input {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .bloc-input__label {
        font-size: 13px;
        font-weight: 500;
      }
      .bloc-input__field {
        border: 1px solid var(--bloc-border, #cbd5e1);
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 14px;
        outline: none;
        &:focus {
          border-color: var(--bloc-primary, #3b82f6);
        }
      }
      .bloc-input--disabled .bloc-input__field {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BlocInputComponent),
      multi: true,
    },
  ],
})
export class BlocInputComponent implements ControlValueAccessor {
  /** Input label text. */
  readonly label = input<string>('');

  /** Input placeholder text. */
  readonly placeholder = input<string>('');

  /** Input type attribute. */
  readonly type = input<string>('text');

  /** Whether the input is disabled. */
  readonly disabled = input<boolean>(false);

  /** Two-way bound value. */
  readonly value = model<string>('');

  /** Emits on value change. */
  readonly valueChange = output<string>();

  private onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
