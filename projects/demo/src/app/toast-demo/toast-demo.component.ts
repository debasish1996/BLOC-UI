import { Component, inject } from '@angular/core';
import { BlocToastService } from '@bloc-ui/toast';
import { BlocButtonComponent } from 'bloc-ui-core';
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
    selector: 'app-toast-demo',
    standalone: true,
    imports: [
        BlocButtonComponent,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './toast-demo.component.html',
})
export class ToastDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly methods: string[][] = [
        [
            'show(config)',
            'number',
            'Show a toast with full <code>BlocToastConfig</code>. Returns the toast ID.',
        ],
        ['info(message, title?)', 'number', 'Shorthand for an info-type toast.'],
        ['success(message, title?)', 'number', 'Shorthand for a success-type toast.'],
        ['warning(message, title?)', 'number', 'Shorthand for a warning-type toast.'],
        ['error(message, title?)', 'number', 'Shorthand for an error-type toast.'],
        ['dismiss(id)', 'void', 'Dismiss a specific toast by its ID.'],
        ['dismissAll()', 'void', 'Dismiss all currently visible toasts.'],
    ];

    readonly config: string[][] = [
        ['message', 'string', '—', 'Toast message text. Required.'],
        ['title', 'string', '—', 'Optional heading shown above the message.'],
        [
            'type',
            "'info' | 'success' | 'warning' | 'error'",
            "'info'",
            'Severity level; drives the icon and accent colour.',
        ],
        [
            'duration',
            'number',
            '4000',
            'Auto-dismiss delay in ms. Set to <code>0</code> to disable auto-dismiss.',
        ],
        [
            'dismissible',
            'boolean',
            'true',
            'Whether the user can close the toast via the ✕ button.',
        ],
        [
            'position',
            "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'",
            "'top-right'",
            'Screen corner where the toast appears.',
        ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-toast-bg', '#ffffff', 'Toast background colour.'],
        ['--bloc-toast-border', '--bloc-border / #d1d5db', 'Toast border colour.'],
        ['--bloc-toast-shadow', '0 4px 12px rgba(0,0,0,0.1)', 'Toast box shadow.'],
        ['--bloc-toast-padding', '12px 14px', 'Inner padding of the toast.'],
        ['--bloc-toast-radius', '8px', 'Toast border radius.'],
        ['--bloc-toast-title-color', '#374151', 'Title text colour.'],
        ['--bloc-toast-message-color', '#6b7280', 'Message text colour.'],
        ['--bloc-toast-info-color', '#6b7280', 'Info icon and left-border accent colour.'],
        ['--bloc-toast-success-color', '#16a34a', 'Success icon and left-border accent colour.'],
        ['--bloc-toast-warning-color', '#d97706', 'Warning icon and left-border accent colour.'],
        ['--bloc-toast-error-color', '#dc2626', 'Error icon and left-border accent colour.'],
        ['--bloc-toast-close-color', '#9ca3af', 'Close button icon colour.'],
        ['--bloc-toast-close-hover-bg', '#f3f4f6', 'Close button hover background.'],
    ];

    private readonly toast = inject(BlocToastService);

    showInfo(): void {
        this.toast.info('This is an informational message.');
    }

    showSuccess(): void {
        this.toast.success('Operation completed successfully!', 'Success');
    }

    showWarning(): void {
        this.toast.warning('Please review your input before continuing.', 'Warning');
    }

    showError(): void {
        this.toast.error('Something went wrong. Please try again.', 'Error');
    }

    showPersistent(): void {
        this.toast.show({
            message: 'This toast will not auto-dismiss.',
            type: 'info',
            title: 'Persistent',
            duration: 0,
        });
    }

    showNonDismissible(): void {
        this.toast.show({
            message: 'Cannot be closed manually.',
            type: 'warning',
            dismissible: false,
            duration: 5000,
        });
    }

    dismissAll(): void {
        this.toast.dismissAll();
    }

    readonly snippets = {
        info: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `toastService.info('Informational message.');`,
            },
        ],
        success: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `toastService.success('Operation completed!', 'Success');`,
            },
        ],
        warning: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `toastService.warning('Review your input.', 'Warning');`,
            },
        ],
        error: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `toastService.error('Something went wrong.', 'Error');`,
            },
        ],
        persistent: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `toastService.show({\n  message: 'This toast will not auto-dismiss.',\n  type: 'info',\n  title: 'Persistent',\n  duration: 0,\n});`,
            },
        ],
        nonDismissible: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `toastService.show({\n  message: 'Cannot be closed manually.',\n  type: 'warning',\n  dismissible: false,\n  duration: 5000,\n});`,
            },
        ],
        inject: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `private readonly toast = inject(BlocToastService);`,
            },
        ],
        container: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<!-- in app.component.html -->\n<bloc-toast-container />`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocToastContainerComponent } from '@bloc-ui/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BlocToastContainerComponent],
  templateUrl: './example.component.html',
})
export class AppComponent {}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<!-- Override colours on the container -->\n<bloc-toast-container\n  style="--bloc-toast-success-color: #7c3aed;\n         --bloc-toast-bg: #faf5ff;\n         --bloc-toast-border: #e9d5ff" />`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocToastContainerComponent } from '@bloc-ui/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BlocToastContainerComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})
export class AppComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.custom-toast-container {\n  --bloc-toast-success-color: #7c3aed;\n  --bloc-toast-bg: #faf5ff;\n  --bloc-toast-border: #e9d5ff;\n}`,
            },
        ],
    };
}
