import { NgModule } from '@angular/core';
import { BlocDatePickerTriggerDirective } from './date-picker-trigger.directive';

@NgModule({
    imports: [BlocDatePickerTriggerDirective],
    exports: [BlocDatePickerTriggerDirective],
})
export class BlocDatePickerModule {}
