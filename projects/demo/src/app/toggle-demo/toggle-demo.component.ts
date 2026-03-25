import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocToggleComponent } from 'bloc-ui-core';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-toggle-demo',
  standalone: true,
  imports: [BlocToggleComponent, BlocButtonComponent, FormsModule, ReactiveFormsModule, SampleCodeComponent],
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

  readonly snippets = {
    sizeSmall: `<bloc-toggle size="sm"></bloc-toggle>`,
    sizeMedium: `<bloc-toggle></bloc-toggle>`,
    sizeLarge: `<bloc-toggle size="lg"></bloc-toggle>`,
    default: `<bloc-toggle></bloc-toggle>`,
    disabledOff: `<bloc-toggle [disabled]="true"></bloc-toggle>`,
    disabledOn: `<bloc-toggle [formControl]="ctrl"></bloc-toggle>\n<!-- ctrl = new FormControl(true); ctrl.disable(); -->`,
    labelAfter: `<bloc-toggle>Enable notifications</bloc-toggle>`,
    labelBefore: `<bloc-toggle labelPosition="before">\n  Enable notifications\n</bloc-toggle>`,
    ngModel: `<bloc-toggle [(ngModel)]="isOn">\n  Label text\n</bloc-toggle>`,
    formControl: `<bloc-toggle [formControl]="myCtrl">\n  Label text\n</bloc-toggle>`,
    setDisabled: `<!-- disable from code -->\nctrl = new FormControl(true);\nctrl.disable();`,
    customToken: `<bloc-toggle\n  style="--bloc-toggle-track-checked-bg: #3bf6a2;\n         --bloc-toggle-focus-ring: #3b82f6">\n  Green track\n</bloc-toggle>`,
  };
}
