import {
    Directive,
    ElementRef,
    EmbeddedViewRef,
    OnDestroy,
    Signal,
    TemplateRef,
    ViewContainerRef,
    effect,
    inject,
    input,
    output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { OverlayService } from './overlay.service';
import { OverlayRef, OverlayTemplateContext } from './overlay.ref';
import { OverlayPosition, OverlayTrigger } from './overlay.types';
import { computePosition } from './overlay.positioning';

/** CSS selector for all natively focusable elements. */
const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Directive-first overlay. Attach to any trigger element to get a lightweight,
 * positioned floating panel rendered in the global overlay container.
 *
 * ### Minimal usage
 * ```html
 * <button blocOverlay [blocOverlayContent]="tpl">Open</button>
 *
 * <ng-template #tpl let-close="close">
 *   <div class="my-panel">
 *     Hello <button (click)="close()">✕</button>
 *   </div>
 * </ng-template>
 * ```
 *
 * ### Manual / signal control
 * ```html
 * <div blocOverlay
 *      [blocOverlayContent]="tpl"
 *      blocOverlayTrigger="manual"
 *      [blocOverlayOpen]="isOpen()"
 *      (blocOverlayOpenChange)="isOpen.set($event)"
 *      #myOverlay="blocOverlay">
 * </div>
 *
 * <button (click)="myOverlay.toggle()">Toggle</button>
 * ```
 *
 * ### Mouse-position anchor
 * ```html
 * <div blocOverlay
 *      [blocOverlayContent]="tpl"
 *      blocOverlayTrigger="manual"
 *      #ctx="blocOverlay"
 *      (contextmenu)="onCtx($event, ctx)">
 * </div>
 * ```
 * ```ts
 * onCtx(e: MouseEvent, ref: BlocOverlayDirective) {
 *   e.preventDefault();
 *   ref.anchorPoint = { x: e.clientX, y: e.clientY };
 *   ref.open();
 * }
 * ```
 */
@Directive({
    selector: '[blocOverlay]',
    exportAs: 'blocOverlay',
    standalone: true,
})
export class BlocOverlayDirective implements OnDestroy {
    // ── Inputs ─────────────────────────────────────────────────────────────

    /** `<ng-template>` to render inside the overlay panel. */
    readonly content = input<TemplateRef<OverlayTemplateContext> | null>(null, {
        alias: 'blocOverlayContent',
    });

    /**
     * Placement + alignment. Default: `'bottom-start'`.
     * Format: `placement` or `placement-alignment`
     * (e.g. `'top'`, `'bottom-center'`, `'left-end'`).
     */
    readonly position = input<OverlayPosition>('bottom-start', { alias: 'blocOverlayPosition' });

    /**
     * What opens/closes the overlay.
     * - `'click'` — toggle on trigger click (default)
     * - `'hover'` — show on mouseenter, hide on mouseleave
     * - `'manual'` — no automatic listeners; control via `[blocOverlayOpen]`
     *   or the `overlayRef` / directive instance directly.
     */
    readonly trigger = input<OverlayTrigger>('click', { alias: 'blocOverlayTrigger' });

    /** Gap in pixels between the anchor and the panel. Default: `8`. */
    readonly offset = input<number>(8, { alias: 'blocOverlayOffset' });

    /** Flip to the opposite side when there is insufficient viewport space. Default: `true`. */
    readonly autoFlip = input<boolean>(true, { alias: 'blocOverlayAutoFlip' });

    /** Close overlay when clicking outside both the trigger and the panel. Default: `true`. */
    readonly closeOnOutsideClick = input<boolean>(true, {
        alias: 'blocOverlayCloseOnOutsideClick',
    });

    /** Render a lightweight backdrop behind the panel. Default: `false`. */
    readonly backdrop = input<boolean>(false, { alias: 'blocOverlayBackdrop' });

    /** CSS class(es) added to the overlay panel wrapper `<div>`. */
    readonly panelClass = input<string>('', { alias: 'blocOverlayPanelClass' });

    /** CSS class(es) added to the backdrop `<div>`. */
    readonly backdropClass = input<string>('', { alias: 'blocOverlayBackdropClass' });

    /**
     * Auto-focus the first focusable element inside the panel when it opens.
     * Default: `false`.
     */
    readonly autoFocus = input<boolean>(false, { alias: 'blocOverlayAutoFocus' });

    /**
     * Return focus to the trigger element after the overlay closes.
     * Default: `true`.
     */
    readonly restoreFocus = input<boolean>(true, { alias: 'blocOverlayRestoreFocus' });

    /** When `true`, trigger interactions (click / hover) are ignored. Default: `false`. */
    readonly disabled = input<boolean>(false, { alias: 'blocOverlayDisabled' });

    /**
     * Declarative open/close binding (best combined with `blocOverlayTrigger="manual"`).
     * Passing `true` opens the overlay; `false` closes it.
     * Leave unbound (default `undefined`) to let the trigger handle state.
     */
    readonly open = input<boolean | undefined>(undefined, { alias: 'blocOverlayOpen' });

    // ── Outputs ────────────────────────────────────────────────────────────

    /** Emits `true` when the overlay opens and `false` when it closes. */
    readonly openChange = output<boolean>({ alias: 'blocOverlayOpenChange' });

    // ── Public API (also available via exportAs="blocOverlay") ─────────────

    /** Live reference object — signals, open/close/toggle, updatePosition. */
    readonly overlayRef = new OverlayRef();

    /**
     * Convenience: reactive open state forwarded from `overlayRef.isOpen`.
     * Use in templates: `#d="blocOverlay" → {{ d.isOpen() }}`
     */
    get isOpen(): Signal<boolean> {
        return this.overlayRef.isOpen;
    }

    /** Open the overlay. No-op if already open or disabled. */
    openOverlay(): void {
        this.overlayRef.open();
    }

    /** Close the overlay. No-op if already closed. */
    closeOverlay(): void {
        this.overlayRef.close();
    }

    /** Toggle between open and closed. */
    toggle(): void {
        this.overlayRef.toggle();
    }

    /**
     * Override the anchor to a fixed viewport point (e.g. right-click position).
     * Set before calling `open()`. Cleared after the overlay closes.
     */
    anchorPoint: { x: number; y: number } | null = null;

    // ── Internals ──────────────────────────────────────────────────────────

    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _vcr = inject(ViewContainerRef);
    private readonly _doc = inject(DOCUMENT);
    private readonly _svc = inject(OverlayService);

    private _panelEl: HTMLElement | null = null;
    private _backdropEl: HTMLElement | null = null;
    private _view: EmbeddedViewRef<OverlayTemplateContext> | null = null;
    private _prevFocus: HTMLElement | null = null;

    /** Cleanup fns for the current open overlay session (scroll, keydown, outside-click). */
    private _overlayCleanup: (() => void)[] = [];
    /** Cleanup fns for trigger event listeners (re-registered when `trigger` input changes). */
    private _triggerCleanup: (() => void)[] = [];

    private _hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        // Wire OverlayRef back to this directive's private methods.
        this.overlayRef._open = () => this._openOverlay();
        this.overlayRef._close = () => this._closeOverlay();
        this.overlayRef._updatePosition = () => this._reposition();

        // React to declarative [blocOverlayOpen] binding.
        effect(() => {
            const shouldOpen = this.open();
            if (shouldOpen === undefined) return;
            if (shouldOpen && !this.overlayRef.isOpen()) {
                this._openOverlay();
            } else if (!shouldOpen && this.overlayRef.isOpen()) {
                this._closeOverlay();
            }
        });

        // Re-register trigger listeners whenever the `trigger` input changes.
        effect(() => {
            this._teardownTriggerListeners();
            this._setupTriggerListeners(this.trigger());
        });
    }

    // ── Trigger listeners ──────────────────────────────────────────────────

    private _setupTriggerListeners(trigger: OverlayTrigger): void {
        if (trigger === 'manual') return;

        const el = this._el.nativeElement;

        if (trigger === 'click') {
            const onClick = () => {
                if (!this.disabled()) this.overlayRef.toggle();
            };
            el.addEventListener('click', onClick);
            this._triggerCleanup.push(() => el.removeEventListener('click', onClick));
            return;
        }

        if (trigger === 'hover') {
            const onEnter = () => {
                if (this._hoverCloseTimer) {
                    clearTimeout(this._hoverCloseTimer);
                    this._hoverCloseTimer = null;
                }
                if (!this.disabled()) this._openOverlay();
            };

            const onLeave = (e: MouseEvent) => {
                // Delay so the user can move the cursor into the panel gap.
                this._hoverCloseTimer = setTimeout(() => {
                    if (!this._panelEl?.contains(e.relatedTarget as Node)) {
                        this._closeOverlay();
                    }
                }, 80);
            };

            el.addEventListener('mouseenter', onEnter);
            el.addEventListener('mouseleave', onLeave);
            this._triggerCleanup.push(
                () => el.removeEventListener('mouseenter', onEnter),
                () => el.removeEventListener('mouseleave', onLeave),
            );
        }
    }

    private _teardownTriggerListeners(): void {
        this._triggerCleanup.forEach((fn) => fn());
        this._triggerCleanup = [];
    }

    // ── Open / Close ───────────────────────────────────────────────────────

    private _openOverlay(): void {
        if (this.overlayRef.isOpen()) return;
        const tpl = this.content();
        if (!tpl) return;

        // Capture focus for later restoration.
        if (this.restoreFocus()) {
            this._prevFocus = this._doc.activeElement as HTMLElement;
        }

        // Optional backdrop.
        if (this.backdrop()) {
            this._backdropEl = this._svc.createBackdrop(this.backdropClass() || undefined);
            const onBackdropClick = () => this._closeOverlay();
            this._backdropEl.addEventListener('click', onBackdropClick);
            this._overlayCleanup.push(() => {
                this._backdropEl?.removeEventListener('click', onBackdropClick);
                this._backdropEl?.remove();
                this._backdropEl = null;
            });
        }

        // Panel.
        this._panelEl = this._svc.createPanel(this.panelClass() || undefined);
        this.overlayRef.overlayElement = this._panelEl;

        // Render template into panel — pass context as named properties.
        const ctx: OverlayTemplateContext = {
            close: () => this._closeOverlay(),
            ref: this.overlayRef,
        };
        this._view = this._vcr.createEmbeddedView(tpl, ctx);
        this._view.detectChanges();
        this._view.rootNodes.forEach((node) => this._panelEl!.appendChild(node));

        // Initial position (panel must be in DOM so offsetWidth/Height are available).
        this._reposition();

        // Hover: also close when cursor leaves the panel.
        if (this.trigger() === 'hover') {
            const onPanelEnter = () => {
                if (this._hoverCloseTimer) {
                    clearTimeout(this._hoverCloseTimer);
                    this._hoverCloseTimer = null;
                }
            };
            const onPanelLeave = (e: MouseEvent) => {
                if (!this._el.nativeElement.contains(e.relatedTarget as Node)) {
                    this._closeOverlay();
                }
            };
            this._panelEl.addEventListener('mouseenter', onPanelEnter);
            this._panelEl.addEventListener('mouseleave', onPanelLeave);
            this._overlayCleanup.push(
                () => this._panelEl?.removeEventListener('mouseenter', onPanelEnter),
                () => this._panelEl?.removeEventListener('mouseleave', onPanelLeave),
            );
        }

        // Scroll + resize → reposition.
        const reposition = () => this._reposition();
        this._doc.addEventListener('scroll', reposition, { passive: true, capture: true });
        window.addEventListener('resize', reposition, { passive: true });
        this._overlayCleanup.push(() => {
            this._doc.removeEventListener('scroll', reposition, {
                capture: true,
            } as EventListenerOptions);
            window.removeEventListener('resize', reposition);
        });

        // Escape key → close.
        const onKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') this._closeOverlay();
        };
        this._doc.addEventListener('keydown', onKeydown);
        this._overlayCleanup.push(() => this._doc.removeEventListener('keydown', onKeydown));

        // Outside click → close (deferred so the opening click isn't caught).
        if (this.closeOnOutsideClick()) {
            const onDocClick = (e: MouseEvent) => {
                const t = e.target as Node;
                if (!this._panelEl?.contains(t) && !this._el.nativeElement.contains(t)) {
                    this._closeOverlay();
                }
            };
            const timer = setTimeout(() => {
                this._doc.addEventListener('click', onDocClick);
            });
            this._overlayCleanup.push(() => {
                clearTimeout(timer);
                this._doc.removeEventListener('click', onDocClick);
            });
        }

        this.overlayRef._setOpen(true);
        this.openChange.emit(true);

        // Auto-focus.
        if (this.autoFocus()) {
            const focusable = this._panelEl.querySelector<HTMLElement>(FOCUSABLE);
            focusable?.focus();
        }
    }

    private _closeOverlay(): void {
        if (!this.overlayRef.isOpen()) return;

        // Run all overlay-session cleanup.
        this._overlayCleanup.forEach((fn) => fn());
        this._overlayCleanup = [];

        // Destroy the embedded view; its nodes are already in the panel and
        // will be removed with it.
        this._view?.destroy();
        this._view = null;

        // Remove panel from DOM.
        this._panelEl?.remove();
        this._panelEl = null;
        this.overlayRef.overlayElement = null;

        this.overlayRef._setOpen(false);
        this.openChange.emit(false);

        // Clear mouse-position anchor.
        this.anchorPoint = null;

        // Restore focus.
        if (this.restoreFocus() && this._prevFocus) {
            this._prevFocus.focus({ preventScroll: true });
            this._prevFocus = null;
        }
    }

    // ── Positioning ────────────────────────────────────────────────────────

    private _reposition(): void {
        if (!this._panelEl) return;

        const anchor: DOMRect = this.anchorPoint
            ? new DOMRect(this.anchorPoint.x, this.anchorPoint.y, 0, 0)
            : this._el.nativeElement.getBoundingClientRect();

        const { top, left } = computePosition(
            anchor,
            { width: this._panelEl.offsetWidth, height: this._panelEl.offsetHeight },
            this.position(),
            this.offset(),
            this.autoFlip(),
        );

        this._panelEl.style.top = `${top}px`;
        this._panelEl.style.left = `${left}px`;
    }

    // ── Lifecycle ──────────────────────────────────────────────────────────

    ngOnDestroy(): void {
        if (this._hoverCloseTimer) clearTimeout(this._hoverCloseTimer);
        this._closeOverlay();
        this._teardownTriggerListeners();
    }
}
