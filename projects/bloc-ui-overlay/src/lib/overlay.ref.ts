import { signal, Signal } from '@angular/core';

/**
 * A live handle to a rendered overlay. Returned by `BlocOverlayDirective`
 * via `exportAs="blocOverlay"`.
 *
 * ```html
 * <button blocOverlay [blocOverlayContent]="tpl" #myOverlay="blocOverlay">
 *   Open
 * </button>
 *
 * <span>{{ myOverlay.isOpen() }}</span>
 * ```
 */
export class OverlayRef {
    private readonly _isOpen = signal(false);

    /** Reactive open-state signal. Use directly in templates or effects. */
    readonly isOpen: Signal<boolean> = this._isOpen.asReadonly();

    /** The rendered overlay panel `<div>`. Non-null only while the overlay is open. */
    overlayElement: HTMLElement | null = null;

    /** @internal — wired by `BlocOverlayDirective` */
    _open!: () => void;
    /** @internal — wired by `BlocOverlayDirective` */
    _close!: () => void;
    /** @internal — wired by `BlocOverlayDirective` */
    _updatePosition!: () => void;

    /** Open the overlay. No-op if already open. */
    open(): void {
        this._open?.();
    }

    /** Close the overlay. No-op if already closed. */
    close(): void {
        this._close?.();
    }

    /** Toggle between open and closed. */
    toggle(): void {
        this._isOpen() ? this.close() : this.open();
    }

    /**
     * Force-recompute the overlay position.
     * Useful after dynamic content changes the panel size.
     */
    updatePosition(): void {
        this._updatePosition?.();
    }

    /** @internal */
    _setOpen(val: boolean): void {
        this._isOpen.set(val);
    }
}

/**
 * Context object injected into an overlay `<ng-template>` via `let-` bindings.
 *
 * ```html
 * <ng-template #tpl let-close="close" let-ref="ref">
 *   <button (click)="close()">Close</button>
 * </ng-template>
 * ```
 */
export interface OverlayTemplateContext {
    /** Closes the overlay. */
    close: () => void;
    /** Live reference to the overlay instance. */
    ref: OverlayRef;
}

/**
 * Context object injected into an overlay `<ng-template>` via `let-` bindings.
 *
 * ```html
 * <ng-template #tpl let-close="close" let-ref="ref">
 *   <button (click)="close()">Close</button>
 * </ng-template>
 * ```
 */
export interface OverlayTemplateContext {
    /** Closes the overlay. */
    close: () => void;
    /** Live reference to the overlay instance. */
    ref: OverlayRef;
}
