import { Component, inject } from '@angular/core';
import { BlocButtonComponent, BlocModalRef, BLOC_MODAL_DATA } from 'bloc-ui';

export interface ConfirmModalData {
  size: 'sm' | 'md' | 'lg';
}

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [BlocButtonComponent],
  template: `
    <p class="m-0 mb-3">
      Are you sure you want to delete this item? This action is permanent and
      <strong>cannot be undone</strong>.
    </p>
    <p class="m-0 text-slate-400">
      If you change your mind, click <em>Cancel</em> to go back safely.
    </p>
    <div class="flex gap-2 justify-end mt-5">
      <button blocButton variant="outline" (clicked)="cancel()">Cancel</button>
      <button blocButton variant="primary" (clicked)="confirm()">Confirm</button>
    </div>
  `,
})
export class ConfirmModalComponent {
  private readonly modalRef = inject(BlocModalRef);
  readonly data = inject<ConfirmModalData>(BLOC_MODAL_DATA);

  cancel(): void { this.modalRef.close(false); }
  confirm(): void { this.modalRef.close(true); }
}
