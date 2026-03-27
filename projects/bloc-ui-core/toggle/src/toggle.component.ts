import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'bloc-toggle',
    standalone: true,
    template: `
        <span class="bloc-toggle__track">
            <span class="bloc-toggle__thumb"></span>
        </span>
        <ng-content />
    `,
    styleUrl: './toggle.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BlocToggleComponent),
            multi: true,
        },
    ],
    host: {
        role: 'switch',
        '[attr.aria-checked]': '_checked().toString()',
        '[attr.aria-disabled]': 'isDisabled() || null',
        '[attr.tabindex]': 'isDisabled() ? -1 : 0',
        '[class.bloc-toggle--sm]': 'size() === "sm"',
        '[class.bloc-toggle--lg]': 'size() === "lg"',
        '[class.bloc-toggle--checked]': '_checked()',
        '[class.bloc-toggle--disabled]': 'isDisabled()',
        '[class.bloc-toggle--label-before]': 'labelPosition() === "before"',
        '(click)': '_onHostClick()',
        '(keydown.space)': '_onSpace($event)',
        '(blur)': '_onTouched()',
    },
})
export class BlocToggleComponent implements ControlValueAccessor {
    /** Preset size of the toggle track. Defaults to `'md'`. */
    readonly size = input<'sm' | 'md' | 'lg'>('md');

    /** Position of the projected label relative to the toggle. Defaults to `'after'`. */
    readonly labelPosition = input<'before' | 'after'>('after');

    /**
     * Disable the toggle via template binding.
     * The Angular form can also disable it via `setDisabledState`.
     */
    readonly disabled = input<boolean>(false);

    protected readonly _checked = signal<boolean>(false);

    private readonly _formDisabled = signal<boolean>(false);

    /** Effective disabled state — true if either the `disabled` input or the form disables this control. */
    readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

    private _onChange: (val: boolean) => void = () => {};

    /**
     * CVA touched callback.
     * Exposed without `private` so the host `(blur)` binding can invoke it directly.
     */
    _onTouched: () => void = () => {};

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
