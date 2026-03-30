import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
    BlocAutocompleteComponent,
    BlocAutocompleteOption,
} from '@bloc-ui/autocomplete';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-autocomplete-demo',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        BlocAutocompleteComponent,
        InstallCommandComponent,
        SampleCodeComponent,
    ],
    templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
    readonly quickPick = signal<string | null>(null);
    readonly teamControl = new FormControl<string | null>('design');

    readonly teamOptions: readonly BlocAutocompleteOption<string>[] = [
        { label: 'Design', value: 'design', description: 'Brand, motion, and UI systems' },
        { label: 'Engineering', value: 'engineering', description: 'Frontend and platform' },
        { label: 'Growth', value: 'growth', description: 'Acquisition experiments' },
        { label: 'Operations', value: 'ops', description: 'Disabled for this flow', disabled: true },
        { label: 'Support', value: 'support', description: 'Customer-facing delivery' },
    ];

    readonly snippets = {
        basic: `<bloc-autocomplete\n  [options]="teamOptions"\n  [clearable]="true"\n  placeholder="Search teams"\n  (selectionChange)="selectedTeam = $event"\n></bloc-autocomplete>`,
        reactive: `<bloc-autocomplete\n  [options]="teamOptions"\n  [formControl]="teamControl"\n  placeholder="Assign owner"\n></bloc-autocomplete>`,
    };
}
