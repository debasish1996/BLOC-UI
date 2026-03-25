import { inject, Injectable } from '@angular/core';
import { BlocModalConfig } from './modal.config';
import { BlocModalRef } from './modal.ref';
import { BlocModalService } from './modal.service';
import {
    BlocGenericModalContentComponent,
    BlocGenericModalContentData,
} from './generic-modal-content.component';

/** Config for an alert modal opened via {@link BlocGenericModalService}. */
export interface BlocGenericAlertConfig extends Omit<BlocModalConfig, 'data'> {
    /** Body text displayed inside the modal. */
    message?: string;
    /** Label for the dismiss button. Defaults to `'OK'`. */
    dismissText?: string;
}

/** Config for a confirm modal opened via {@link BlocGenericModalService}. */
export interface BlocGenericConfirmConfig extends Omit<BlocModalConfig, 'data'> {
    /** Body text displayed inside the modal. */
    message?: string;
    /** Label for the confirm button. Defaults to `'Confirm'`. */
    confirmText?: string;
    /** Label for the cancel button. Defaults to `'Cancel'`. */
    cancelText?: string;
}

/**
 * A simpler modal service that does not require a dedicated content component.
 * Pass a title, message and optional button labels — the rest is handled internally.
 *
 * ```ts
 * // Alert
 * this.genericModal.alert({ title: 'Saved!', message: 'Your changes have been saved.' });
 *
 * // Confirm
 * const ref = this.genericModal.confirm({ title: 'Delete item?', message: 'This cannot be undone.' });
 * ref.afterClosed$.subscribe(confirmed => { if (confirmed) deleteItem(); });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class BlocGenericModalService {
    private readonly _modal = inject(BlocModalService);

    /**
     * Opens a simple alert modal with a single dismiss button.
     * @returns A `BlocModalRef` that resolves with `undefined` when dismissed.
     */
    alert(config: BlocGenericAlertConfig = {}): BlocModalRef<unknown, undefined> {
        const data: BlocGenericModalContentData = {
            message: config.message ?? '',
            type: 'alert',
            confirmText: '',
            cancelText: '',
            dismissText: config.dismissText ?? 'OK',
        };
        return this._modal.open(
            BlocGenericModalContentComponent,
            { ...config, data },
        ) as unknown as BlocModalRef<unknown, undefined>;
    }

    /**
     * Opens a confirm modal with cancel and confirm buttons.
     * @returns A `BlocModalRef` that resolves with `true` on confirm or `false` on cancel.
     */
    confirm(config: BlocGenericConfirmConfig = {}): BlocModalRef<unknown, boolean> {
        const data: BlocGenericModalContentData = {
            message: config.message ?? '',
            type: 'confirm',
            confirmText: config.confirmText ?? 'Confirm',
            cancelText: config.cancelText ?? 'Cancel',
            dismissText: '',
        };
        return this._modal.open(
            BlocGenericModalContentComponent,
            { ...config, data },
        ) as unknown as BlocModalRef<unknown, boolean>;
    }
}
