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
      data: { size },
    });

    ref.afterClosed$.subscribe(result => {
      console.log('Modal closed with:', result);
    });
  }
}
