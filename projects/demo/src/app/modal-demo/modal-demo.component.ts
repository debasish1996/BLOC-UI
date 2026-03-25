import { Component, inject } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocGenericModalService, BlocModalService } from '@bloc-ui/modal';
import { ConfirmModalComponent } from './confirm-modal.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [BlocButtonComponent, SampleCodeComponent],
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  private readonly modal = inject(BlocModalService);
  private readonly genericModal = inject(BlocGenericModalService);

  openModal(size: 'sm' | 'md' | 'lg'): void {
    const ref = this.modal.open(ConfirmModalComponent, {
      title: `Modal — ${size}`,
      size,
      data: { size, test: 'Hello from ModalDemoComponent!' },
    });
    ref.afterClosed$.subscribe(result => console.log('Modal closed with:', result));
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
      backdropClass: 'demo-backdrop',
      data: { size: 'md', test: 'Extra class on the backdrop.' },
    });
  }

  // --- BlocGenericModalService demos ---

  openGenericAlert(): void {
    this.genericModal.alert({
      title: 'Notice',
      message: 'Your session will expire in 5 minutes.',
    });
  }

  openGenericConfirm(): void {
    const ref = this.genericModal.confirm({
      title: 'Delete item?',
      message: 'This action is permanent and cannot be undone.',
    });
    ref.afterClosed$.subscribe(confirmed =>
      console.log('Generic confirm result:', confirmed),
    );
  }

  openGenericCustomTexts(): void {
    const ref = this.genericModal.confirm({
      title: 'Leave page?',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      confirmText: 'Leave',
      cancelText: 'Stay',
      size: 'sm',
    });
    ref.afterClosed$.subscribe(confirmed =>
      console.log('Leave page:', confirmed),
    );
  }

  readonly snippets = {
    defaultMd: `const ref = this.modal.open(MyComponent, {\n  title: 'Modal — md',\n  size: 'md',\n  data: { ... },\n});\nref.afterClosed$.subscribe(result => { });`,
    small: `this.modal.open(MyComponent, {\n  title: 'Small Modal',\n  size: 'sm',\n  data: { ... },\n});`,
    large: `this.modal.open(MyComponent, {\n  title: 'Large Modal',\n  size: 'lg',\n  data: { ... },\n});`,
    noBackdrop: `this.modal.open(MyComponent, {\n  title: 'No Backdrop',\n  showBackdrop: false,\n});`,
    noDismiss: `this.modal.open(MyComponent, {\n  title: 'No Dismiss',\n  closeOnBackdropClick: false,\n});`,
    noCloseButton: `this.modal.open(MyComponent, {\n  title: 'No Close Button',\n  showCloseButton: false,\n});`,
    panelClass: `this.modal.open(MyComponent, {\n  title: 'Custom Panel',\n  panelClass: 'my-panel',\n});`,
    backdropClass: `this.modal.open(MyComponent, {\n  title: 'Custom Backdrop',\n  backdropClass: 'my-backdrop',\n});`,
    alert: `this.genericModal.alert({\n  title: 'Notice',\n  message: 'Your session will expire.',\n});`,
    confirm: `const ref = this.genericModal.confirm({\n  title: 'Delete item?',\n  message: 'This action cannot be undone.',\n});\nref.afterClosed$.subscribe(confirmed => { });`,
    customLabels: `this.genericModal.confirm({\n  title: 'Leave page?',\n  message: 'You have unsaved changes.',\n  confirmText: 'Leave',\n  cancelText: 'Stay',\n  size: 'sm',\n});`,
  };
}
