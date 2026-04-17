import { InjectionToken } from '@angular/core';

import type { BlocOptionDirective } from './option.directive';

export interface BlocSelectRef {
    isOptionSelected(option: BlocOptionDirective): boolean;
    isOptionActive(option: BlocOptionDirective): boolean;
    isOptionHidden(option: BlocOptionDirective): boolean;
    isSelectDisabled(): boolean;
    setActiveOption(option: BlocOptionDirective): void;
    selectOption(option: BlocOptionDirective): void;
}

export const BLOC_SELECT = new InjectionToken<BlocSelectRef>('BLOC_SELECT');
