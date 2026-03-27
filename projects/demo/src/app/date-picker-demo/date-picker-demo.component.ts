import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocDatePickerTriggerDirective } from '@bloc-ui/date-picker';
import { BlocButtonComponent } from 'bloc-ui-core';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-date-picker-demo',
  standalone: true,
  imports: [BlocDatePickerTriggerDirective, BlocButtonComponent, FormsModule, ReactiveFormsModule, SampleCodeComponent, IconComponent],
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

  constructor() {
    this.disabledCtrl.disable();
  }

  toggleDisabled(): void {
    this.disabledCtrl.disabled ? this.disabledCtrl.enable() : this.disabledCtrl.disable();
  }

  readonly snippets = {
    basic: `<button blocDatePickerTrigger\n  #picker="blocDatePickerTrigger">\n  <my-icon name="calendar" />\n  {{ picker.displayValue() || 'Pick a date' }}\n</button>`,
    ngModel: `<button blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Pick a date' }}\n</button>`,
    formControl: `<button blocDatePickerTrigger\n  [formControl]="dateCtrl"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Select date' }}\n</button>`,
    disabled: `<button blocDatePickerTrigger\n  [formControl]="disabledCtrl"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Disabled' }}\n</button>\n<!-- disabledCtrl.disable(); -->`,
    minMax: `<button blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  [minDate]="minDate"\n  [maxDate]="maxDate"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Pick a date' }}\n</button>`,
    format: `<button blocDatePickerTrigger\n  format="dd/MM/yyyy"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Pick a date' }}\n</button>`,
    customElement: `<div blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  #picker="blocDatePickerTrigger"\n  class="my-trigger">\n  <my-icon name="calendar" />\n  {{ picker.displayValue() || 'Choose date' }}\n</div>`,
    customToken: `<button blocDatePickerTrigger\n  style="--bloc-date-picker-selected-bg: #16a34a;\n         --bloc-date-picker-today-border: #16a34a"\n  #picker="blocDatePickerTrigger">\n  {{ picker.displayValue() || 'Green accent' }}\n</button>`,
  };
}
