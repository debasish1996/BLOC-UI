import { NgModule } from '@angular/core';
import { BlocDatePickerTriggerDirective } from './date-picker-trigger.directive';
import { BlocDateRangePickerTriggerDirective } from './date-range-picker-trigger.directive';

@NgModule({
  imports: [BlocDatePickerTriggerDirective, BlocDateRangePickerTriggerDirective],
  exports: [BlocDatePickerTriggerDirective, BlocDateRangePickerTriggerDirective],
})
export class BlocDatePickerModule {}
