import { InjectionToken, Signal } from '@angular/core';

/** @internal Contract the tab group exposes to individual tab items. */
export interface BlocTabGroupRef {
    readonly activeIndex: Signal<number>;
    select(index: number): void;
    register(): number;
}

/** @internal Injection token that links tab items to their parent group. */
export const BLOC_TAB_GROUP = new InjectionToken<BlocTabGroupRef>('BLOC_TAB_GROUP');
