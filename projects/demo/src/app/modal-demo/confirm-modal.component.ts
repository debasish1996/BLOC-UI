import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocModal } from '@bloc-ui/modal';

export interface ConfirmModalData {
    size: 'sm' | 'md' | 'lg';
    test: string;
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
export class ConfirmModalComponent extends BlocModal<ConfirmModalData, boolean> {
    cancel(): void {
        this.modalRef.close(false);
    }
    confirm(): void {
        this.modalRef.close(true);
    }
}
