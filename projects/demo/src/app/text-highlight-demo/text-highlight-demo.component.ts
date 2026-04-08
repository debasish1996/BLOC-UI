import { Component, computed, signal } from '@angular/core';
import { BlocTextHighlightDirective } from '@bloc-ui/text-highlight';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-text-highlight-demo',
    standalone: true,
    imports: [BlocTextHighlightDirective, SampleCodeComponent, InstallCommandComponent],
    templateUrl: './text-highlight-demo.component.html',
})
export class TextHighlightDemoComponent {
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
