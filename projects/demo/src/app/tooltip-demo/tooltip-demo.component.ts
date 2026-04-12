import { Component } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui-core';
import { BlocTooltipDirective } from '@bloc-ui/tooltip';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-tooltip-demo',
    standalone: true,
    imports: [
        BlocButtonComponent,
        BlocTooltipDirective,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './tooltip-demo.component.html',
})
export class TooltipDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['blocTooltip', 'string', '—', 'Tooltip text content. Required.'],
        [
            'tooltipPosition',
            "'top' | 'bottom' | 'left' | 'right'",
            "'top'",
            'Placement of the tooltip panel relative to the host.',
    ],
        ['tooltipDisabled', 'boolean', 'false', 'When true, suppresses the tooltip entirely.'],
        [
            'tooltipShowDelay',
            'number',
            '200',
            'Milliseconds before showing the tooltip after hover/focus.',
    ],
        [
            'tooltipHideDelay',
            'number',
            '100',
            'Milliseconds before hiding the tooltip after leave/blur.',
    ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-tooltip-bg', '#374151', 'Tooltip background colour.'],
        ['--bloc-tooltip-color', '#f9fafb', 'Tooltip text colour.'],
        ['--bloc-tooltip-padding', '6px 10px', 'Inner padding of the tooltip panel.'],
        ['--bloc-tooltip-radius', '4px', 'Border-radius of the tooltip panel.'],
        ['--bloc-tooltip-font-size', '12px', 'Tooltip font size.'],
        ['--bloc-tooltip-line-height', '1.4', 'Tooltip line height.'],
        ['--bloc-tooltip-max-width', '240px', 'Maximum width of the tooltip panel.'],
    ];

    readonly snippets = {
        basic: `<button [blocTooltip]="'Save changes'">Save</button>`,
        positions: `<button [blocTooltip]="'Top tooltip'" tooltipPosition="top">Top</button>\n<button [blocTooltip]="'Bottom tooltip'" tooltipPosition="bottom">Bottom</button>\n<button [blocTooltip]="'Left tooltip'" tooltipPosition="left">Left</button>\n<button [blocTooltip]="'Right tooltip'" tooltipPosition="right">Right</button>`,
        disabled: `<button [blocTooltip]="'You cannot see me'" [tooltipDisabled]="true">Disabled tooltip</button>`,
        delays: `<button\n  [blocTooltip]="'Slow show, fast hide'"\n  [tooltipShowDelay]="600"\n  [tooltipHideDelay]="0"\n>Hover me</button>`,
        customToken: `<button\n  [blocTooltip]="'Custom styled tooltip'"\n  style="--bloc-tooltip-bg: #1e40af; --bloc-tooltip-color: #bfdbfe; --bloc-tooltip-radius: 8px"\n>Themed</button>`,
    };
}
