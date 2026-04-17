import { Component, inject } from '@angular/core';
import { BlocToastService } from './toast.service';
import { BlocToastComponent } from './toast.component';

/**
 * @internal Container that renders all active toasts.
 * Automatically appended to `document.body` by `BlocToastService`.
 */
@Component({
    selector: 'bloc-toast-container',
    standalone: true,
    imports: [BlocToastComponent],
    template: `
        @for (toast of toastService.toasts(); track toast.id) {
            <bloc-toast [toast]="toast" (dismissed)="toastService.dismiss(toast.id)" />
        }
    `,
    styleUrl: './toast-container.component.scss',
    host: {
        '[class.bloc-toast-container]': 'true',
    },
})
export class BlocToastContainerComponent {
    protected readonly toastService = inject(BlocToastService);
}
