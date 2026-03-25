import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocCheckboxComponent } from 'bloc-ui';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [BlocCheckboxComponent, BlocButtonComponent, FormsModule, ReactiveFormsModule, SampleCodeComponent],
  templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent {
  // Template-driven (ngModel)
  ngModelValue = false;

  // Reactive — enabled
  readonly reactiveCtrl = new FormControl(false);

  // Reactive — initially checked and disabled
  readonly disabledCtrl = new FormControl(true);

  readonly snippets = {
    sizeSmall: `<bloc-checkbox size="sm">Accept terms</bloc-checkbox>`,
    sizeMedium: `<bloc-checkbox>Accept terms</bloc-checkbox>`,
    sizeLarge: `<bloc-checkbox size="lg">Accept terms</bloc-checkbox>`,
    default: `<bloc-checkbox>Remember me</bloc-checkbox>`,
    disabled: `<bloc-checkbox [disabled]="true">Unavailable</bloc-checkbox>`,
    disabledChecked: `<bloc-checkbox [formControl]="ctrl">\n  Locked on\n</bloc-checkbox>`,
    labelAfter: `<bloc-checkbox>Enable notifications</bloc-checkbox>`,
    labelBefore: `<bloc-checkbox labelPosition="before">\n  Enable notifications\n</bloc-checkbox>`,
    ngModel: `<bloc-checkbox [(ngModel)]="isChecked">\n  {{ isChecked ? 'Checked' : 'Unchecked' }}\n</bloc-checkbox>`,
    formControl: `<bloc-checkbox [formControl]="myCtrl">\n  {{ myCtrl.value ? 'Agreed' : 'Not agreed' }}\n</bloc-checkbox>`,
    setDisabled: `<!-- disable from code -->\nctrl = new FormControl(true);\nctrl.disable();`,
    customToken: `<bloc-checkbox\n  style="--bloc-checkbox-checked-bg: #3b82f6;\n         --bloc-checkbox-checked-border: #3b82f6;\n         --bloc-checkbox-focus-ring: #3b82f6">\n  Blue checkbox\n</bloc-checkbox>`,
  };

  constructor() {
    this.disabledCtrl.disable();
  }

  toggleDisabled(): void {
    this.disabledCtrl.disabled
      ? this.disabledCtrl.enable()
      : this.disabledCtrl.disable();
  }
}
