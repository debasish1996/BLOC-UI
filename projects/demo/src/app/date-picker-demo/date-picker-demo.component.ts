import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocDatePickerTriggerDirective } from '@bloc-ui/date-picker';
import { BlocButtonComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import { IconComponent } from '../icon/icon.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    OUTPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-date-picker-demo',
    standalone: true,
    imports: [
        BlocDatePickerTriggerDirective,
        BlocButtonComponent,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        IconComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './date-picker-demo.component.html',
})
export class DatePickerDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputsTrigger: string[][] = [
        [
            'minDate',
            'Date | null',
            'null',
            'Minimum selectable date. Dates before this are disabled.',
    ],
        [
            'maxDate',
            'Date | null',
            'null',
            'Maximum selectable date. Dates after this are disabled.',
    ],
        [
            'disabled',
            'boolean',
            'false',
            'Disable the trigger via template binding. Also set automatically by reactive forms.',
    ],
    ];

    readonly exportedSignals: string[][] = [
        [
            'selectedDate()',
            'Date | null',
            'Currently selected date. Useful for reading the value directly in templates.',
    ],
        ['isOpen()', 'boolean', 'Whether the calendar panel is currently open.'],
        [
            'isDisabled()',
            'boolean',
            'Computed: <code>true</code> when <code>disabled</code> input is set or the form control is disabled.',
    ],
    ];

    readonly tokens: string[][] = [
        [
            '--bloc-date-picker-selected-bg',
            '--bloc-primary / #6b7280',
            'Background of the selected day cell.',
    ],
        ['--bloc-date-picker-selected-color', '#ffffff', 'Text colour of the selected day cell.'],
        [
            '--bloc-date-picker-today-border',
            '--bloc-primary / #6b7280',
            "Border colour of today's date indicator.",
    ],
        ['--bloc-date-picker-day-radius', '6px', 'Border radius of day, month, and year cells.'],
        ['--bloc-date-picker-day-color', '#374151', 'Default day cell text colour.'],
        ['--bloc-date-picker-day-hover-bg', '#f3f4f6', 'Day cell hover background.'],
        ['--bloc-date-picker-nav-color', '#6b7280', 'Previous/next navigation arrow colour.'],
        [
            '--bloc-date-picker-nav-hover-bg',
            '#f3f4f6',
            'Navigation button and "Today" button hover background.',
    ],
        [
            '--bloc-date-picker-action-color',
            '--bloc-primary / #6b7280',
            '"Today" footer button text colour.',
    ],
        ['--bloc-date-picker-clear-color', '#9ca3af', '"Clear" footer button text colour.'],
        [
            '--bloc-date-picker-footer-border',
            '--bloc-border / #d1d5db',
            'Footer divider border colour.',
    ],
    ];
    // ngModel
    ngModelDate: Date | null = null;

    // Reactive
    readonly dateCtrl = new FormControl<Date | null>(null);
    readonly disabledCtrl = new FormControl<Date | null>(new Date());

    // FormGroup for formControlName demo
    readonly birthdateGroup = new FormGroup({
        birthdate: new FormControl<Date | null>(null),
    });

    // Min/max demo
    readonly minDate = new Date(2024, 0, 1);
    readonly maxDate = new Date(2026, 11, 31);

    constructor() {
        this.disabledCtrl.disable();
    }

    toggleDisabled(): void {
        this.disabledCtrl.disabled ? this.disabledCtrl.enable() : this.disabledCtrl.disable();
    }

    readonly snippets = {
        basic: `<button blocDatePickerTrigger\n  #picker="blocDatePickerTrigger">\n  <my-icon name="calendar" />\n  {{ picker.selectedDate()?.toLocaleDateString() || 'Pick a date' }}\n</button>`,
        ngModel: `<button blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  #picker="blocDatePickerTrigger">\n  {{ picker.selectedDate()?.toLocaleDateString() || 'Pick a date' }}\n</button>`,
        formControl: `<button blocDatePickerTrigger\n  [formControl]="dateCtrl"\n  #picker="blocDatePickerTrigger">\n  {{ picker.selectedDate()?.toLocaleDateString() || 'Select date' }}\n</button>`,
        disabled: `<button blocDatePickerTrigger\n  [formControl]="disabledCtrl"\n  #picker="blocDatePickerTrigger">\n  {{ picker.selectedDate()?.toLocaleDateString() || 'Disabled' }}\n</button>\n<!-- disabledCtrl.disable(); -->`,
        minMax: `<button blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  [minDate]="minDate"\n  [maxDate]="maxDate"\n  #picker="blocDatePickerTrigger">\n  {{ picker.selectedDate()?.toLocaleDateString() || 'Pick a date' }}\n</button>`,
        customElement: `<div blocDatePickerTrigger\n  [(ngModel)]="selectedDate"\n  #picker="blocDatePickerTrigger"\n  class="my-trigger">\n  <my-icon name="calendar" />\n  {{ picker.selectedDate()?.toLocaleDateString() || 'Choose date' }}\n</div>`,
        customToken: `<button blocDatePickerTrigger\n  style="--bloc-date-picker-selected-bg: #16a34a;\n         --bloc-date-picker-today-border: #16a34a"\n  #picker="blocDatePickerTrigger">\n  {{ picker.selectedDate()?.toLocaleDateString() || 'Green accent' }}\n</button>`,
        formControlName: `<form [formGroup]="birthdateGroup">\n  <button blocDatePickerTrigger\n    formControlName="birthdate"\n    #picker="blocDatePickerTrigger">\n    {{ picker.selectedDate()?.toLocaleDateString() || 'Pick birthdate' }}\n  </button>\n</form>\n\nbirthdateGroup = new FormGroup({\n  birthdate: new FormControl<Date | null>(null),\n});`,
    };
}
