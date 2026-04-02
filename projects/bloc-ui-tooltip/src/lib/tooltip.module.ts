import { NgModule } from '@angular/core';
import { BlocTooltipDirective } from './tooltip.directive';

@NgModule({
    imports: [BlocTooltipDirective],
    exports: [BlocTooltipDirective],
})
export class TooltipModule {}
