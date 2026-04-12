import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    BlocAutocompleteComponent,
    BlocAutocompleteHighlightComponent,
    BlocAutocompleteOption,
    BlocAutocompleteFuzzySearch,
} from '@bloc-ui/autocomplete';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    OUTPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-autocomplete-demo',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        BlocAutocompleteComponent,
        BlocAutocompleteHighlightComponent,
        BlocAutocompleteFuzzySearch,
        InstallCommandComponent,
        SampleCodeComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'options',
            'BlocAutocompleteOption&lt;T&gt;[]',
            '[]',
            'Array of options to display in the dropdown panel.',
    ],
        ['placeholder', 'string', "'Search options'", 'Input placeholder text.'],
        [
            'emptyText',
            'string',
            "'No results found'",
            'Message shown when no options match the current query.',
    ],
        [
            'loadingText',
            'string',
            "'Loading options...'",
            'Message shown in place of options while <code>loading</code> is true.',
    ],
        ['clearable', 'boolean', 'false', 'Shows a clear (×) button when a value is selected.'],
        [
            'loading',
            'boolean',
            'false',
            'Replaces the option list with a loading message — ideal for async data fetches.',
    ],
        [
            'disabled',
            'boolean',
            'false',
            'Disables all interaction. Also driven by a reactive <code>FormControl</code> disabled state.',
    ],
        [
            'error',
            'boolean',
            'false',
            'Applies error styling. Also triggered automatically when a bound <code>FormControl</code> is invalid and touched.',
    ],
        [
            'filterFn',
            '((options, query) =&gt; BlocAutocompleteOption&lt;T&gt;[]) | null',
            'null',
            'Custom filter function. When provided, overrides the default substring matching and any fuzzy search directive.',
    ],
    ];

    readonly outputs: string[][] = [
        [
            'selectionChange',
            'T | null',
            'Emitted when an option is selected or the value is cleared.',
    ],
    ];

    readonly inputsHighlight: string[][] = [
        [
            'options',
            'BlocAutocompleteOption&lt;T&gt;[]',
            '[]',
            'Array of options. Matched text is highlighted automatically as the user types.',
    ],
        ['placeholder', 'string', "'Search options'", 'Input placeholder text.'],
        ['clearable', 'boolean', 'false', 'Shows a clear button when a value is selected.'],
        ['loading', 'boolean', 'false', 'Replaces options with a loading message.'],
        ['disabled', 'boolean', 'false', 'Disables all interaction.'],
    ];

    readonly fuzzyConfig: string[][] = [
        ['keys', 'string[]', "['label', 'description']", 'Option properties to search within.'],
        [
            'threshold',
            'number',
            '0.6',
            'Match score threshold. 0 = exact match only, 1 = match anything.',
    ],
        ['isCaseSensitive', 'boolean', 'false', 'Enables case-sensitive character matching.'],
        [
            'minMatchCharLength',
            'number',
            '1',
            'Minimum number of characters that must match for an option to be included.',
    ],
        [
            'distance',
            'number',
            '100',
            'Maximum allowable search distance between matched characters.',
    ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-autocomplete-bg', '#ffffff', 'Input and panel background colour.'],
        ['--bloc-autocomplete-border', '#d1d5db', 'Input and panel border colour.'],
        [
            '--bloc-autocomplete-border-focus',
            '--bloc-primary / #6b7280',
            'Input border colour when focused.',
    ],
        ['--bloc-autocomplete-color', '#374151', 'Input and option text colour.'],
        ['--bloc-autocomplete-muted', '#9ca3af', 'Placeholder and option description text colour.'],
        ['--bloc-autocomplete-radius', '4px', 'Corner radius for the input and option rows.'],
        [
            '--bloc-autocomplete-panel-radius',
            '--bloc-autocomplete-radius',
            'Panel corner radius override (falls back to <code>--bloc-autocomplete-radius</code>).',
    ],
        [
            '--bloc-autocomplete-panel-shadow',
            '0 4px 16px rgba(0,0,0,0.08)',
            'Dropdown panel drop shadow.',
    ],
        [
            '--bloc-autocomplete-option-hover',
            'rgba(0,0,0,0.04)',
            'Option background on mouse hover.',
    ],
        [
            '--bloc-autocomplete-option-active',
            'rgba(0,0,0,0.06)',
            'Option background when keyboard-focused.',
    ],
        [
            '--bloc-autocomplete-option-selected',
            'rgba(0,0,0,0.08)',
            'Background for the currently selected option.',
    ],
    ];

    readonly quickPick = signal<string | null>(null);
    readonly teamControl = new FormControl<string | null>('design');
    readonly disabledControl = new FormControl<string | null>({ value: 'design', disabled: true });
    readonly requiredControl = new FormControl<string | null>(null, {
        validators: [Validators.required],
    });
    readonly isLoading = signal(false);

    readonly teamOptions: readonly BlocAutocompleteOption<string>[] = [
        { label: 'Design', value: 'design', description: 'Brand, motion, and UI systems' },
        { label: 'Engineering', value: 'engineering', description: 'Frontend and platform' },
        { label: 'Growth', value: 'growth', description: 'Acquisition experiments' },
        {
            label: 'Operations',
            value: 'ops',
            description: 'Disabled for this flow',
            disabled: true,
        },
        { label: 'Support', value: 'support', description: 'Customer-facing delivery' },
    ];

    readonly countryOptions: readonly BlocAutocompleteOption<string>[] = [
        { label: 'United States', value: 'us', description: 'North America' },
        { label: 'United Kingdom', value: 'uk', description: 'Europe' },
        { label: 'Canada', value: 'ca', description: 'North America' },
        { label: 'Australia', value: 'au', description: 'Oceania' },
        { label: 'Germany', value: 'de', description: 'Europe' },
        { label: 'France', value: 'fr', description: 'Europe' },
        { label: 'Japan', value: 'jp', description: 'Asia' },
        { label: 'South Korea', value: 'kr', description: 'Asia' },
        { label: 'Brazil', value: 'br', description: 'South America' },
        { label: 'India', value: 'in', description: 'Asia' },
    ];

    toggleLoading(): void {
        this.isLoading.update((v) => !v);
    }

    readonly snippets = {
        basic: `<bloc-autocomplete\n  [options]="teamOptions"\n  [clearable]="true"\n  placeholder="Search teams"\n  (selectionChange)="selectedTeam = $event"\n></bloc-autocomplete>`,
        reactive: `<bloc-autocomplete\n  [options]="teamOptions"\n  [formControl]="teamControl"\n  placeholder="Assign owner"\n></bloc-autocomplete>`,
        required: `<bloc-autocomplete\n  [options]="teamOptions"\n  [formControl]="requiredControl"\n   [clearable]="true"\n  placeholder="Required field"\n></bloc-autocomplete>`,
        disabled: `<bloc-autocomplete\n  [options]="teamOptions"\n  [formControl]="disabledControl"\n  placeholder="Unavailable"\n></bloc-autocomplete>`,
        loading: `<bloc-autocomplete\n  [options]="teamOptions"\n  [loading]="isLoading()"\n  placeholder="Search teams"\n></bloc-autocomplete>`,
        highlight: `<bloc-autocomplete\n  [options]="teamOptions"\n  [clearable]="true"\n  [highlight]="true"\n  placeholder="Type to highlight"\n></bloc-autocomplete>`,
        theming: `<bloc-autocomplete\n  style="\n    --bloc-autocomplete-border-focus: #10b981;\n    --bloc-autocomplete-option-selected: rgba(16, 185, 129, 0.12);\n    --bloc-autocomplete-option-active: rgba(16, 185, 129, 0.06);\n  "\n  [options]="teamOptions"\n  [clearable]="true"\n  placeholder="Green themed"\n></bloc-autocomplete>`,
        fuzzyBasic: `<bloc-autocomplete
  [options]="countryOptions"
  [blocAutocompleteFuzzySearch]="{ keys: ['label', 'description'], threshold: 0.6 }"
  placeholder="Try typing 'usa' or 'euro'"
></bloc-autocomplete>`,
        fuzzyAdvanced: `<bloc-autocomplete
  [options]="countryOptions"
  [blocAutocompleteFuzzySearch]="{
    keys: ['label', 'description'],
    threshold: 0.5,
    isCaseSensitive: false,
    minMatchCharLength: 2
  }"
  placeholder="Type to fuzzy search..."
></bloc-autocomplete>`,
    };
}
