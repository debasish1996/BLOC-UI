import { NgModule } from '@angular/core';

import { BlocAutocompleteComponent } from './autocomplete.component';
import { BlocAutocompleteOptionDef } from './autocomplete-option-def.directive';
import { BlocAutocompleteHighlightComponent } from './autocomplete-highlight.component';
import { BlocAutocompleteFuzzySearch } from './autocomplete-fuzzy-search.directive';

@NgModule({
    imports: [
        BlocAutocompleteComponent,
        BlocAutocompleteOptionDef,
        BlocAutocompleteHighlightComponent,
        BlocAutocompleteFuzzySearch,
    ],
    exports: [
        BlocAutocompleteComponent,
        BlocAutocompleteOptionDef,
        BlocAutocompleteHighlightComponent,
        BlocAutocompleteFuzzySearch,
    ],
})
export class BlocAutocompleteModule {}
