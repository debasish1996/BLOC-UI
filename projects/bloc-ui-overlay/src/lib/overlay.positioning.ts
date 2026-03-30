import { OverlayAlignment, OverlayPlacement, OverlayPosition } from './overlay.types';

export interface ComputedPosition {
    top: number;
    left: number;
    resolvedPlacement: OverlayPlacement;
}

const OPPOSITE: Record<OverlayPlacement, OverlayPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
};

function fitsInViewport(
    placement: OverlayPlacement,
    anchor: DOMRect,
    overlaySize: { width: number; height: number },
    offset: number,
): boolean {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    switch (placement) {
        case 'bottom':
            return anchor.bottom + offset + overlaySize.height <= vh;
        case 'top':
            return anchor.top - offset - overlaySize.height >= 0;
        case 'right':
            return anchor.right + offset + overlaySize.width <= vw;
        case 'left':
            return anchor.left - offset - overlaySize.width >= 0;
    }
}

function crossAxisOffset(
    axis: 'h' | 'v',
    alignment: OverlayAlignment,
    anchor: DOMRect,
    overlaySize: number,
): number {
    const start = axis === 'h' ? anchor.left : anchor.top;
    const size = axis === 'h' ? anchor.width : anchor.height;
    switch (alignment) {
        case 'start':
            return start;
        case 'end':
            return start + size - overlaySize;
        case 'center':
            return Math.round(start + size / 2 - overlaySize / 2);
    }
}

/**
 * Pure function. Computes `top` and `left` viewport-fixed coordinates for an
 * overlay panel relative to an anchor `DOMRect`.
 *
 * Automatically flips the placement when the preferred side has insufficient
 * viewport space (opt-out via `autoFlip: false`).
 */
export function computePosition(
    anchor: DOMRect,
    overlaySize: { width: number; height: number },
    position: OverlayPosition,
    offset: number,
    autoFlip: boolean,
): ComputedPosition {
    const [rawPlacement, rawAlignment] = position.split('-') as [
        OverlayPlacement,
        OverlayAlignment | undefined,
    ];
    const alignment: OverlayAlignment = rawAlignment ?? 'start';

    let placement = rawPlacement;
    if (autoFlip && !fitsInViewport(placement, anchor, overlaySize, offset)) {
        const flipped = OPPOSITE[placement];
        if (fitsInViewport(flipped, anchor, overlaySize, offset)) {
            placement = flipped;
        }
    }

    let top = 0;
    let left = 0;

    switch (placement) {
        case 'bottom':
            top = anchor.bottom + offset;
            left = crossAxisOffset('h', alignment, anchor, overlaySize.width);
            break;
        case 'top':
            top = anchor.top - overlaySize.height - offset;
            left = crossAxisOffset('h', alignment, anchor, overlaySize.width);
            break;
        case 'right':
            top = crossAxisOffset('v', alignment, anchor, overlaySize.height);
            left = anchor.right + offset;
            break;
        case 'left':
            top = crossAxisOffset('v', alignment, anchor, overlaySize.height);
            left = anchor.left - overlaySize.width - offset;
            break;
    }

    // Clamp to viewport so the panel never fully exits the screen.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    left = Math.max(0, Math.min(left, vw - overlaySize.width));
    top = Math.max(0, Math.min(top, vh - overlaySize.height));

    return { top, left, resolvedPlacement: placement };
}

/**
 * Convert a fixed viewport point (e.g. mouse cursor) into a zero-size
 * `DOMRect` so it can be used as an anchor with `computePosition`.
 */
export function pointToDOMRect(x: number, y: number): DOMRect {
    return new DOMRect(x, y, 0, 0);
}
