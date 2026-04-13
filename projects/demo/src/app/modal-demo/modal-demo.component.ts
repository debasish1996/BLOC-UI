import { Component, inject, signal } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocModalService } from '@bloc-ui/modal';
import { ConfirmModalComponent } from './confirm-modal.component';
import { DataModalComponent } from './data-modal.component';
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
    selector: 'app-modal-demo',
    standalone: true,
    imports: [
        BlocButtonComponent,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly config: string[][] = [
        ['title', 'string', '\u2014', 'Text shown in the modal header.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Dialog width variant.'],
        ['showBackdrop', 'boolean', 'true', 'Show the semi-transparent backdrop behind the modal.'],
        [
            'closeOnBackdropClick',
            'boolean',
            'true',
            'Close the modal when the backdrop is clicked.',
        ],
        ['showCloseButton', 'boolean', 'true', 'Show the \u2715 close button in the modal header.'],
        ['panelClass', 'string', '\u2014', 'Extra CSS class(es) added to the modal panel element.'],
        ['backdropClass', 'string', '\u2014', 'Extra CSS class(es) added to the backdrop element.'],
        [
            'data',
            'D',
            'null',
            'Arbitrary data injected into the content component via <code>inject(BLOC_MODAL_DATA)</code>.',
        ],
    ];

    readonly ref: string[][] = [
        [
            'afterClosed$',
            'Observable&lt;R | undefined&gt;',
            'Emits once with the result value when the modal closes, then completes.',
        ],
        ['componentInstance', 'Comp', 'Instance of the component rendered inside the modal body.'],
        [
            'close(result?)',
            'void',
            'Close the modal and optionally pass a result value back to the opener.',
        ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-modal-backdrop', 'rgba(0,0,0,0.5)', 'Backdrop overlay background colour.'],
        ['--bloc-modal-z-index', '1000', 'Stack order of the backdrop and panel.'],
        ['--bloc-modal-shadow', '0 8px 32px rgba(0,0,0,0.18)', 'Modal panel box shadow.'],
        ['--bloc-modal-sm', '360px', 'Max-width for <code>size="sm"</code>.'],
        ['--bloc-modal-md', '560px', 'Max-width for <code>size="md"</code>.'],
        ['--bloc-modal-lg', '800px', 'Max-width for <code>size="lg"</code>.'],
        ['--bloc-modal-header-padding', '16px 20px', 'Header section padding.'],
        ['--bloc-modal-body-padding', '20px', 'Body section padding.'],
        ['--bloc-modal-footer-padding', '12px 20px', 'Footer section padding.'],
        ['--bloc-surface', '#ffffff', 'Modal panel background colour.'],
        ['--bloc-radius', '8px', 'Modal panel border radius.'],
    ];

    private readonly modal = inject(BlocModalService);

    readonly lastResult = signal<string | null>(null);

    openModal(size: 'sm' | 'md' | 'lg'): void {
        const ref = this.modal.open(ConfirmModalComponent, {
            title: `Modal — ${size}`,
            size,
            data: { size, test: 'Hello from ModalDemoComponent!' },
        });
        ref.afterClosed$.subscribe((result) => console.log('Modal closed with:', result));
    }

    openNoBackdrop(): void {
        this.modal.open(ConfirmModalComponent, {
            title: 'No Backdrop',
            showBackdrop: false,
            data: { size: 'md', test: 'No backdrop overlay.' },
        });
    }

    openNoDismiss(): void {
        this.modal.open(ConfirmModalComponent, {
            title: 'Backdrop — No Dismiss',
            closeOnBackdropClick: false,
            data: { size: 'md', test: 'Clicking backdrop does nothing.' },
        });
    }

    openNoCloseButton(): void {
        this.modal.open(ConfirmModalComponent, {
            title: 'No Close Button',
            showCloseButton: false,
            data: { size: 'md', test: 'Header ✕ button is hidden.' },
        });
    }

    openPanelClass(): void {
        this.modal.open(ConfirmModalComponent, {
            title: 'Custom panelClass',
            panelClass: 'demo-panel',
            data: { size: 'md', test: 'Extra class on the modal panel.' },
        });
    }

    openBackdropClass(): void {
        this.modal.open(ConfirmModalComponent, {
            title: 'Custom backdropClass',
            backdropClass: 'bg-white/30',
            data: { size: 'md', test: 'Extra class on the backdrop.' },
        });
    }

    openWithData(): void {
        this.modal.open(DataModalComponent, {
            title: 'Edit User',
            data: { name: 'Alice', role: 'Admin' },
        });
    }

    openWithResult(): void {
        const ref = this.modal.open(ConfirmModalComponent, {
            title: 'Confirm Action',
            size: 'sm',
            data: { size: 'sm', test: 'Return value demo.' },
        });
        ref.afterClosed$.subscribe((result) => {
            this.lastResult.set(
                result === true ? 'Confirmed ✓' : result === false ? 'Cancelled ✗' : 'Dismissed',
            );
        });
    }

    readonly snippets = {
        defaultMd: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button bloc-button (click)="openModal('md')">Open Modal (md)</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `const ref = this.modal.open(MyComponent, {\n  title: 'Modal — md',\n  size: 'md',\n  data: { ... },\n});\nref.afterClosed$.subscribe(result => { });`,
            },
        ],
        small: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `this.modal.open(MyComponent, {\n  title: 'Small Modal',\n  size: 'sm',\n  data: { ... },\n});`,
            },
        ],
        large: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `this.modal.open(MyComponent, {\n  title: 'Large Modal',\n  size: 'lg',\n  data: { ... },\n});`,
            },
        ],
        noBackdrop: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `this.modal.open(MyComponent, {\n  title: 'No Backdrop',\n  showBackdrop: false,\n});`,
            },
        ],
        noDismiss: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `this.modal.open(MyComponent, {\n  title: 'No Dismiss',\n  closeOnBackdropClick: false,\n});`,
            },
        ],
        noCloseButton: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `this.modal.open(MyComponent, {\n  title: 'No Close Button',\n  showCloseButton: false,\n});`,
            },
        ],
        panelClass: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `this.modal.open(MyComponent, {\n  title: 'Custom Panel',\n  panelClass: 'my-panel',\n});`,
            },
        ],
        backdropClass: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `this.modal.open(MyComponent, {\n  title: 'Custom Backdrop',\n  backdropClass: 'bg-white/30',\n});`,
            },
        ],
        dataPass: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `const ref = this.modal.open(DataModalComponent, {\n  title: 'Edit User',\n  data: { name: 'Alice', role: 'Admin' },\n});\n\n// Inside DataModalComponent:\n// readonly data = inject<UserData>(BLOC_MODAL_DATA);`,
            },
        ],
        returnValue: [
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `const ref = this.modal.open(ConfirmComponent, {\n  title: 'Confirm Action',\n  size: 'sm',\n});\nref.afterClosed$.subscribe(result => {\n  console.log(result); // true | false | undefined\n});`,
            },
        ],
    };
}
