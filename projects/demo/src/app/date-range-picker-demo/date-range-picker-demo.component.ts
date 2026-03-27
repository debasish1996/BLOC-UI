import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocDateRangePickerTriggerDirective, DateRange } from '@bloc-ui/date-picker';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import { IconComponent } from '../icon/icon.component';

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
    ],
    templateUrl: './date-range-picker-demo.component.html',
})
export class DateRangePickerDemoComponent {
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
