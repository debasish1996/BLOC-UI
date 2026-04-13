import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocRadioComponent, BlocRadioGroupComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-radio-demo',
    standalone: true,
    imports: [
        BlocRadioGroupComponent,
        BlocRadioComponent,
        BlocButtonComponent,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputsGroup: string[][] = [
        ['disabled', 'boolean', 'false', 'Disables every radio item in the group.'],
        [
            'labelPosition',
            "'before' | 'after'",
            "'after'",
            'Default label position inherited by child radios.',
        ],
    ];

    readonly inputsRadio: string[][] = [
        ['value', 'unknown', 'required', 'The value this radio represents.'],
        ['disabled', 'boolean', 'false', 'Disables this radio regardless of the group state.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Visual size of the radio control.'],
        [
            'labelPosition',
            "'before' | 'after' | null",
            'null',
            'Per-item label position override; inherits from group when <code>null</code>.',
        ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-radio-border', '#aaafb7', 'Border colour when unchecked.'],
        ['--bloc-radio-bg', '#ffffff', 'Radio dot background colour.'],
        [
            '--bloc-radio-checked-border',
            'var(--bloc-primary, #6b7280)',
            'Border colour when checked.',
        ],
        [
            '--bloc-radio-dot-color',
            'var(--bloc-primary, #6b7280)',
            'Inner dot fill colour when checked.',
        ],
        ['--bloc-radio-focus-ring', 'var(--bloc-primary, #6b7280)', 'Focus outline colour.'],
        ['--bloc-radio-group-gap', '8px', 'Gap between radio items in the group.'],
    ];
    // Template-driven
    ngModelValue: string = '';

    // Pre-selected value for disabled group demo
    disabledSelectedValue: string = 'b';

    // Reactive — enabled
    readonly reactiveCtrl = new FormControl<string>('');

    // Reactive — disabled
    readonly disabledCtrl = new FormControl<string>('b');

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
                code: `<bloc-radio-group>\n  <bloc-radio value="a" size="sm">Option A</bloc-radio>\n  <bloc-radio value="b" size="sm">Option B</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        sizeMedium: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group>\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        sizeLarge: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group>\n  <bloc-radio value="a" size="lg">Option A</bloc-radio>\n  <bloc-radio value="b" size="lg">Option B</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        groupDisabled: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group [disabled]="true">\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        itemDisabled: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group>\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b" [disabled]="true">\n    Option B (disabled)\n  </bloc-radio>\n  <bloc-radio value="c">Option C</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        disabledSelected: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group\n  [(ngModel)]="selectedValue"\n  [disabled]="true">\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n  <bloc-radio value="c">Option C</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [FormsModule, BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  selectedValue = 'b';\n}`,
            },
        ],
        labelAfter: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group>\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        labelBefore: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group labelPosition="before">\n  <bloc-radio value="a">Option A</bloc-radio>\n  <bloc-radio value="b">Option B</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        perItem: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group>\n  <bloc-radio value="a" labelPosition="before">\n    Before\n  </bloc-radio>\n  <bloc-radio value="b">After</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        horizontal: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group class="flex-row! flex-wrap"\n  style="--bloc-radio-group-gap: 16px">\n  <bloc-radio value="xs">XS</bloc-radio>\n  <bloc-radio value="sm">SM</bloc-radio>\n  <bloc-radio value="md">MD</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        ngModel: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group [(ngModel)]="selected">\n  <bloc-radio value="apple">Apple</bloc-radio>\n  <bloc-radio value="banana">Banana</bloc-radio>\n  <bloc-radio value="cherry">Cherry</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [FormsModule, BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  selected = '';\n}`,
            },
        ],
        formControl: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group [formControl]="sizeCtrl">\n  <bloc-radio value="xs">Extra small</bloc-radio>\n  <bloc-radio value="sm">Small</bloc-radio>\n  <bloc-radio value="md">Medium</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly sizeCtrl = new FormControl<string>('');\n}`,
            },
        ],
        setDisabled: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `<!-- disable from code -->\nctrl = new FormControl('b');\nctrl.disable();`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-radio-group class="my-radio">\n  <bloc-radio value="xs">Extra small</bloc-radio>\n  <bloc-radio value="sm">Small</bloc-radio>\n</bloc-radio-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocRadioGroupComponent, BlocRadioComponent],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.my-radio {\n  --bloc-radio-checked-border: #3b82f6;\n  --bloc-radio-dot-color: #3b82f6;\n  --bloc-radio-focus-ring: #3b82f6;\n}`,
            },
        ],
    };
}
