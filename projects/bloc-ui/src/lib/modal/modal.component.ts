import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bloc-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class BlocModalComponent {
  /** Whether the modal is visible. */
  readonly isOpen = input<boolean>(false);

  /** Modal header title. */
  readonly title = input<string>('');

  /** Modal size variant. */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  /** Whether clicking the backdrop closes the modal. */
  readonly closeOnBackdropClick = input<boolean>(true);

  /** Emits when the modal requests to be closed. */
  readonly closed = output<void>();

  onBackdropClick(): void {
    if (this.closeOnBackdropClick()) {
      this.closed.emit();
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
