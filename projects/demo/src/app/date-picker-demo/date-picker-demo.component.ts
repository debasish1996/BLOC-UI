import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocDatePickerComponent, BlocDatePickerTriggerDirective } from '@bloc-ui/date-picker';
import { BlocButtonComponent } from 'bloc-ui-core';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-date-picker-demo',
  standalone: true,
  imports: [BlocDatePickerComponent, BlocDatePickerTriggerDirective, BlocButtonComponent, FormsModule, ReactiveFormsModule, SampleCodeComponent, IconComponent],
  templateUrl: './date-picker-demo.component.html',
})
export class DatePickerDemoComponent {
  // ngModel
  ngModelDate: Date | null = null;

  // Reactive
  readonly dateCtrl = new FormControl<Date | null>(null);
  readonly disabledCtrl = new FormControl<Date | null>(new Date());

  // Min/max demo
  readonly minDate = new Date(2024, 0, 1);
  readonly maxDate = new Date(2026, 11, 31);

  // Trigger directive demos
  triggerDate: Date | null = null;
  readonly triggerCtrl = new FormControl<Date | null>(null);

  constructor() {
    this.disabledCtrl.disable();
  }

  toggleDisabled(): void {
    this.disabledCtrl.disabled ? this.disabledCtrl.enable() : this.disabledCtrl.disable();
  }

  readonly snippets = {
    basic: `<bloc-date-picker>\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>`,
    placeholder: `<bloc-date-picker placeholder="Pick a date">\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>`,
    ngModel: `<bloc-date-picker [(ngModel)]="selectedDate">\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>`,
    formControl: `<bloc-date-picker [formControl]="dateCtrl">\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>`,
    disabled: `<bloc-date-picker [formControl]="disabledCtrl">\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>\n<!-- disabledCtrl.disable(); -->`,
    minMax: `<bloc-date-picker\n  [minDate]="minDate"\n  [maxDate]="maxDate">\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>`,
    format: `<bloc-date-picker format="dd/MM/yyyy">\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>`,
    customToken: `<bloc-date-picker\n  style="--bloc-date-picker-focus-border: #16a34a;\n         --bloc-date-picker-selected-bg: #16a34a">\n  <my-icon blocDatePickerIcon />\n</bloc-date-picker>`,
    triggerBasic: `<button blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Pick a date' }}\n</button>`,
    triggerCustom: `<div blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  #picker="blocDatePickerTrigger"\n  class="my-trigger">\n  <my-icon name="calendar" />\n  {{ picker.displayValue() || 'Choose date' }}\n</div>`,
    triggerFormControl: `<button blocDatePickerTrigger\n  [formControl]="dateCtrl"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Select date' }}\n</button>`,
    triggerMinMax: `<button blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  [minDate]="minDate"\n  [maxDate]="maxDate"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Pick a date' }}\n</button>`,
  };
}
