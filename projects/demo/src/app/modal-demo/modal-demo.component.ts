import { Component, signal } from '@angular/core';
import { BlocButtonComponent, BlocModalComponent } from 'bloc-ui';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [BlocButtonComponent, BlocModalComponent],
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  readonly modalOpenSize = signal<'sm' | 'md' | 'lg' | null>(null);

  openModal(size: 'sm' | 'md' | 'lg'): void {
    this.modalOpenSize.set(size);
  }

  closeModal(): void {
    this.modalOpenSize.set(null);
  }
}
