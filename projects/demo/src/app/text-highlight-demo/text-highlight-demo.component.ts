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
        basic: `<span [blocTextHighlight]="'Apple'" query="App"></span>`,
        noMatch: `<span [blocTextHighlight]="'Banana'" query="xyz"></span>`,
        interactive: `<input (input)="searchTerm.set($event.target.value)" />\n\n@for (fruit of filteredFruits(); track fruit) {\n  <span [blocTextHighlight]="fruit" [query]="searchTerm()"></span>\n}`,
        caseSensitive: `<!-- case-insensitive (default) -->\n<span [blocTextHighlight]="'Apple Application'" query="app"></span>\n\n<!-- case-sensitive -->\n<span [blocTextHighlight]="'Apple Application'" query="app" [caseSensitive]="true"></span>`,
        withColor: `<span [blocTextHighlight]="'Apple'" query="App" [highlighted]="true"></span>`,
        customToken: `<div style="--bloc-text-highlight-bg: #dbeafe; --bloc-text-highlight-color: #1e40af">\n  <span [blocTextHighlight]="'Blue themed highlight'" query="Blue"></span>\n</div>`,
    };
}
