import { Component, computed, signal } from '@angular/core';
import { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-text-highlight-demo',
    standalone: true,
    imports: [
        BlocTextHighlightDirective,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './text-highlight-demo.component.html',
})
export class TextHighlightDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'blocTextHighlight',
            'string (required)',
            '—',
            "The full text to display. Replaces the element's innerHTML with sanitized, highlight-annotated content.",
        ],
        [
            'query',
            'string',
            "''",
            'The search term to highlight within the text. An empty string renders the text without any highlights.',
        ],
        [
            'caseSensitive',
            'boolean',
            'false',
            'When true, only exact-case matches are highlighted. Defaults to case-insensitive matching.',
        ],
        [
            'highlighted',
            'boolean',
            'false',
            'Applies a background colour to matched segments. Without this, only the font weight is changed.',
        ],
    ];

    readonly tokens: string[][] = [
        [
            '--bloc-text-highlight-bg',
            'transparent (#fef08a when highlighted)',
            'Background colour of matched text. Automatically set to yellow when <code>[highlighted]="true"</code>.',
        ],
        ['--bloc-text-highlight-color', 'inherit', 'Text colour of matched segments.'],
        ['--bloc-text-highlight-radius', '2px', 'Border radius of the highlight mark.'],
        [
            '--bloc-text-highlight-padding',
            '0 (0 2px when highlighted)',
            'Padding inside the highlight mark. Auto-applied when <code>[highlighted]="true"</code>.',
        ],
        ['--bloc-text-highlight-font-weight', '700', 'Font weight applied to matched characters.'],
    ];

    readonly searchTerm = signal('');

    readonly fruits = [
        'Apple',
        'Apricot',
        'Banana',
        'Blueberry',
        'Cherry',
        'Grape',
        'Grapefruit',
        'Mango',
        'Orange',
        'Pineapple',
        'Strawberry',
        'Watermelon',
    ];

    readonly filteredFruits = computed(() => {
        const term = this.searchTerm().toLowerCase();
        if (!term) return this.fruits;
        return this.fruits.filter((f) => f.toLowerCase().includes(term));
    });

    readonly snippets = {
        basic: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<span [blocTextHighlight]="'Apple'" query="App"></span>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextHighlightDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        noMatch: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<span [blocTextHighlight]="'Banana'" query="xyz"></span>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextHighlightDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        interactive: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<input (input)="searchTerm.set($event.target.value)" />\n\n@for (fruit of filteredFruits(); track fruit) {\n  <span [blocTextHighlight]="fruit" [query]="searchTerm()"></span>\n}`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, computed, signal } from '@angular/core';\nimport { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextHighlightDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly searchTerm = signal('');\n  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango'];\n  readonly filteredFruits = computed(() => {\n    const term = this.searchTerm().toLowerCase();\n    if (!term) return this.fruits;\n    return this.fruits.filter(f => f.toLowerCase().includes(term));\n  });\n}`,
            },
        ],
        caseSensitive: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<!-- case-insensitive (default) -->\n<span [blocTextHighlight]="'Apple Application'" query="app"></span>\n\n<!-- case-sensitive -->\n<span [blocTextHighlight]="'Apple Application'" query="app" [caseSensitive]="true"></span>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextHighlightDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        withColor: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<span [blocTextHighlight]="'Apple'" query="App" [highlighted]="true"></span>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextHighlightDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<div style="--bloc-text-highlight-bg: #dbeafe; --bloc-text-highlight-color: #1e40af">\n  <span [blocTextHighlight]="'Blue themed highlight'" query="Blue"></span>\n</div>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTextHighlightDirective],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.custom-highlight {\n  --bloc-text-highlight-bg: #dbeafe;\n  --bloc-text-highlight-color: #1e40af;\n}`,
            },
        ],
    };
}
