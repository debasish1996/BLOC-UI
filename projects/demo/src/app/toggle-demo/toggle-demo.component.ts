import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocToggleComponent } from 'bloc-ui';

@Component({
  selector: 'app-toggle-demo',
  standalone: true,
  imports: [BlocToggleComponent, BlocButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './toggle-demo.component.html',
})
export class ToggleDemoComponent {
  // Template-driven (ngModel)
  ngModelValue = false;

  // Reactive — enabled
  readonly reactiveCtrl = new FormControl(false);

  // Reactive — initially checked and disabled (setDisabledState demo)
  readonly disabledCtrl = new FormControl(true);

  constructor() {
    this.disabledCtrl.disable();
  }

  toggleDisabled(): void {
    this.disabledCtrl.disabled
      ? this.disabledCtrl.enable()
      : this.disabledCtrl.disable();
  }
}
