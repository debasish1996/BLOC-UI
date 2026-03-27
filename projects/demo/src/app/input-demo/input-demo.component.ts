import { Component, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
} from '@angular/forms';
import {
    BlocInputDirective,
    BlocInputGroupDirective,
    BlocPrefixDirective,
    BlocSuffixDirective,
    BlocInputErrorDirective,
} from 'bloc-ui-core';
import { IconComponent } from '../icon/icon.component';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-input-demo',
    standalone: true,
    imports: [
        BlocInputDirective,
        BlocInputGroupDirective,
        BlocPrefixDirective,
        BlocSuffixDirective,
        BlocInputErrorDirective,
        IconComponent,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
    readonly name = signal('');

    // Template-driven (ngModel)
    ngModelValue = '';

    /** Touched + invalid → shows error border automatically */
    readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);

    // Reactive — required field
    readonly requiredCtrl = new FormControl('', [Validators.required]);

    // FormGroup with formControlName
    readonly userFormGroup = new FormGroup({
        username: new FormControl('', [Validators.required]),
    });

    readonly snippets = {
        text: `<input blocInput type="text"\n  placeholder="Enter your name" />`,
        password: `<input blocInput type="password"\n  placeholder="Enter password" />`,
        noLabel: `<input blocInput type="search"\n  placeholder="Search..." />`,
        disabled: `<input blocInput type="text"\n  placeholder="Cannot edit" disabled />`,
        customToken: `<!-- Pill radius -->\n<input blocInput type="text"\n  style="--bloc-input-radius: 999px" />\n<!-- Emerald focus ring -->\n<input blocInput type="text"\n  style="--bloc-input-focus-ring: #10b981" />`,
        prefix: `<bloc-input-group>\n  <bloc-prefix>🔍</bloc-prefix>\n  <input blocInput type="search"\n    placeholder="Search..." />\n</bloc-input-group>`,
        suffix: `<bloc-input-group>\n  <input blocInput type="email"\n    placeholder="Enter email" />\n  <bloc-suffix>✉</bloc-suffix>\n</bloc-input-group>`,
        prefixSuffix: `<bloc-input-group>\n  <bloc-prefix>🔍</bloc-prefix>\n  <input blocInput type="text"\n    placeholder="Search..." />\n  <bloc-suffix>✕</bloc-suffix>\n</bloc-input-group>`,
        attrSelector: `<div blocInputGroup>\n  <span blocPrefix>🔒</span>\n  <input blocInput type="password"\n    placeholder="Enter password" />\n  <span blocSuffix>👁</span>\n</div>`,
        errorManual: `<input blocInput [error]="true" />\n<bloc-input-error>\n  This field is required.\n</bloc-input-error>`,
        errorFormControl: `<input blocInput type="email"\n  [formControl]="emailCtrl" />\n@if (emailCtrl.invalid && emailCtrl.touched) {\n  <bloc-input-error>\n    Please enter a valid email.\n  </bloc-input-error>\n}`,
        ngModel: `<input blocInput type="text"\n  [(ngModel)]="value"\n  placeholder="Type something" />\n<p>Value: {{ value }}</p>`,
        formControlRequired: `<input blocInput type="text"\n  [formControl]="requiredCtrl"\n  placeholder="Required field" />\n@if (requiredCtrl.invalid && requiredCtrl.touched) {\n  <bloc-input-error>This field is required.</bloc-input-error>\n}`,
        formControlName: `<form [formGroup]="userFormGroup">\n  <input blocInput type="text"\n    formControlName="username"\n    placeholder="Username" />\n  @if (userFormGroup.get('username')?.invalid &&\n       userFormGroup.get('username')?.touched) {\n    <bloc-input-error>Username is required.</bloc-input-error>\n  }\n</form>`,
    };
}
