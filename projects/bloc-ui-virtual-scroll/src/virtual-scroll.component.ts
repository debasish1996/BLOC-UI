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
    afterEveryRender,
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

    /**
     * Estimated height of each item in px.
     * Used for unmeasured items; actual heights are cached after render.
     */
    readonly itemHeight = input.required<number>();

    /** Extra items rendered above/below the viewport to prevent flash. */
    readonly overscan = input(10);

    /** When true, measures actual row heights after render (supports variable-height rows). */
    readonly autoMeasure = input(false);

    /* ── Internal state ─────────────────────────────────────── */

    /** Current scroll position. */
    private readonly _scrollTop = signal(0);

    /** Measured viewport height (updated via ResizeObserver). */
    private readonly _viewportHeight = signal(0);

    /** Pending rAF id for scroll batching. */
    private _rafId = 0;

    /**
     * Cache of measured row heights, keyed by absolute index.
     * Bumped via _heightCacheVersion signal to trigger recomputation.
     */
    private readonly _heightCache = new Map<number, number>();

    /** Signal version counter — incremented when height cache changes. */
    private readonly _heightCacheVersion = signal(0);

    /** Template-mode directive (undefined when projection mode). */
    readonly itemDef = contentChild(BlocVirtualItemDirective);

    /** Viewport element ref. */
    readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');

    /** Content wrapper ref for measuring rendered items. */
    readonly contentEl = viewChild<ElementRef<HTMLElement>>('contentRef');

    private readonly _zone = inject(NgZone);
    private readonly _destroyRef = inject(DestroyRef);

    /* ── Height helpers ─────────────────────────────────────── */

    /** Get the height for a given index (measured or estimated). */
    private _getHeight(index: number): number {
        if (!this.autoMeasure()) return this.itemHeight();
        return this._heightCache.get(index) ?? this.itemHeight();
    }

    /** Get cumulative offset (top of row at `index`). */
    private _getOffset(index: number): number {
        if (!this.autoMeasure()) return index * this.itemHeight();
        // Read the version signal so computed signals track cache changes.
        this._heightCacheVersion();
        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += this._getHeight(i);
        }
        return offset;
    }

    /** Find the index of the first item whose top edge is at or before scrollTop. */
    private _findStartIndex(scrollTop: number): number {
        if (!this.autoMeasure()) {
            return Math.floor(scrollTop / this.itemHeight());
        }
        this._heightCacheVersion(); // track cache changes
        const len = this.items().length;
        if (len === 0) return 0;
        let offset = 0;
        for (let i = 0; i < len; i++) {
            const h = this._getHeight(i);
            if (offset + h > scrollTop) return i;
            offset += h;
        }
        return len - 1;
    }

    /* ── Computed signals (the entire engine) ───────────────── */

    /** Total scrollable height. */
    readonly totalHeight = computed(() => {
        if (!this.autoMeasure()) {
            return this.items().length * this.itemHeight();
        }
        this._heightCacheVersion(); // track cache changes
        const items = this.items();
        const est = this.itemHeight();
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            total += this._heightCache.get(i) ?? est;
        }
        return total;
    });

    /** First rendered index (inclusive). */
    readonly startIndex = computed(() => {
        const rawIndex = this._findStartIndex(this._scrollTop());
        return Math.max(0, rawIndex - this.overscan());
    });

    /** Last rendered index (exclusive). */
    readonly endIndex = computed(() => {
        const start = this.startIndex();
        const vpHeight = this._viewportHeight();
        const items = this.items();
        const overscan = this.overscan();

        if (!this.autoMeasure()) {
            const viewportItems = Math.ceil(vpHeight / this.itemHeight());
            return Math.min(items.length, start + viewportItems + 2 * overscan);
        }

        this._heightCacheVersion(); // track cache changes
        const scrollTop = this._scrollTop();
        // We must render items until their cumulative bottom edge
        // exceeds scrollTop + vpHeight + an overscan buffer.
        const targetBottom = scrollTop + vpHeight + overscan * this.itemHeight();
        let cumulative = this._getOffset(start);
        let end = start;
        while (end < items.length && cumulative < targetBottom) {
            cumulative += this._getHeight(end);
            end++;
        }
        // Add trailing overscan items beyond the target
        end = Math.min(items.length, end + overscan);
        return end;
    });

    /** Slice of items currently in the DOM. */
    readonly visibleItems = computed(() => this.items().slice(this.startIndex(), this.endIndex()));

    /** Y-offset for the content wrapper (template mode). */
    readonly offsetY = computed(() => this._getOffset(this.startIndex()));

    /** Top spacer height (projection mode). */
    readonly topSpace = computed(() => this._getOffset(this.startIndex()));

    /** Bottom spacer height (projection mode). */
    readonly bottomSpace = computed(() => {
        const end = this.endIndex();
        const items = this.items();
        if (!this.autoMeasure()) {
            return (items.length - end) * this.itemHeight();
        }
        this._heightCacheVersion();
        let space = 0;
        for (let i = end; i < items.length; i++) {
            space += this._getHeight(i);
        }
        return space;
    });

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
                if (this._rafId) cancelAnimationFrame(this._rafId);
            });
        });

        // After every render, measure rendered items and update cache (only when autoMeasure is on)
        afterEveryRender(() => {
            if (this.autoMeasure()) {
                this._measureRenderedItems();
            }
        });
    }

    /* ── Public API ─────────────────────────────────────────── */

    /** Scroll the viewport so that the given index is at the top. */
    scrollToIndex(index: number): void {
        const el = this.viewport().nativeElement;
        el.scrollTop = Math.max(0, this._getOffset(index));
    }

    /* ── Private ────────────────────────────────────────────── */

    private readonly _onScroll = (): void => {
        if (this._rafId) return; // already scheduled
        this._rafId = requestAnimationFrame(() => {
            this._rafId = 0;
            this._scrollTop.set(this.viewport().nativeElement.scrollTop);
        });
    };

    /** Measure all rendered `.bloc-vs__item` elements and update the cache. */
    private _measureRenderedItems(): void {
        const container = this.contentEl()?.nativeElement;
        if (!container) return;

        const children = container.querySelectorAll<HTMLElement>('.bloc-vs__item');
        if (!children.length) return;

        const start = this.startIndex();
        let changed = false;

        children.forEach((child, i) => {
            const absIndex = start + i;
            const measured = child.offsetHeight;
            if (measured > 0 && this._heightCache.get(absIndex) !== measured) {
                this._heightCache.set(absIndex, measured);
                changed = true;
            }
        });

        if (changed) {
            this._heightCacheVersion.update((v) => v + 1);
        }
    }

    /** Track-by for the @for loop. Uses absolute index for stable identity. */
    trackItem = (_index: number, _item: unknown): number => {
        return this.startIndex() + _index;
    };
}
