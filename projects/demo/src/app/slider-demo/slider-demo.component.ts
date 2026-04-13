import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BlocSliderComponent } from '@bloc-ui/slider';

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
    selector: 'app-slider-demo',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        BlocSliderComponent,
        InstallCommandComponent,
        SampleCodeComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './slider-demo.component.html',
})
export class SliderDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['min', 'number', '0', 'Minimum selectable value.'],
        ['max', 'number', '100', 'Maximum selectable value.'],
        ['step', 'number', '1', 'Step increment between values.'],
        ['label', 'string', "''", 'Label rendered above the track.'],
        ['showValue', 'boolean', 'true', 'Displays the current numeric value alongside the label.'],
        [
            'disabled',
            'boolean',
            'false',
            'Disables the slider. Also honoured by Angular reactive forms via <code>setDisabledState</code>.',
        ],
    ];

    readonly outputs: string[][] = [
        ['valueChange', 'number', 'Emits the new numeric value on every input event.'],
    ];

    readonly tokens: string[][] = [
        ['--bloc-slider-fill', '#2563eb', 'Filled (left-of-thumb) track colour.'],
        ['--bloc-slider-track', '#dbe3ee', 'Unfilled (right-of-thumb) track colour.'],
        ['--bloc-slider-thumb', '#2563eb', 'Thumb background colour.'],
        ['--bloc-slider-color', '#0f172a', 'Label text colour.'],
        ['--bloc-slider-muted', '#64748b', 'Value display text colour.'],
    ];

    readonly volumeControl = new FormControl(35, { nonNullable: true });
    readonly budgetControl = new FormControl(60, { nonNullable: true });

    readonly snippets = {
        reactive: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-slider\n  label="Volume"\n  [min]="0"\n  [max]="100"\n  [step]="5"\n  [formControl]="volumeControl"\n></bloc-slider>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { BlocSliderComponent } from '@bloc-ui/slider';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, BlocSliderComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly volumeControl = new FormControl(35, { nonNullable: true });\n}`,
            },
        ],
        customRange: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-slider\n  label="Budget allocation"\n  [min]="10"\n  [max]="120"\n  [step]="10"\n  [formControl]="budgetControl"\n></bloc-slider>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { BlocSliderComponent } from '@bloc-ui/slider';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, BlocSliderComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  readonly budgetControl = new FormControl(60, { nonNullable: true });\n}`,
            },
        ],
    };
}
