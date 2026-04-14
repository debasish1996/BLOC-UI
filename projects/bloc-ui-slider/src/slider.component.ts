import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'bloc-slider',
    standalone: true,
    template: `
        @if (label() || showValue()) {
            <div class="bloc-slider__meta">
                @if (label()) {
                    <label class="bloc-slider__label">{{ label() }}</label>
                }
                @if (showValue()) {
                    <span class="bloc-slider__value">{{ value() }}</span>
                }
            </div>
        }

        <input
            class="bloc-slider__input"
            type="range"
            [min]="min()"
            [max]="max()"
            [step]="step()"
            [disabled]="isDisabled()"
            [value]="value()"
            [style.background]="trackBackground()"
            (input)="onInput($event)"
            (blur)="markAsTouched()"
        />
    `,
    styleUrl: './slider.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BlocSliderComponent),
            multi: true,
        },
    ],
})
export class BlocSliderComponent implements ControlValueAccessor {
    readonly min = input(0);
    readonly max = input(100);
    readonly step = input(1);
    readonly label = input('');
    readonly showValue = input(true);
    readonly disabled = input(false);
    readonly valueChange = output<number>();

    readonly value = signal(0);
    readonly isDisabled = computed(() => this.disabled() || this._formsDisabled());
    readonly trackBackground = computed(() => {
        const range = Math.max(1, this.max() - this.min());
        const percent = ((this.value() - this.min()) / range) * 100;
        return `linear-gradient(90deg, var(--bloc-slider-fill, var(--bloc-primary, #6b7280)) 0%, var(--bloc-slider-fill, var(--bloc-primary, #6b7280)) ${percent}%, var(--bloc-slider-track, #dbe3ee) ${percent}%, var(--bloc-slider-track, #dbe3ee) 100%)`;
    });

    private readonly _formsDisabled = signal(false);
    private onChange: (value: number) => void = () => undefined;
    private onTouched: () => void = () => undefined;

    writeValue(value: number | null): void {
        this.value.set(this._clamp(value ?? this.min()));
    }

    registerOnChange(fn: (value: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._formsDisabled.set(isDisabled);
    }

    onInput(event: Event): void {
        const next = this._clamp(Number((event.target as HTMLInputElement).value));
        this.value.set(next);
        this.onChange(next);
        this.valueChange.emit(next);
    }

    markAsTouched(): void {
        this.onTouched();
    }

    private _clamp(value: number): number {
        return Math.min(Math.max(value, this.min()), this.max());
    }
}
