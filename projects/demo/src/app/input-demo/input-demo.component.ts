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
import {
    ApiTableComponent,
    ApiColumnDef,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

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
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;
    readonly GROUP_DIRECTIVES_COLUMNS: ApiColumnDef[] = [
        { header: 'Directive / element', cellType: 'name' },
        { header: 'Selector', cellType: 'type' },
        { header: 'Description', cellType: 'description' },
    ];

    readonly inputs: string[][] = [
        [
            'error',
            'boolean',
            'false',
            'Forces the error border style. Auto-set when a bound form control is invalid and touched.',
    ],
        [
            'autocomplete',
            'string | null',
            'null',
            'Forwarded to the native <code>autocomplete</code> attribute. Pass <code>"off"</code> to suppress suggestions.',
    ],
    ];

    readonly groupDirectives: string[][] = [
        [
            'BlocInputGroupDirective',
            'bloc-input-group, [blocInputGroup]',
            'Wraps an input with prefix/suffix adornments and handles combined focus border.',
    ],
        [
            'BlocPrefixDirective',
            'bloc-prefix, [blocPrefix]',
            'Leading adornment slot inside a group.',
    ],
        [
            'BlocSuffixDirective',
            'bloc-suffix, [blocSuffix]',
            'Trailing adornment slot inside a group.',
    ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-input-border', '#cbd5e1', 'Default border colour.'],
        ['--bloc-input-focus-border', '--bloc-primary / #6b7280', 'Border colour on focus.'],
        ['--bloc-input-error-border', '--bloc-error / #f87171', 'Border colour in error state.'],
        ['--bloc-input-bg', '#ffffff', 'Input background.'],
        ['--bloc-input-color', '#374151', 'Input text colour.'],
        ['--bloc-input-radius', '4px', 'Border radius.'],
        ['--bloc-input-padding', '8px 12px', 'Inner padding.'],
        ['--bloc-input-font-size', '14px', 'Input font size.'],
        [
            '--bloc-input-group-adornment-color',
            '#9ca3af',
            'Prefix/suffix icon colour inside a group.',
    ],
    ];
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
