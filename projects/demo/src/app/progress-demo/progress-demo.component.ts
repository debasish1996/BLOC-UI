import { Component, signal } from '@angular/core';
import { BlocButtonComponent, BlocProgressComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-progress-demo',
    standalone: true,
    imports: [
        BlocButtonComponent,
        BlocProgressComponent,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './progress-demo.component.html',
})
export class ProgressDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['value', 'number', '0', 'Current progress value.'],
        ['max', 'number', '100', 'Maximum progress value.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Preset track height.'],
        ['label', 'string | null', 'null', 'Optional label shown above the track.'],
        ['showValue', 'boolean', 'false', 'Displays the computed percentage above the track.'],
    ];

    readonly tokens: string[][] = [
        ['--bloc-progress-track-bg', '#d1d5db', 'Track background colour.'],
        ['--bloc-progress-fill', 'var(--bloc-primary, #7b7b7b)', 'Fill bar colour.'],
        ['--bloc-progress-radius', '999px', 'Border radius of the track and fill.'],
        ['--bloc-progress-meta-color', '#374151', 'Label and value text colour.'],
        ['--bloc-progress-height-sm', '0.375rem', 'Track height when <code>size="sm"</code>.'],
        ['--bloc-progress-height-md', '0.625rem', 'Track height when <code>size="md"</code>.'],
        ['--bloc-progress-height-lg', '0.875rem', 'Track height when <code>size="lg"</code>.'],
    ];

    readonly uploadProgress = signal(42);

    readonly snippets = {
        sizes: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-progress size="sm" [value]="30"></bloc-progress>\n<bloc-progress size="md" [value]="52"></bloc-progress>\n<bloc-progress size="lg" [value]="74"></bloc-progress>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocProgressComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocProgressComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        labelled: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-progress label="Upload progress"\n  [showValue]="true"\n  [value]="uploadProgress()"></bloc-progress>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocProgressComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocProgressComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly uploadProgress = signal(42);\n}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-progress\n  [value]="64"\n  class="my-progress"\n></bloc-progress>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocProgressComponent } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocProgressComponent],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.my-progress {\n  --bloc-progress-track-bg: #dbeafe;\n  --bloc-progress-fill: #2563eb;\n}`,
            },
        ],
    };

    increase(): void {
        this.uploadProgress.update((value) => Math.min(value + 12, 100));
    }

    decrease(): void {
        this.uploadProgress.update((value) => Math.max(value - 12, 0));
    }
}
