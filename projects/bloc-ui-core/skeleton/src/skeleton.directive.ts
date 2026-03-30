import { Directive, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type SkeletonShape = 'line' | 'rect' | 'circle';

const SKELETON_CSS = [
    '@layer bloc-skeleton{',
    '.bloc-skeleton{display:block;position:relative;overflow:hidden;box-sizing:border-box;',
    'background:var(--bloc-skeleton-bg,#e2e8f0);border-radius:var(--bloc-skeleton-radius,8px)}',
    '.bloc-skeleton--line{width:100%;height:var(--bloc-skeleton-line-height,1rem)}',
    '.bloc-skeleton--rect{width:100%;height:var(--bloc-skeleton-rect-height,96px)}',
    '.bloc-skeleton--circle{width:var(--bloc-skeleton-circle-size,48px);height:var(--bloc-skeleton-circle-size,48px);border-radius:9999px}',
    '.bloc-skeleton--animated::after{content:"";position:absolute;inset:0;',
    'background:linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent);',
    'transform:translateX(-100%);animation:bloc-skeleton-shimmer 1.4s ease-in-out infinite}',
    '@keyframes bloc-skeleton-shimmer{100%{transform:translateX(100%)}}',
    '}',
].join('');

function ensureStyles(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-skeleton-styles')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-skeleton-styles';
    style.textContent = SKELETON_CSS;
    doc.head.appendChild(style);
}

@Directive({
    selector: 'bloc-skeleton, [blocSkeleton]',
    standalone: true,
    host: {
        '[class.bloc-skeleton]': 'true',
        '[class.bloc-skeleton--line]': 'shape() === "line"',
        '[class.bloc-skeleton--rect]': 'shape() === "rect"',
        '[class.bloc-skeleton--circle]': 'shape() === "circle"',
        '[class.bloc-skeleton--animated]': 'animated()',
        '[style.width]': 'width() || null',
        '[style.height]': 'height() || null',
        'aria-hidden': 'true',
    },
})
export class BlocSkeletonDirective {
    /** Shape preset. */
    readonly shape = input<SkeletonShape>('line');

    /** Enables or disables the shimmer animation. */
    readonly animated = input<boolean>(true);

    /** Explicit width (e.g. "200px", "100%"). */
    readonly width = input<string>('');

    /** Explicit height (e.g. "16px", "4rem"). */
    readonly height = input<string>('');

    constructor() {
        ensureStyles(inject(DOCUMENT));
    }
}
