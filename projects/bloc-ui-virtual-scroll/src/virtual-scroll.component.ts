import {
    Component,
    computed,
    contentChild,
    DestroyRef,
    ElementRef,
    inject,
    input,
    NgZone,
    signal,
    viewChild,
    afterNextRender,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BlocVirtualItemDirective, BlocVirtualItemContext } from './virtual-scroll-item.directive';

@Component({
    selector: 'bloc-virtual-scroll',
    standalone: true,
    exportAs: 'blocVirtualScroll',
    imports: [NgTemplateOutlet],
    templateUrl: './virtual-scroll.component.html',
    styleUrl: './virtual-scroll.component.scss',
    host: {
        '[class.bloc-vs]': 'true',
    },
})
export class BlocVirtualScrollComponent<T = unknown> {
    /* ── Inputs ─────────────────────────────────────────────── */

    /** Full data array. */
    readonly items = input<T[]>([]);

    /** Fixed height of each item in px (required). */
    readonly itemHeight = input.required<number>();

    /** Extra items rendered above/below the viewport to prevent flash. */
    readonly overscan = input(3);

    /* ── Internal state ─────────────────────────────────────── */

    /** Current scroll position. */
    private readonly _scrollTop = signal(0);

    /** Measured viewport height (updated via ResizeObserver). */
    private readonly _viewportHeight = signal(0);

    /** Template-mode directive (undefined when projection mode). */
    readonly itemDef = contentChild(BlocVirtualItemDirective);

    /** Viewport element ref. */
    readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');

    private readonly _zone = inject(NgZone);
    private readonly _destroyRef = inject(DestroyRef);

    /* ── Computed signals (the entire engine) ───────────────── */

    /** Total scrollable height. */
    readonly totalHeight = computed(() => this.items().length * this.itemHeight());

    /** First rendered index (inclusive). */
    readonly startIndex = computed(() => {
        const raw = Math.floor(this._scrollTop() / this.itemHeight()) - this.overscan();
        return Math.max(0, raw);
    });

    /** Last rendered index (exclusive). */
    readonly endIndex = computed(() => {
        const viewportItems = Math.ceil(this._viewportHeight() / this.itemHeight());
        const raw = this.startIndex() + viewportItems + 2 * this.overscan();
        return Math.min(this.items().length, raw);
    });

    /** Slice of items currently in the DOM. */
    readonly visibleItems = computed(() => this.items().slice(this.startIndex(), this.endIndex()));

    /** Y-offset for the content wrapper (template mode). */
    readonly offsetY = computed(() => this.startIndex() * this.itemHeight());

    /** Top spacer height (projection mode). */
    readonly topSpace = computed(() => this.startIndex() * this.itemHeight());

    /** Bottom spacer height (projection mode). */
    readonly bottomSpace = computed(
        () => (this.items().length - this.endIndex()) * this.itemHeight(),
    );

    /* ── Lifecycle ──────────────────────────────────────────── */

    constructor() {
        afterNextRender(() => {
            const el = this.viewport().nativeElement;

            // Initial measurement
            this._viewportHeight.set(el.clientHeight);

            // Track viewport resizes outside zone for perf
            const observer = new ResizeObserver((entries) => {
                const height = entries[0]?.contentRect.height ?? 0;
                this._viewportHeight.set(height);
            });
            observer.observe(el);

            // Scroll listener outside zone (runs in requestAnimationFrame cadence)
            this._zone.runOutsideAngular(() => {
                el.addEventListener('scroll', this._onScroll, { passive: true });
            });

            this._destroyRef.onDestroy(() => {
                observer.disconnect();
                el.removeEventListener('scroll', this._onScroll);
            });
        });
    }

    /* ── Public API ─────────────────────────────────────────── */

    /** Scroll the viewport so that the given index is at the top. */
    scrollToIndex(index: number): void {
        const el = this.viewport().nativeElement;
        el.scrollTop = Math.max(0, index * this.itemHeight());
    }

    /* ── Private ────────────────────────────────────────────── */

    private readonly _onScroll = (): void => {
        this._scrollTop.set(this.viewport().nativeElement.scrollTop);
    };

    /** Track-by for the @for loop. Uses absolute index for stable identity. */
    trackItem = (_index: number, _item: unknown): number => {
        return this.startIndex() + _index;
    };
}
