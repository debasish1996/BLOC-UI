import { InjectionToken, Signal } from '@angular/core';

/** @internal Contract the group component exposes to individual radio items. */
export interface BlocRadioGroupRef {
    readonly value: Signal<unknown>;
    readonly isGroupDisabled: Signal<boolean>;
    readonly labelPosition: Signal<'before' | 'after'>;
    select(val: unknown): void;
    markTouched(): void;
}

/** @internal Injection token that links radio items to their parent group. */
export const BLOC_RADIO_GROUP = new InjectionToken<BlocRadioGroupRef>('BLOC_RADIO_GROUP');
