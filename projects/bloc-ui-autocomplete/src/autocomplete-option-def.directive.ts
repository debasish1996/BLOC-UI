import { Directive, TemplateRef, inject } from '@angular/core';
import { BlocAutocompleteOption } from './autocomplete.component';

export interface BlocAutocompleteOptionContext<T = string> {
    $implicit: BlocAutocompleteOption<T>;
    query: string;
}

@Directive({
    selector: 'ng-template[blocAutocompleteOptionDef]',
    standalone: true,
})
export class BlocAutocompleteOptionDef<T = string> {
    readonly templateRef = inject(TemplateRef<BlocAutocompleteOptionContext<T>>);
}
