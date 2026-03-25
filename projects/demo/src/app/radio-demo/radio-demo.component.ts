import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocRadioComponent, BlocRadioGroupComponent } from 'bloc-ui';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-radio-demo',
  standalone: true,
  imports: [BlocRadioGroupComponent, BlocRadioComponent, BlocButtonComponent, FormsModule, ReactiveFormsModule, SampleCodeComponent],
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

  readonly snippets = {
    sizeSmall: `<bloc-radio-group>\n  <bloc-radio value="a" size="sm">Option A</bloc-radio>\n  <bloc-radio value="b" size="sm">Option B</bloc-radio>\n</bloc-radio-group>`,
    sizeMedium: `<bloc-radio-group>\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
    sizeLarge: `<bloc-radio-group>\n  <bloc-radio value="a" size="lg">Option A</bloc-radio>\n  <bloc-radio value="b" size="lg">Option B</bloc-radio>\n</bloc-radio-group>`,
    groupDisabled: `<bloc-radio-group [disabled]="true">\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
    itemDisabled: `<bloc-radio-group>\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b" [disabled]="true">\n    Option B (disabled)\n  </bloc-radio>\n  <bloc-radio value="c">Option C</bloc-radio>\n</bloc-radio-group>`,
    labelAfter: `<bloc-radio-group>\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
    labelBefore: `<bloc-radio-group labelPosition="before">\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
    perItem: `<bloc-radio-group>\n  <bloc-radio value="a" labelPosition="before">\n    Before\n  </bloc-radio>\n  <bloc-radio value="b">After</bloc-radio>\n</bloc-radio-group>`,
    horizontal: `<bloc-radio-group class="flex-row! flex-wrap"\n  style="--bloc-radio-group-gap: 16px">\n  <bloc-radio value="xs">XS</bloc-radio>\n  <bloc-radio value="sm">SM</bloc-radio>\n  <bloc-radio value="md">MD</bloc-radio>\n</bloc-radio-group>`,
    ngModel: `<bloc-radio-group [(ngModel)]="selected">\n  <bloc-radio value="apple">Apple</bloc-radio>\n  <bloc-radio value="banana">Banana</bloc-radio>\n  <bloc-radio value="cherry">Cherry</bloc-radio>\n</bloc-radio-group>`,
    formControl: `<bloc-radio-group [formControl]="sizeCtrl">\n  <bloc-radio value="xs">Extra small</bloc-radio>\n  <bloc-radio value="sm">Small</bloc-radio>\n  <bloc-radio value="md">Medium</bloc-radio>\n</bloc-radio-group>`,
    setDisabled: `<!-- disable from code -->\nctrl = new FormControl('b');\nctrl.disable();`,
    customToken: `<bloc-radio-group\n  style="--bloc-radio-checked-border: #3b82f6;\n         --bloc-radio-dot-color: #3b82f6;\n         --bloc-radio-focus-ring: #3b82f6">\n  <bloc-radio value="xs">Extra small</bloc-radio>\n  <bloc-radio value="sm">Small</bloc-radio>\n</bloc-radio-group>`,
  };
}
