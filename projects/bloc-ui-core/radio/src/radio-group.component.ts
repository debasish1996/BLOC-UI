import { Component, ViewEncapsulation, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BLOC_RADIO_GROUP, BlocRadioGroupRef } from './radio.token';

/**
 * Container component that groups `<bloc-radio>` items and implements
 * `ControlValueAccessor` so the group works with both `ngModel` and
 * reactive forms.
 *
 * ```html
 * <bloc-radio-group [(ngModel)]="chosen">
 *   <bloc-radio value="a">Option A</bloc-radio>
 *   <bloc-radio value="b">Option B</bloc-radio>
 * </bloc-radio-group>
 * ```
 */
@Component({
    selector: 'bloc-radio-group',
    standalone: true,
    template: `<ng-content />`,
    styles: [
        `
            bloc-radio-group {
                display: flex;
                flex-direction: column;
                gap: var(--bloc-radio-group-gap, 8px);
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BlocRadioGroupComponent),
            multi: true,
        },
        {
            provide: BLOC_RADIO_GROUP,
            useExisting: forwardRef(() => BlocRadioGroupComponent),
        },
    ],
    host: {
        role: 'radiogroup',
        '[class.bloc-radio-group]': 'true',
        '[class.bloc-radio-group--disabled]': 'isGroupDisabled()',
    },
})
export class BlocRadioGroupComponent implements ControlValueAccessor, BlocRadioGroupRef {
    /** Disables every radio item in the group. */
    readonly disabled = input<boolean>(false);

    /** Default label position inherited by child radios. Defaults to `'after'`. */
    readonly labelPosition = input<'before' | 'after'>('after');

    /** @internal Currently selected value — readable by child radio items. */
    readonly value = signal<unknown>(null);

    private readonly _formDisabled = signal<boolean>(false);

    /** Merged disabled state: either the `disabled` input or the form control. */
    readonly isGroupDisabled = computed(() => this.disabled() || this._formDisabled());

    private _onChange: (val: unknown) => void = () => {};

    /** @internal Touch callback — called from each child radio's blur event. */
    markTouched: () => void = () => {};

    // — ControlValueAccessor —

    writeValue(val: unknown): void {
        this.value.set(val);
    }

    registerOnChange(fn: (val: unknown) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.markTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._formDisabled.set(isDisabled);
    }

    /** @internal Called by child radio items on selection. */
    select(val: unknown): void {
        this.value.set(val);
        this._onChange(val);
    }
}
