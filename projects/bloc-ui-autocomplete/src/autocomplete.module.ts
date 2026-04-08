import { NgModule } from '@angular/core';

import { BlocAutocompleteComponent } from './autocomplete.component';
import { BlocAutocompleteOptionDef } from './autocomplete-option-def.directive';
import { BlocAutocompleteHighlightComponent } from './autocomplete-highlight.component';

@NgModule({
    imports: [
        BlocAutocompleteComponent,
        BlocAutocompleteOptionDef,
        BlocAutocompleteHighlightComponent,
    ],
    exports: [
        BlocAutocompleteComponent,
        BlocAutocompleteOptionDef,
        BlocAutocompleteHighlightComponent,
    ],
})
export class BlocAutocompleteModule {}
