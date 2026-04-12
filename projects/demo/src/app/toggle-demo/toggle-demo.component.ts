import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocToggleComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-toggle-demo',
    standalone: true,
    imports: [
        BlocToggleComponent,
        BlocButtonComponent,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './toggle-demo.component.html',
})
export class ToggleDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Preset track width and height.'],
        [
            'labelPosition',
            "'before' | 'after'",
            "'after'",
            'Position of projected label relative to the toggle track.',
    ],
        [
            'disabled',
            'boolean',
            'false',
            'Disables interaction. Also disabled when the form control calls <code>setDisabledState</code>.',
    ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-toggle-track-bg', '#d1d5db', 'Track background when off.'],
        ['--bloc-toggle-track-checked-bg', '--bloc-primary / #6b7280', 'Track background when on.'],
        ['--bloc-toggle-thumb-bg', '#ffffff', 'Thumb (knob) colour.'],
        ['--bloc-toggle-thumb-shadow', 'rgba(0,0,0,0.2)', 'Thumb drop shadow.'],
        ['--bloc-toggle-focus-ring', '--bloc-primary / #6b7280', 'Focus outline colour.'],
        [
            '--bloc-toggle-width / --bloc-toggle-height',
            'size preset',
            'Override track dimensions without changing the size preset.',
    ],
    ];
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
        this.disabledCtrl.disabled ? this.disabledCtrl.enable() : this.disabledCtrl.disable();
    }

    readonly snippets = {
        sizeSmall: `<bloc-toggle size="sm"></bloc-toggle>`,
        sizeMedium: `<bloc-toggle></bloc-toggle>`,
        sizeLarge: `<bloc-toggle size="lg"></bloc-toggle>`,
        default: `<bloc-toggle></bloc-toggle>`,
        defaultOn: `<bloc-toggle [ngModel]="true"></bloc-toggle>`,
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
