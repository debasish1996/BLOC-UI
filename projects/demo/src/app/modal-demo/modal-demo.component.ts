import { Component, inject, signal } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocModalService } from '@bloc-ui/modal';
import { ConfirmModalComponent } from './confirm-modal.component';
import { DataModalComponent } from './data-modal.component';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-modal-demo',
    standalone: true,
    imports: [BlocButtonComponent, SampleCodeComponent, InstallCommandComponent],
    templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
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
        defaultMd: `const ref = this.modal.open(MyComponent, {\n  title: 'Modal — md',\n  size: 'md',\n  data: { ... },\n});\nref.afterClosed$.subscribe(result => { });`,
        small: `this.modal.open(MyComponent, {\n  title: 'Small Modal',\n  size: 'sm',\n  data: { ... },\n});`,
        large: `this.modal.open(MyComponent, {\n  title: 'Large Modal',\n  size: 'lg',\n  data: { ... },\n});`,
        noBackdrop: `this.modal.open(MyComponent, {\n  title: 'No Backdrop',\n  showBackdrop: false,\n});`,
        noDismiss: `this.modal.open(MyComponent, {\n  title: 'No Dismiss',\n  closeOnBackdropClick: false,\n});`,
        noCloseButton: `this.modal.open(MyComponent, {\n  title: 'No Close Button',\n  showCloseButton: false,\n});`,
        panelClass: `this.modal.open(MyComponent, {\n  title: 'Custom Panel',\n  panelClass: 'my-panel',\n});`,
        backdropClass: `this.modal.open(MyComponent, {\n  title: 'Custom Backdrop',\n  backdropClass: 'bg-white/30',\n});`,
        dataPass: `const ref = this.modal.open(DataModalComponent, {\n  title: 'Edit User',\n  data: { name: 'Alice', role: 'Admin' },\n});\n\n// Inside DataModalComponent:\n// readonly data = inject<UserData>(BLOC_MODAL_DATA);`,
        returnValue: `const ref = this.modal.open(ConfirmComponent, {\n  title: 'Confirm Action',\n  size: 'sm',\n});\nref.afterClosed$.subscribe(result => {\n  console.log(result); // true | false | undefined\n});`,
    };
}
