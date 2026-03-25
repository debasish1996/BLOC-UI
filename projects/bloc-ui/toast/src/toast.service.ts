import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    inject,
    Injectable,
    signal,
} from '@angular/core';
import { BlocToastConfig, BlocToastInstance } from './toast.config';
import { BlocToastContainerComponent } from './toast-container.component';

/**
 * Service for showing toast notifications.
 *
 * ```ts
 * toastService.show({ message: 'Saved!', type: 'success' });
 * toastService.info('Something happened');
 * toastService.error('Failed to save');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class BlocToastService {
    private readonly _appRef = inject(ApplicationRef);
    private readonly _injector = inject(EnvironmentInjector);

    /** All currently visible toasts. */
    readonly toasts = signal<BlocToastInstance[]>([]);

    private _nextId = 0;
    private _containerRef: ComponentRef<BlocToastContainerComponent> | null = null;

    /** Show a toast with full configuration. */
    show(config: BlocToastConfig): number {
        const toast: BlocToastInstance = {
            id: this._nextId++,
            message: config.message,
            title: config.title ?? '',
            type: config.type ?? 'info',
            duration: config.duration ?? 4000,
            dismissible: config.dismissible ?? true,
            position: config.position ?? 'top-right',
        };

        this._ensureContainer();
        this.toasts.update((list) => [...list, toast]);

        if (toast.duration > 0) {
            setTimeout(() => this.dismiss(toast.id), toast.duration);
        }

        return toast.id;
    }

    /** Shorthand for an info toast. */
    info(message: string, title?: string): number {
        return this.show({ message, title, type: 'info' });
    }

    /** Shorthand for a success toast. */
    success(message: string, title?: string): number {
        return this.show({ message, title, type: 'success' });
    }

    /** Shorthand for a warning toast. */
    warning(message: string, title?: string): number {
        return this.show({ message, title, type: 'warning' });
    }

    /** Shorthand for an error toast. */
    error(message: string, title?: string): number {
        return this.show({ message, title, type: 'error' });
    }

    /** Dismiss a specific toast by ID. */
    dismiss(id: number): void {
        this.toasts.update((list) => list.filter((t) => t.id !== id));
    }

    /** Dismiss all toasts. */
    dismissAll(): void {
        this.toasts.set([]);
    }

    private _ensureContainer(): void {
        if (this._containerRef) return;

        this._containerRef = createComponent(BlocToastContainerComponent, {
            environmentInjector: this._injector,
        });
        this._appRef.attachView(this._containerRef.hostView);
        document.body.appendChild(this._containerRef.location.nativeElement);
    }
}
