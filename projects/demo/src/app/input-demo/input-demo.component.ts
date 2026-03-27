import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
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
        ReactiveFormsModule,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
    readonly name = signal('');

    /** Touched + invalid → shows error border automatically */
    readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);

    readonly snippets = {
        text: `<input blocInput type="text"\n  placeholder="Enter your name" />`,
        password: `<input blocInput type="password"\n  placeholder="Enter password" />`,
        noLabel: `<input blocInput type="search"\n  placeholder="Search..." />`,
        disabled: `<input blocInput type="text"\n  placeholder="Cannot edit" disabled />`,
        customToken: `<input blocInput type="text"\n  style="--bloc-input-radius: 999px" />`,
        prefix: `<bloc-input-group>\n  <bloc-prefix>🔍</bloc-prefix>\n  <input blocInput type="search"\n    placeholder="Search..." />\n</bloc-input-group>`,
        suffix: `<bloc-input-group>\n  <input blocInput type="email"\n    placeholder="Enter email" />\n  <bloc-suffix>✉</bloc-suffix>\n</bloc-input-group>`,
        prefixSuffix: `<bloc-input-group>\n  <bloc-prefix>🔍</bloc-prefix>\n  <input blocInput type="text"\n    placeholder="Search..." />\n  <bloc-suffix>✕</bloc-suffix>\n</bloc-input-group>`,
        attrSelector: `<div blocInputGroup>\n  <span blocPrefix>🔒</span>\n  <input blocInput type="password"\n    placeholder="Enter password" />\n  <span blocSuffix>👁</span>\n</div>`,
        errorManual: `<input blocInput [error]="true" />\n<bloc-input-error>\n  This field is required.\n</bloc-input-error>`,
        errorFormControl: `<input blocInput type="email"\n  [formControl]="emailCtrl" />\n@if (emailCtrl.invalid && emailCtrl.touched) {\n  <bloc-input-error>\n    Please enter a valid email.\n  </bloc-input-error>\n}`,
    };
}
