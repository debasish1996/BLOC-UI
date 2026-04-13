import { Component, signal } from '@angular/core';
import { BlocAlertComponent, BlocAlertIconDirective } from '@bloc-ui/alert';

import { IconComponent } from '../icon/icon.component';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    ApiColumnDef,
    INPUTS_COLUMNS,
    OUTPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-alert-demo',
    standalone: true,
    imports: [
        BlocAlertComponent,
        BlocAlertIconDirective,
        IconComponent,
        InstallCommandComponent,
        SampleCodeComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './alert-demo.component.html',
})
export class AlertDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'variant',
            "'info' | 'success' | 'warning' | 'danger'",
            "'info'",
            'Semantic colour and ARIA role variant.',
        ],
        ['title', 'string', "''", 'Optional bold title rendered above the content.'],
        ['dismissible', 'boolean', 'false', 'Shows a close button that hides the alert.'],
        [
            'closeLabel',
            'string',
            "'Dismiss alert'",
            '<code>aria-label</code> for the close button.',
        ],
        [
            'live',
            "'assertive' | 'polite' | undefined",
            'undefined',
            'Forces a specific ARIA live region role. Omit to use variant default.',
        ],
        [
            'visible',
            'boolean',
            'true',
            'Controls visibility externally. Both <code>visible</code> and the internal dismiss state must be true to show.',
        ],
        ['hideIcon', 'boolean', 'false', 'Removes the icon column from the layout.'],
    ];

    readonly outputs: string[][] = [
        ['dismissed', 'void', 'Emits when the user clicks the close button.'],
    ];

    readonly tokens: string[][] = [
        ['--bloc-alert-border', '#d1d5db', 'Outer border colour.'],
        ['--bloc-alert-bg', '#f9fafb', 'Alert background.'],
        ['--bloc-alert-color', '#374151', 'Body text colour.'],
        ['--bloc-alert-accent', '#f3f4f6', 'Icon badge background.'],
        ['--bloc-alert-accent-color', '#374151', 'Icon badge text colour.'],
        [
            '--bloc-alert-[variant]-bg / -border / -accent / -accent-color',
            'variant defaults',
            'Per-variant overrides (e.g. <code>--bloc-alert-success-bg</code>).',
        ],
    ];
    readonly dismissed = signal(false);

    readonly snippets = {
        basic: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-alert variant="info" title="Heads up">\n  Alerts work well for inline guidance, success messaging, and warnings.\n</bloc-alert>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocAlertComponent } from '@bloc-ui/alert';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocAlertComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        dismissible: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-alert\n  variant="warning"\n  title="Sync paused"\n  [dismissible]="true"\n>\n  Reconnect to resume background sync.\n</bloc-alert>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';
import { BlocAlertComponent } from '@bloc-ui/alert';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocAlertComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  dismissed = signal(false);
}`,
            },
        ],
        customIcon: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-alert variant="success" title="Deployed">\n  <svg blocAlertIcon ...>...</svg>\n  Your build passed all checks and is live in production.\n</bloc-alert>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocAlertComponent, BlocAlertIconDirective } from '@bloc-ui/alert';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocAlertComponent, BlocAlertIconDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        noIcon: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-alert variant="info" title="Scheduled maintenance" [hideIcon]="true">\n  The system will be unavailable on Sunday between 02:00 and 04:00 UTC.\n</bloc-alert>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocAlertComponent } from '@bloc-ui/alert';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocAlertComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
    };

    restoreAlert(): void {
        this.dismissed.set(false);
    }
}
