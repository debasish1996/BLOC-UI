import { Component, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
} from '@angular/forms';
import { BlocTextareaDirective, BlocInputErrorDirective } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-textarea-demo',
    standalone: true,
    imports: [
        BlocTextareaDirective,
        BlocInputErrorDirective,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './textarea-demo.component.html',
})
export class TextareaDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'error',
            'boolean',
            'false',
            'Forces the error border style. Auto-set when a bound form control is invalid and touched.',
        ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-textarea-border', '--bloc-input-border / #d1d5db', 'Default border colour.'],
        ['--bloc-textarea-focus-border', '--bloc-primary / #6b7280', 'Border colour on focus.'],
        ['--bloc-textarea-error-border', '--bloc-error / #9ca3af', 'Border colour in error state.'],
        ['--bloc-textarea-bg', '--bloc-input-bg / #ffffff', 'Background colour.'],
        ['--bloc-textarea-color', '--bloc-input-color / #374151', 'Text colour.'],
        ['--bloc-textarea-radius', '4px', 'Border radius.'],
        ['--bloc-textarea-padding', '8px 12px', 'Inner padding.'],
        ['--bloc-textarea-min-height', '96px', 'Minimum height before the user can resize.'],
        ['--bloc-textarea-font-size', '14px', 'Font size.'],
    ];
    readonly bio = signal('');

    ngModelValue = '';

    readonly descriptionCtrl = new FormControl('', [Validators.required, Validators.minLength(20)]);

    readonly feedbackFormGroup = new FormGroup({
        notes: new FormControl('', [Validators.required, Validators.maxLength(180)]),
    });

    readonly snippets = {
        basic: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<textarea blocTextarea\n  rows="4"\n  placeholder="Tell us about your project"></textarea>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextareaDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextareaDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        disabled: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<textarea blocTextarea\n  rows="4"\n  placeholder="Cannot edit"\n  disabled></textarea>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextareaDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextareaDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<textarea blocTextarea\n  rows="5"\n  placeholder="Resizable notes"\n  style="--bloc-textarea-min-height: 140px; --bloc-textarea-radius: 16px"></textarea>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextareaDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextareaDirective],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.custom-textarea {\n  --bloc-textarea-min-height: 140px;\n  --bloc-textarea-radius: 16px;\n}`,
            },
        ],
        manualError: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<textarea blocTextarea [error]="true"\n  placeholder="Project summary"></textarea>\n<bloc-input-error>\n  A summary is required.\n</bloc-input-error>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextareaDirective, BlocInputErrorDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextareaDirective, BlocInputErrorDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        formControl: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<textarea blocTextarea\n  rows="4"\n  [formControl]="descriptionCtrl"\n  placeholder="Write at least 20 characters"></textarea>\n@if (descriptionCtrl.invalid && descriptionCtrl.touched) {\n  <bloc-input-error>\n    Please add at least 20 characters.\n  </bloc-input-error>\n}`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';\nimport { BlocTextareaDirective, BlocInputErrorDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, BlocTextareaDirective, BlocInputErrorDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly descriptionCtrl = new FormControl('', [Validators.required, Validators.minLength(20)]);\n}`,
            },
        ],
        ngModel: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<textarea blocTextarea\n  rows="4"\n  [(ngModel)]="draft"\n  placeholder="Start typing"></textarea>\n<p>Characters: {{ draft.length }}</p>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { BlocTextareaDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [FormsModule, BlocTextareaDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  draft = '';\n}`,
            },
        ],
        formControlName: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<form [formGroup]="feedbackFormGroup">\n  <textarea blocTextarea\n    rows="5"\n    formControlName="notes"\n    placeholder="Share your feedback"></textarea>\n  @if (feedbackFormGroup.get('notes')?.invalid &&\n       feedbackFormGroup.get('notes')?.touched) {\n    <bloc-input-error>Feedback is required.</bloc-input-error>\n  }\n</form>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';\nimport { BlocTextareaDirective, BlocInputErrorDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, BlocTextareaDirective, BlocInputErrorDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly feedbackFormGroup = new FormGroup({\n    notes: new FormControl('', [Validators.required, Validators.maxLength(180)]),\n  });\n}`,
            },
        ],
    };
}
