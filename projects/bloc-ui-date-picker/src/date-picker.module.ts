import { NgModule } from '@angular/core';
import { BlocCalendarPanelComponent } from './calendar-panel.component';
import { BlocDatePickerComponent } from './date-picker.component';
import { BlocDatePickerTriggerDirective } from './date-picker-trigger.directive';

@NgModule({
  imports: [BlocCalendarPanelComponent, BlocDatePickerComponent, BlocDatePickerTriggerDirective],
  exports: [BlocCalendarPanelComponent, BlocDatePickerComponent, BlocDatePickerTriggerDirective],
})
export class BlocDatePickerModule { }
