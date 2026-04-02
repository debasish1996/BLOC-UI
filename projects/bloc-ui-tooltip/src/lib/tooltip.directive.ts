import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OverlayService, computePosition, OverlayPosition } from '@bloc-ui/overlay';

const TOOLTIP_OFFSET = 8;
let _tooltipIdCounter = 0;

const TOOLTIP_CSS = [
    '@layer bloc-tooltip{',
    ':where(.bloc-tooltip-panel){',
    'background:var(--bloc-tooltip-bg,#374151);',
    'color:var(--bloc-tooltip-color,#f9fafb);',
    'padding:var(--bloc-tooltip-padding,4px 8px);',
    'border-radius:var(--bloc-tooltip-radius,4px);',
    'font-size:var(--bloc-tooltip-font-size,12px);',
    'line-height:var(--bloc-tooltip-line-height,1.4);',
    'max-width:var(--bloc-tooltip-max-width,240px);',
    'word-wrap:break-word;',
    'pointer-events:none;',
    'white-space:pre-wrap}}',
].join('');

function ensureTooltipStyles(doc: Document): void {
    if (!doc?.head || doc.head.hasAttribute('data-bloc-tooltip-styles')) return;
    const style = doc.createElement('style');
    style.textContent = TOOLTIP_CSS;
    doc.head.setAttribute('data-bloc-tooltip-styles', '');
    doc.head.appendChild(style);
}

/**
 * Directive-based tooltip. Attach to any host element for hover/focus-triggered
 * floating tooltip panels powered by `@bloc-ui/overlay`.
 *
 * ### Usage
 * ```html
 * <button [blocTooltip]="'Save changes'">Save</button>
 * <button [blocTooltip]="'Delete'" tooltipPosition="bottom">Delete</button>
 * ```
 */
@Directive({
    selector: '[blocTooltip]',
    standalone: true,
})
export class BlocTooltipDirective implements OnInit, OnDestroy {
    /** Tooltip text content (required). */
    readonly blocTooltip = input.required<string>();

    /** Placement of the tooltip panel. Default: `'top'`. */
    readonly tooltipPosition = input<OverlayPosition>('top');

    /** When `true`, the tooltip will not appear. Default: `false`. */
    readonly tooltipDisabled = input<boolean>(false);

    /** Milliseconds before showing the tooltip. Default: `200`. */
    readonly tooltipShowDelay = input<number>(200);

    /** Milliseconds before hiding the tooltip. Default: `100`. */
    readonly tooltipHideDelay = input<number>(100);

    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _doc = inject(DOCUMENT);
    private readonly _overlay = inject(OverlayService);

    private _panel: HTMLElement | null = null;
    private _showTimer: ReturnType<typeof setTimeout> | null = null;
    private _hideTimer: ReturnType<typeof setTimeout> | null = null;

    private readonly _tooltipId = `bloc-tooltip-${++_tooltipIdCounter}`;

    private readonly _onEnter = (): void => this._scheduleShow();
    private readonly _onLeave = (): void => this._scheduleHide();
    private readonly _onFocus = (): void => this._scheduleShow();
    private readonly _onBlur = (): void => this._scheduleHide();

    ngOnInit(): void {
        ensureTooltipStyles(this._doc);
        const host = this._el.nativeElement;
        host.addEventListener('mouseenter', this._onEnter);
        host.addEventListener('mouseleave', this._onLeave);
        host.addEventListener('focus', this._onFocus);
        host.addEventListener('blur', this._onBlur);
    }

    ngOnDestroy(): void {
        const host = this._el.nativeElement;
        host.removeEventListener('mouseenter', this._onEnter);
        host.removeEventListener('mouseleave', this._onLeave);
        host.removeEventListener('focus', this._onFocus);
        host.removeEventListener('blur', this._onBlur);
        this._clearTimers();
        this._removePanel();
    }

    private _scheduleShow(): void {
        if (this.tooltipDisabled()) return;
        this._clearHideTimer();
        this._showTimer = setTimeout(() => this._show(), this.tooltipShowDelay());
    }

    private _scheduleHide(): void {
        this._clearShowTimer();
        this._hideTimer = setTimeout(() => this._hide(), this.tooltipHideDelay());
    }

    private _show(): void {
        const text = this.blocTooltip();
        if (!text || this.tooltipDisabled()) return;

        if (!this._panel) {
            this._panel = this._overlay.createPanel('bloc-tooltip-panel');
            this._panel.id = this._tooltipId;
            this._panel.setAttribute('role', 'tooltip');
            this._el.nativeElement.setAttribute('aria-describedby', this._tooltipId);
        }

        this._panel.textContent = text;
        // Hide while positioning to prevent flash at top:0, left:0
        this._panel.style.visibility = 'hidden';

        requestAnimationFrame(() => {
            if (!this._panel) return;
            this._positionPanel();
            this._panel.style.visibility = '';
        });
    }

    private _hide(): void {
        this._removePanel();
        this._el.nativeElement.removeAttribute('aria-describedby');
    }

    private _positionPanel(): void {
        if (!this._panel) return;
        const anchor = this._el.nativeElement.getBoundingClientRect();
        const panelRect = this._panel.getBoundingClientRect();
        const size = { width: panelRect.width, height: panelRect.height };
        const { top, left } = computePosition(
            anchor,
            size,
            this.tooltipPosition(),
            TOOLTIP_OFFSET,
            true,
        );
        this._panel.style.top = `${top}px`;
        this._panel.style.left = `${left}px`;
    }

    private _removePanel(): void {
        if (this._panel) {
            this._panel.remove();
            this._panel = null;
        }
    }

    private _clearShowTimer(): void {
        if (this._showTimer !== null) {
            clearTimeout(this._showTimer);
            this._showTimer = null;
        }
    }

    private _clearHideTimer(): void {
        if (this._hideTimer !== null) {
            clearTimeout(this._hideTimer);
            this._hideTimer = null;
        }
    }

    private _clearTimers(): void {
        this._clearShowTimer();
        this._clearHideTimer();
    }
}
