import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BlocOptionDirective, BlocSelectComponent } from '@bloc-ui/select';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-select-demo',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        BlocSelectComponent,
        BlocOptionDirective,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './select-demo.component.html',
})
export class SelectDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['placeholder', 'string', "'Select an option'", 'Text shown when no value is selected.'],
        ['disabled', 'boolean', 'false', 'Disables interaction and applies muted styles.'],
        ['searchable', 'boolean', 'false', 'Shows a search input inside the dropdown panel.'],
        ['clearable', 'boolean', 'false', 'Shows a clear button to reset the selection.'],
        ['loading', 'boolean', 'false', 'Replaces the option list with a loading spinner.'],
        [
            'position',
            'OverlayPosition',
            "'bottom-start'",
            'Preferred placement of the dropdown panel.',
    ],
        [
            'compareWith',
            '(a, b) =&gt; boolean',
            'Object.is',
            'Custom equality function for matching selected value to options.',
    ],
    ];

    readonly inputsOption: string[][] = [
        ['value', 'unknown', 'null', 'The value this option represents.'],
        ['disabled', 'boolean', 'false', 'Prevents this option from being selected.'],
        [
            'filterText',
            'string | null',
            'null',
            "Override text used for search filtering; defaults to the element's text content.",
    ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-select-bg', '#ffffff', 'Background of the trigger and dropdown panel.'],
        ['--bloc-select-border', '#d1d5db', 'Border colour of the trigger and panel.'],
        [
            '--bloc-select-border-hover',
            '#6b7280',
            'Border colour on hover, focus, and open states.',
    ],
        ['--bloc-select-muted', '#9ca3af', 'Placeholder and icon colour.'],
        ['--bloc-select-text', '#374151', 'Selected label and option text colour.'],
        [
            '--bloc-select-panel-shadow',
            '0 4px 16px rgba(0,0,0,0.08)',
            'Drop shadow of the dropdown panel.',
    ],
        ['--bloc-select-option-hover', 'rgba(0,0,0,0.04)', 'Option background on mouse hover.'],
        [
            '--bloc-select-option-active',
            'rgba(0,0,0,0.06)',
            'Option background when keyboard-active.',
    ],
        [
            '--bloc-select-option-selected',
            'rgba(0,0,0,0.08)',
            'Background of the currently selected option.',
    ],
        ['--bloc-select-radius', '4px', 'Border-radius of the trigger and individual options.'],
        ['--bloc-select-panel-radius', '6px', 'Border-radius of the dropdown panel.'],
    ];

    readonly fruitControl = new FormControl<string | null>('banana');

    readonly profileForm = new FormGroup({
        fruit: new FormControl<string | null>('apple'),
    });

    readonly loading = signal(false);

    readonly fruits = [
        { value: 'apple', label: 'Apple', note: 'Crisp and classic' },
        { value: 'banana', label: 'Banana', note: 'Soft and sweet' },
        { value: 'orange', label: 'Orange', note: 'Bright citrus' },
        { value: 'grape', label: 'Grape', note: 'Small and juicy' },
        { value: 'mango', label: 'Mango', note: 'Tropical favorite' },
    ];

    readonly snippets = {
        basic: `<bloc-select placeholder="Select fruit">\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n</bloc-select>`,
        reactive: `<bloc-select [formControl]="fruitControl" placeholder="Pick one">\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n  <div bloc-option value="orange">Orange</div>\n</bloc-select>`,
        search: `<bloc-select\n  [formControl]="fruitControl"\n  [searchable]="true"\n  [clearable]="true"\n  placeholder="Search fruit"\n>\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n  <div bloc-option value="orange">Orange</div>\n</bloc-select>`,
        custom: `<bloc-select [formControl]="fruitControl" [searchable]="true" placeholder="Choose fruit">\n  <div bloc-option value="apple">\n    <div class="flex items-center justify-between gap-3 w-full">\n      <span class="font-medium">Apple</span>\n      <span class="text-xs text-slate-500">Crisp and classic</span>\n    </div>\n  </div>\n  <div bloc-option value="banana">\n    <div class="flex items-center justify-between gap-3 w-full">\n      <span class="font-medium">Banana</span>\n      <span class="text-xs text-slate-500">Soft and sweet</span>\n    </div>\n  </div>\n</bloc-select>`,
        disabled: `<bloc-select [disabled]="true" placeholder="Unavailable">\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n</bloc-select>`,
        loading: `<bloc-select [loading]="true" [searchable]="true" placeholder="Loading fruits">\n  <div bloc-option value="apple">Apple</div>\n</bloc-select>`,
        formControlName: `<form [formGroup]="profileForm">\n  <bloc-select formControlName="fruit" placeholder="Favorite fruit">\n    <div bloc-option value="apple">Apple</div>\n    <div bloc-option value="banana">Banana</div>\n    <div bloc-option value="orange">Orange</div>\n  </bloc-select>\n</form>`,
        customToken: `<bloc-select\n  style="\n    --bloc-select-border-hover: #10b981;\n    --bloc-select-option-selected: rgba(16, 185, 129, 0.12);\n    --bloc-select-option-hover: rgba(16, 185, 129, 0.06);\n  "\n  [formControl]="fruitControl"\n  placeholder="Green themed"\n>\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n</bloc-select>`,
    };

    toggleLoading(): void {
        const next = !this.loading();
        this.loading.set(next);

        if (next) {
            setTimeout(() => this.loading.set(false), 2200);
        }
    }
}
