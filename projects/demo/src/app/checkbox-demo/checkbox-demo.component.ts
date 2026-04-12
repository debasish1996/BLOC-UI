import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocCheckboxComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-checkbox-demo',
    standalone: true,
    imports: [
        BlocCheckboxComponent,
        BlocButtonComponent,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Preset checkbox and check-mark size.'],
        [
            'labelPosition',
            "'before' | 'after'",
            "'after'",
            'Position of projected label relative to the checkbox box.',
    ],
        [
            'disabled',
            'boolean',
            'false',
            'Disables interaction. Also disabled when the form control calls <code>setDisabledState</code>.',
    ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-checkbox-border', '#aaafb7', 'Unchecked border colour.'],
        ['--bloc-checkbox-bg', '#ffffff', 'Unchecked background.'],
        [
            '--bloc-checkbox-checked-border',
            '--bloc-primary / #6b7280',
            'Border colour when checked.',
    ],
        ['--bloc-checkbox-checked-bg', '--bloc-primary / #6b7280', 'Fill colour when checked.'],
        ['--bloc-checkbox-check-color', '#ffffff', 'Check mark (SVG stroke) colour.'],
        ['--bloc-checkbox-focus-ring', '--bloc-primary / #6b7280', 'Focus outline colour.'],
    ];
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
        defaultChecked: `<bloc-checkbox [ngModel]="true">Pre-checked</bloc-checkbox>`,
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
        this.disabledCtrl.disabled ? this.disabledCtrl.enable() : this.disabledCtrl.disable();
    }
}
