import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocDateRangePickerTriggerDirective, DateRange } from '@bloc-ui/date-picker';
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
    selector: 'app-date-range-picker-demo',
    standalone: true,
    imports: [
        BlocDateRangePickerTriggerDirective,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        IconComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './date-range-picker-demo.component.html',
})
export class DateRangePickerDemoComponent {
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
        ['disabled', 'boolean', 'false', 'Disables the trigger via template binding.'],
        [
            'rangeFormGroup',
            'FormGroup | null',
            'null',
            'Optional <code>FormGroup</code> with <code>from</code> and <code>to</code> controls. Patches them directly on selection.',
    ],
    ];

    readonly exportedProps: string[][] = [
        ['rangeStart()', 'Signal&lt;Date | null&gt;', 'The currently selected start date.'],
        ['rangeEnd()', 'Signal&lt;Date | null&gt;', 'The currently selected end date.'],
        ['isOpen()', 'Signal&lt;boolean&gt;', 'Whether the calendar panel is currently open.'],
    ];

    readonly tokens: string[][] = [
        [
            '--bloc-date-picker-selected-bg',
            '--bloc-primary / #6b7280',
            'Background of selected and range-endpoint days.',
    ],
        ['--bloc-date-picker-selected-color', '#fff', 'Text colour of selected days.'],
        [
            '--bloc-date-picker-today-border',
            '--bloc-primary / #6b7280',
            "Border colour used to highlight today's date.",
    ],
        ['--bloc-date-picker-range-bg', '#f3f4f6', 'Background of days inside the selected range.'],
        ['--bloc-date-picker-day-radius', '6px', 'Border radius of individual day cells.'],
        ['--bloc-date-picker-day-color', '#374151', 'Default text colour for day cells.'],
        ['--bloc-date-picker-day-hover-bg', '#f3f4f6', 'Day cell background on hover.'],
        ['--bloc-date-picker-nav-color', '#6b7280', 'Previous / next navigation arrow colour.'],
        ['--bloc-date-picker-nav-hover-bg', '#f3f4f6', 'Navigation button hover background.'],
        ['--bloc-date-picker-header-color', '#374151', 'Month / year header text colour.'],
    ];
    ngModelRange: DateRange = { from: null, to: null };

    readonly rangeCtrl = new FormControl<DateRange>({ from: null, to: null });

    readonly rangeFormGroup = new FormGroup({
        from: new FormControl<Date | null>(null),
        to: new FormControl<Date | null>(null),
    });

    readonly minDate = new Date(2024, 0, 1);
    readonly maxDate = new Date(2026, 11, 31);

    formatRange(from: Date | null, to: Date | null): string {
        if (from && to) return `${from.toLocaleDateString()} \u2192 ${to.toLocaleDateString()}`;
        if (from) return from.toLocaleDateString();
        return '';
    }

    readonly snippets = {
        rangeBasic: `<button blocDateRangePickerTrigger\n  #range="blocDateRangePickerTrigger">\n  <my-icon name="calendar" />\n  {{ formatRange(range.rangeStart(), range.rangeEnd()) || 'Pick a range' }}\n</button>`,
        rangeNgModel: `<button blocDateRangePickerTrigger\n  [(ngModel)]="rangeValue"\n  #range="blocDateRangePickerTrigger">\n  {{ formatRange(range.rangeStart(), range.rangeEnd()) || 'Pick a range' }}\n</button>`,
        rangeFormControl: `<button blocDateRangePickerTrigger\n  [formControl]="rangeCtrl"\n  #range="blocDateRangePickerTrigger">\n  {{ formatRange(range.rangeStart(), range.rangeEnd()) || 'Select range' }}\n</button>`,
        rangeFormGroup: `<button blocDateRangePickerTrigger\n  [rangeFormGroup]="rangeFormGroup"\n  #range="blocDateRangePickerTrigger">\n  {{ formatRange(range.rangeStart(), range.rangeEnd()) || 'Select range' }}\n</button>\n\nrangeFormGroup = new FormGroup({\n  from: new FormControl<Date | null>(null),\n  to: new FormControl<Date | null>(null),\n});`,
        rangeMinMax: `<button blocDateRangePickerTrigger\n  [(ngModel)]="rangeValue"\n  [minDate]="minDate"\n  [maxDate]="maxDate"\n  #range="blocDateRangePickerTrigger">\n  {{ formatRange(range.rangeStart(), range.rangeEnd()) || 'Pick a range' }}\n</button>`,
        rangeCustomToken: `<button blocDateRangePickerTrigger\n  style="--bloc-date-picker-selected-bg: #7c3aed;\n         --bloc-date-picker-today-border: #7c3aed"\n  #range="blocDateRangePickerTrigger">\n  {{ formatRange(range.rangeStart(), range.rangeEnd()) || 'Purple accent' }}\n</button>`,
    };
}
