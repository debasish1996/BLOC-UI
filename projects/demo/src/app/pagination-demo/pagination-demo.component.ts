import { Component, signal } from '@angular/core';
import { BlocPaginationComponent } from '@bloc-ui/pagination';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-pagination-demo',
    standalone: true,
    imports: [
        BlocPaginationComponent,
        InstallCommandComponent,
        SampleCodeComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './pagination-demo.component.html',
})
export class PaginationDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'page',
            'number (model)',
            '1',
            'Two-way bindable current page number. Use <code>[(page)]</code> for two-way binding.',
        ],
        ['totalPages', 'number', 'required', 'Total number of pages.'],
        [
            'siblingCount',
            'number',
            '1',
            'Number of page buttons shown on each side of the current page.',
        ],
        [
            'boundaryCount',
            'number',
            '1',
            'Number of pages always shown at the start and end of the range.',
        ],
        ['disabled', 'boolean', 'false', 'Disables all buttons — useful while data is loading.'],
        [
            'showFirstLast',
            'boolean',
            'false',
            'Adds First and Last quick-jump buttons at the edges of the control.',
        ],
        ['prevLabel', 'string', "''", 'Text label rendered next to the Prev icon.'],
        ['nextLabel', 'string', "''", 'Text label rendered next to the Next icon.'],
        [
            'firstLabel',
            'string',
            "''",
            'Text label rendered next to the First icon (requires <code>showFirstLast</code>).',
        ],
        [
            'lastLabel',
            'string',
            "''",
            'Text label rendered next to the Last icon (requires <code>showFirstLast</code>).',
        ],
        [
            'ariaLabel',
            'string',
            "'Pagination'",
            '<code>aria-label</code> on the wrapping <code>&lt;nav&gt;</code> element.',
        ],
        [
            'prevAriaLabel',
            'string',
            "'Previous page'",
            '<code>aria-label</code> for the Prev button.',
        ],
        ['nextAriaLabel', 'string', "'Next page'", '<code>aria-label</code> for the Next button.'],
        [
            'firstAriaLabel',
            'string',
            "'First page'",
            '<code>aria-label</code> for the First button (requires <code>showFirstLast</code>).',
        ],
        [
            'lastAriaLabel',
            'string',
            "'Last page'",
            '<code>aria-label</code> for the Last button (requires <code>showFirstLast</code>).',
        ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-pagination-bg', '#ffffff', 'Prev / Next control button background.'],
        ['--bloc-pagination-color', '#374151', 'Text and icon colour for all buttons.'],
        ['--bloc-pagination-border', '#e2e8f0', 'Border colour for Prev / Next control buttons.'],
        ['--bloc-pagination-radius', '0.5rem', 'Border radius applied to all buttons.'],
        [
            '--bloc-pagination-hover-bg',
            '#f8fafc / #f1f5f9',
            'Hover background for control buttons / page number buttons.',
        ],
        [
            '--bloc-pagination-hover-border',
            '#cbd5e1',
            'Hover border colour for Prev / Next control buttons.',
        ],
        [
            '--bloc-pagination-focus-ring',
            '#374151',
            'Focus outline colour for all focusable buttons.',
        ],
        [
            '--bloc-pagination-active-bg',
            '--bloc-primary / #606061',
            'Active page button background.',
        ],
        ['--bloc-pagination-active-color', '#ffffff', 'Active page button text colour.'],
        ['--bloc-pagination-muted', '#94a3b8', 'Ellipsis (\u2026) text colour.'],
    ];

    readonly currentPage = signal(1);
    readonly densePage = signal(12);
    readonly compactPage = signal(8);
    readonly largePage = signal(55);
    readonly firstPage = signal(1);
    readonly lastPage = signal(8);
    readonly singlePage = signal(1);
    readonly firstLastPage = signal(10);
    readonly textLabelsPage = signal(10);

    readonly snippets = {
        basic: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="currentPage"\n  [totalPages]="8"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly currentPage = signal(1);\n}`,
            },
        ],
        dense: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="24"\n  [siblingCount]="2"\n  [boundaryCount]="1"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(12);\n}`,
            },
        ],
        compact: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="15"\n  [siblingCount]="1"\n  [boundaryCount]="1"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(8);\n}`,
            },
        ],
        large: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="100"\n  [siblingCount]="1"\n  [boundaryCount]="1"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(55);\n}`,
            },
        ],
        stateFirst: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination [(page)]="page" [totalPages]="8"></bloc-pagination>\n<!-- page starts at 1 — Prev is auto-disabled -->`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(1);\n}`,
            },
        ],
        stateLast: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination [(page)]="page" [totalPages]="8"></bloc-pagination>\n<!-- page equals totalPages — Next is auto-disabled -->`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(8);\n}`,
            },
        ],
        stateSingle: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination [(page)]="page" [totalPages]="1"></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(1);\n}`,
            },
        ],
        disabled: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="8"\n  [disabled]="true"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(1);\n}`,
            },
        ],
        firstLast: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="20"\n  [showFirstLast]="true"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(10);\n}`,
            },
        ],
        customLabels: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="20"\n  [showFirstLast]="true"\n  prevLabel="Prev"\n  nextLabel="Next"\n  firstLabel="First"\n  lastLabel="Last"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly page = signal(10);\n}`,
            },
        ],
        theming: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="8"\n  class="my-pagination"\n></bloc-pagination>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';\nimport { BlocPaginationComponent } from '@bloc-ui/pagination';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocPaginationComponent],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {\n  readonly page = signal(1);\n}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.my-pagination {\n  --bloc-pagination-active-bg: #059669;\n  --bloc-pagination-radius: 9999px;\n  --bloc-pagination-border: #d1fae5;\n}`,
            },
        ],
    };
}
