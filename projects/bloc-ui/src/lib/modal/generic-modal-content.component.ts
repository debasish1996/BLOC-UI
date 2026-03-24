import { Component } from '@angular/core';
import { BlocButtonComponent } from '../button/button.component';
import { BlocModal } from './modal.config';

/** @internal Data shape consumed by BlocGenericModalContentComponent. */
export interface BlocGenericModalContentData {
  message: string;
  type: 'alert' | 'confirm';
  confirmText: string;
  cancelText: string;
  dismissText: string;
}

/**
 * @internal
 * Generic content component rendered by BlocGenericModalService.
 * Not part of the public API — use BlocGenericModalService instead.
 */
@Component({
  selector: 'bloc-generic-modal-content',
  standalone: true,
  imports: [BlocButtonComponent],
  template: `
    @if (data.message) {
      <p style="margin:0 0 1rem">{{ data.message }}</p>
    }
    <div style="display:flex;gap:8px;justify-content:flex-end">
      @if (data.type === 'confirm') {
        <button blocButton variant="outline" (clicked)="cancel()">{{ data.cancelText }}</button>
        <button blocButton variant="primary" (clicked)="confirm()">{{ data.confirmText }}</button>
      } @else {
        <button blocButton variant="primary" (clicked)="dismiss()">{{ data.dismissText }}</button>
      }
    </div>
  `,
})
export class BlocGenericModalContentComponent extends BlocModal<BlocGenericModalContentData, boolean | undefined> {
  cancel(): void { this.modalRef.close(false); }
  confirm(): void { this.modalRef.close(true); }
  dismiss(): void { this.modalRef.close(undefined); }
}
