import { NgModule } from '@angular/core';

import { BlocOptionDirective } from './option.directive';
import { BlocSelectComponent } from './select.component';

@NgModule({
    imports: [BlocSelectComponent, BlocOptionDirective],
    exports: [BlocSelectComponent, BlocOptionDirective],
})
export class BlocSelectModule {}
