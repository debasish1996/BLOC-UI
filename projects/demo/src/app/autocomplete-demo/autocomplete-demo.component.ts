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
    ],
    templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
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
