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
        sizeSmall: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle size="sm"></bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        sizeMedium: [
            { label: 'HTML', language: 'xml', code: `<bloc-toggle></bloc-toggle>` },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        sizeLarge: [
            { label: 'HTML', language: 'xml', code: `<bloc-toggle size="lg"></bloc-toggle>` },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        default: [
            { label: 'HTML', language: 'xml', code: `<bloc-toggle></bloc-toggle>` },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        defaultOn: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle [ngModel]="true"></bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [FormsModule, BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        disabledOff: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle [disabled]="true"></bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        disabledOn: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle [formControl]="ctrl"></bloc-toggle>\n<!-- ctrl = new FormControl(true); ctrl.disable(); -->`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { ReactiveFormsModule, FormControl } from '@angular/forms';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly ctrl = new FormControl(true);\n  constructor() { this.ctrl.disable(); }\n}`,
            },
        ],
        labelAfter: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle>Enable notifications</bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        labelBefore: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle labelPosition="before">\n  Enable notifications\n</bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        ngModel: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle [(ngModel)]="isOn">\n  Label text\n</bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [FormsModule, BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  isOn = false;\n}`,
            },
        ],
        formControl: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle [formControl]="myCtrl">\n  Label text\n</bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { ReactiveFormsModule, FormControl } from '@angular/forms';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, BlocToggleComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly myCtrl = new FormControl(false);\n}`,
            },
        ],
        setDisabled: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `<!-- disable from code -->\nctrl = new FormControl(true);\nctrl.disable();`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-toggle\n  style="--bloc-toggle-track-checked-bg: #3bf6a2;\n         --bloc-toggle-focus-ring: #3b82f6">\n  Green track\n</bloc-toggle>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocToggleComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocToggleComponent],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.custom-toggle {\n  --bloc-toggle-track-checked-bg: #3bf6a2;\n  --bloc-toggle-focus-ring: #3b82f6;\n}`,
            },
        ],
    };
}
