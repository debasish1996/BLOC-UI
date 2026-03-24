import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocRadioComponent, BlocRadioGroupComponent } from 'bloc-ui';

@Component({
  selector: 'app-radio-demo',
  standalone: true,
  imports: [BlocRadioGroupComponent, BlocRadioComponent, BlocButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent {
  // Template-driven
  ngModelValue: string = '';

  // Reactive — enabled
  readonly reactiveCtrl = new FormControl<string>('');

  // Reactive — disabled
  readonly disabledCtrl = new FormControl<string>('b');

  constructor() {
    this.disabledCtrl.disable();
  }

  toggleDisabled(): void {
    this.disabledCtrl.disabled
      ? this.disabledCtrl.enable()
      : this.disabledCtrl.disable();
  }
}
