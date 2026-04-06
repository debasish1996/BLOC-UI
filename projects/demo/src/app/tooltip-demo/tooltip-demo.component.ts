import { Component } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui-core';
import { BlocTooltipDirective } from '@bloc-ui/tooltip';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-tooltip-demo',
    standalone: true,
    imports: [
        BlocButtonComponent,
        BlocTooltipDirective,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './tooltip-demo.component.html',
})
export class TooltipDemoComponent {
    readonly snippets = {
        basic: `<button [blocTooltip]="'Save changes'">Save</button>`,
        positions: `<button [blocTooltip]="'Top tooltip'" tooltipPosition="top">Top</button>\n<button [blocTooltip]="'Bottom tooltip'" tooltipPosition="bottom">Bottom</button>\n<button [blocTooltip]="'Left tooltip'" tooltipPosition="left">Left</button>\n<button [blocTooltip]="'Right tooltip'" tooltipPosition="right">Right</button>`,
        disabled: `<button [blocTooltip]="'You cannot see me'" [tooltipDisabled]="true">Disabled tooltip</button>`,
        delays: `<button\n  [blocTooltip]="'Slow show, fast hide'"\n  [tooltipShowDelay]="600"\n  [tooltipHideDelay]="0"\n>Hover me</button>`,
        customToken: `<button\n  [blocTooltip]="'Custom styled tooltip'"\n  style="--bloc-tooltip-bg: #1e40af; --bloc-tooltip-color: #bfdbfe; --bloc-tooltip-radius: 8px"\n>Themed</button>`,
    };
}
