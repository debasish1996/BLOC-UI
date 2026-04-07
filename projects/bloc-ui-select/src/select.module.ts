import { NgModule } from '@angular/core';

import { BlocOptionDirective } from './option.directive';
import { BlocSelectComponent } from './select.component';
import { BlocSelectEmptyDirective, BlocSelectIconDirective, BlocSelectLoadingDirective } from './select-templates.directive';

@NgModule({
    imports: [BlocSelectComponent, BlocOptionDirective, BlocSelectLoadingDirective, BlocSelectEmptyDirective, BlocSelectIconDirective],
    exports: [BlocSelectComponent, BlocOptionDirective, BlocSelectLoadingDirective, BlocSelectEmptyDirective, BlocSelectIconDirective],
})
export class BlocSelectModule {}
