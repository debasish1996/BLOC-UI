import { Component } from '@angular/core';
import { BlocSpinnerDirective } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-spinner-demo',
    standalone: true,
    imports: [
        BlocSpinnerDirective,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './spinner-demo.component.html',
})
export class SpinnerDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'size',
            "'xs' | 'sm' | 'md' | 'lg' | 'xl' | null",
            "'md'",
            'Preset size. Pass <code>null</code> to control dimensions entirely via class or inline style.',
        ],
        [
            'width',
            'string',
            "''",
            'Explicit width as an inline style value (e.g. <code>"40px"</code>, <code>"2rem"</code>). Overrides the size preset.',
        ],
        [
            'height',
            'string',
            "''",
            'Explicit height as an inline style value (e.g. <code>"40px"</code>, <code>"2rem"</code>). Overrides the size preset.',
        ],
    ];

    readonly tokens: string[][] = [
        [
            '--bloc-spinner-color',
            '#6b7280',
            'Arc colour. The track is automatically derived as 20% opacity of this value. Any Tailwind <code>text-{color}</code> class also sets this.',
        ],
    ];
    readonly snippets = {
        presetSizes: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-spinner size="xs" />\n<bloc-spinner size="sm" />\n<bloc-spinner size="md" />\n<bloc-spinner size="lg" />\n<bloc-spinner size="xl" />`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSpinnerDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSpinnerDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        default: [
            { label: 'HTML', language: 'xml', code: `<span blocSpinner></span>` },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSpinnerDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSpinnerDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        customInputs: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<span blocSpinner width="56px" height="56px"></span>\n<span blocSpinner width="4rem" height="4rem"></span>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSpinnerDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSpinnerDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        customClass: [
            { label: 'HTML', language: 'xml', code: `<span blocSpinner class="w-16 h-16"></span>` },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSpinnerDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSpinnerDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        customColour: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<span blocSpinner size="lg"\n  class="text-emerald-500"></span>\n<span blocSpinner size="lg"\n  class="text-amber-500"></span>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSpinnerDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSpinnerDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<span blocSpinner size="lg"\n  class="custom-spinner"></span>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSpinnerDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSpinnerDirective],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.custom-spinner {\n  --bloc-spinner-color: #10b981;\n  --bloc-spinner-track: #d1fae5;\n}`,
            },
        ],
        inlineText: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<div class="flex items-center gap-2 text-sm">\n  <span blocSpinner size="sm"></span>\n  Loading data...\n</div>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSpinnerDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSpinnerDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
    };
}
