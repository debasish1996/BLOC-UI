import { Component, inject } from '@angular/core';
import { BlocButtonComponent, BlocModalService } from 'bloc-ui';
import { ConfirmModalComponent } from './confirm-modal.component';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  private readonly modal = inject(BlocModalService);

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
}
