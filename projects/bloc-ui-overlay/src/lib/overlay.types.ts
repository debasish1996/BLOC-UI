/** The four primary placement sides. */
export type OverlayPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Secondary axis alignment within a placement. */
export type OverlayAlignment = 'start' | 'center' | 'end';

/**
 * Combined position descriptor.
 * Examples: `'bottom-start'`, `'top-center'`, `'left'`, `'right-end'`
 */
export type OverlayPosition = OverlayPlacement | `${OverlayPlacement}-${OverlayAlignment}`;

/** What interaction opens/closes the overlay. */
export type OverlayTrigger = 'click' | 'hover' | 'manual';

/**
 * A fixed viewport point (e.g. mouse cursor) to anchor the overlay to
 * instead of a trigger element.
 */
export interface OverlayAnchorPoint {
    x: number;
    y: number;
}
