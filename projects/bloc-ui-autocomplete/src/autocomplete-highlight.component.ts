import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';

import { BlocAutocompleteComponent, BlocAutocompleteOption } from './autocomplete.component';
import { BlocAutocompleteOptionDef } from './autocomplete-option-def.directive';

/**
 * Drop-in replacement for `<bloc-autocomplete>` that automatically highlights
 * matching query text in every option label and description.
 *
 * ```html
 * <bloc-autocomplete-highlight [options]="teamOptions" />
 * ```
 */
@Component({
    selector: 'bloc-autocomplete-highlight',
    standalone: true,
    imports: [BlocAutocompleteComponent, BlocAutocompleteOptionDef, BlocTextHighlightDirective],
    encapsulation: ViewEncapsulation.None,
    template: `
        <bloc-autocomplete
            [options]="options()"
            [placeholder]="placeholder()"
            [emptyText]="emptyText()"
            [loadingText]="loadingText()"
            [clearable]="clearable()"
            [loading]="loading()"
            [disabled]="disabled()"
            (selectionChange)="selectionChange.emit($event)"
        >
            <ng-template blocAutocompleteOptionDef let-option let-query="query">
                <span [blocTextHighlight]="option.label" [query]="query"></span>
                @if (option.description) {
                    <small [blocTextHighlight]="option.description" [query]="query"></small>
                }
            </ng-template>
        </bloc-autocomplete>
    `,
})
export class BlocAutocompleteHighlightComponent<T = string> {
    readonly options = input<readonly BlocAutocompleteOption<T>[]>([]);
    readonly placeholder = input('Search options');
    readonly emptyText = input('No results found');
    readonly loadingText = input('Loading options...');
    readonly clearable = input(false);
    readonly loading = input(false);
    readonly disabled = input(false);
    readonly selectionChange = output<T | null>();
}
