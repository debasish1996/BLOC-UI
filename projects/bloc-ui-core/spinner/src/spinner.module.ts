import { NgModule } from '@angular/core';
import { BlocSpinnerDirective } from './spinner.directive';

@NgModule({
    imports: [BlocSpinnerDirective],
    exports: [BlocSpinnerDirective],
})
export class BlocSpinnerModule {}
