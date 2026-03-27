import { Component, inject, input, ViewChild, ViewContainerRef } from '@angular/core';
import { BlocModalRef } from './modal.ref';

/**
 * @internal
 * Shell component created dynamically by BlocModalService.
 * Not part of the public API — use BlocModalService.open() instead.
 */
@Component({
    selector: 'bloc-modal-container',
    standalone: true,
    template: `
        <div
            class="bloc-modal-backdrop"
            [class.bloc-modal-backdrop--hidden]="!showBackdrop()"
            [class]="backdropClass()"
            (click)="_onBackdropClick()"
        >
            <div
                class="bloc-modal"
                [class]="'bloc-modal--' + size() + (panelClass() ? ' ' + panelClass() : '')"
                role="dialog"
                aria-modal="true"
                (click)="$event.stopPropagation()"
            >
                <div class="bloc-modal__header">
                    @if (title()) {
                        <h2 class="bloc-modal__title">{{ title() }}</h2>
                    }
                    @if (showCloseButton()) {
                        <button
                            class="bloc-modal__close"
                            aria-label="Close modal"
                            (click)="_close()"
                        >
                            &#x2715;
                        </button>
                    }
                </div>
                <div class="bloc-modal__body">
                    <ng-container #contentOutlet></ng-container>
                </div>
            </div>
        </div>
    `,
    styleUrl: './modal.component.scss',
})
export class BlocModalContainerComponent {
    @ViewChild('contentOutlet', { read: ViewContainerRef, static: true })
    readonly contentVcr!: ViewContainerRef;

    readonly title = input<string>('');
    readonly size = input<'sm' | 'md' | 'lg'>('md');
    readonly showBackdrop = input<boolean>(true);
    readonly closeOnBackdropClick = input<boolean>(true);
    readonly showCloseButton = input<boolean>(true);
    readonly backdropClass = input<string>('');
    readonly panelClass = input<string>('');

    private readonly _modalRef = inject(BlocModalRef);

    _onBackdropClick(): void {
        if (this.closeOnBackdropClick()) {
            this._modalRef.close();
        }
    }

    _close(): void {
        this._modalRef.close();
    }
}
