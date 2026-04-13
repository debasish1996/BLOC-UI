import { Component } from '@angular/core';
import { BlocBadgeComponent, BlocButtonComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-badge-demo',
    standalone: true,
    imports: [
        BlocBadgeComponent,
        BlocButtonComponent,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './badge-demo.component.html',
})
export class BadgeDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'variant',
            "'neutral' | 'primary' | 'success' | 'warning' | 'danger'",
            "'neutral'",
            'Semantic colour variant.',
        ],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Preset padding and font size.'],
        ['pill', 'boolean', 'false', 'Applies a fully-rounded pill radius (999px).'],
    ];

    readonly tokens: string[][] = [
        ['--bloc-badge-bg', '#e2e8f0', 'Base background (overridden by variant-specific tokens).'],
        [
            '--bloc-badge-color',
            '#334155',
            'Base text colour (overridden by variant-specific tokens).',
        ],
        ['--bloc-badge-border', 'transparent', 'Base border colour.'],
        ['--bloc-badge-radius', '999px', 'Border radius (ignored when <code>pill</code> is true).'],
        [
            '--bloc-badge-neutral-bg / -color / -border',
            '#e2e8f0 / #334155 / transparent',
            'Neutral variant overrides.',
        ],
        [
            '--bloc-badge-primary-bg / -color / -border',
            '#dbeafe / #1d4ed8 / transparent',
            'Primary variant overrides.',
        ],
        [
            '--bloc-badge-success-bg / -color / -border',
            '#dcfce7 / #166534 / transparent',
            'Success variant overrides.',
        ],
        [
            '--bloc-badge-warning-bg / -color / -border',
            '#fef3c7 / #92400e / transparent',
            'Warning variant overrides.',
        ],
        [
            '--bloc-badge-danger-bg / -color / -border',
            '#fee2e2 / #b91c1c / transparent',
            'Danger variant overrides.',
        ],
    ];
    readonly snippets = {
        variants: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-badge>Neutral</bloc-badge>\n<bloc-badge variant="primary">Primary</bloc-badge>\n<bloc-badge variant="success">Success</bloc-badge>\n<bloc-badge variant="warning">Warning</bloc-badge>\n<bloc-badge variant="danger">Danger</bloc-badge>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocBadgeComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocBadgeComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        sizes: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-badge size="sm">Small</bloc-badge>\n<bloc-badge size="md">Medium</bloc-badge>\n<bloc-badge size="lg">Large</bloc-badge>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocBadgeComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocBadgeComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        pill: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-badge variant="primary" [pill]="true">99+</bloc-badge>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocBadgeComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocBadgeComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        inlineLabel: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<h3>\n  Messages <bloc-badge size="sm">3</bloc-badge>\n</h3>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocBadgeComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocBadgeComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        buttonCount: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="outline">\n  Notifications\n  <bloc-badge variant="primary" [pill]="true"\n    size="sm">5</bloc-badge>\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocBadgeComponent, BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocBadgeComponent, BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        statusList: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<ul>\n  <li>Deploy #42 <bloc-badge variant="success">Live</bloc-badge></li>\n  <li>Deploy #41 <bloc-badge variant="danger">Failed</bloc-badge></li>\n</ul>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocBadgeComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocBadgeComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-badge\n  style="--bloc-badge-bg: #111827;\n         --bloc-badge-color: #f8fafc;\n         --bloc-badge-border: #374151">\n  Custom\n</bloc-badge>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocBadgeComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocBadgeComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})
export class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `/* Apply to a parent or the component host */
.custom-badge {
  --bloc-badge-bg: #111827;
  --bloc-badge-color: #f8fafc;
  --bloc-badge-border: #374151;
}`,
            },
        ],
    };
}
