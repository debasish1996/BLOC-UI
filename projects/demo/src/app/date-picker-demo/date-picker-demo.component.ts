import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocDatePickerComponent } from '@bloc-ui/date-picker';
import { BlocButtonComponent } from 'bloc-ui-core';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-date-picker-demo',
  standalone: true,
  imports: [BlocDatePickerComponent, BlocButtonComponent, FormsModule, ReactiveFormsModule, SampleCodeComponent],
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
    basic: `<bloc-date-picker />`,
    placeholder: `<bloc-date-picker placeholder="Pick a date" />`,
    sizeSmall: `<bloc-date-picker size="sm" />`,
    sizeLarge: `<bloc-date-picker size="lg" />`,
    ngModel: `<bloc-date-picker [(ngModel)]="selectedDate" />`,
    formControl: `<bloc-date-picker [formControl]="dateCtrl" />`,
    disabled: `<bloc-date-picker [formControl]="disabledCtrl" />\n<!-- disabledCtrl.disable(); -->`,
    minMax: `<bloc-date-picker\n  [minDate]="minDate"\n  [maxDate]="maxDate" />`,
    format: `<bloc-date-picker format="dd/MM/yyyy" />`,
    customToken: `<bloc-date-picker\n  style="--bloc-date-picker-focus-border: #16a34a;\n         --bloc-date-picker-selected-bg: #16a34a" />`,
  };
}
