import { computePosition, pointToDOMRect } from './overlay.positioning';
import { OverlayRef } from './overlay.ref';

// ── computePosition ──────────────────────────────────────────────────────────

describe('computePosition', () => {
    const anchor = new DOMRect(100, 200, 80, 40); // left=100 top=200 w=80 h=40
    const panel = { width: 120, height: 60 };

    it('places panel below anchor for bottom-start', () => {
        const { top, left } = computePosition(anchor, panel, 'bottom-start', 8, false);
        expect(top).toBe(248); // 200 + 40 + 8
        expect(left).toBe(100); // anchor.left
    });

    it('places panel above anchor for top-start', () => {
        const { top, left } = computePosition(anchor, panel, 'top-start', 8, false);
        expect(top).toBe(132); // 200 - 60 - 8
        expect(left).toBe(100);
    });

    it('aligns center horizontally for bottom-center', () => {
        const { left } = computePosition(anchor, panel, 'bottom-center', 0, false);
        // anchor.left + anchor.width/2 - panel.width/2 = 100 + 40 - 60 = 80
        expect(left).toBe(80);
    });

    it('aligns end horizontally for bottom-end', () => {
        const { left } = computePosition(anchor, panel, 'bottom-end', 0, false);
        // anchor.left + anchor.width - panel.width = 100 + 80 - 120 = 60
        expect(left).toBe(60);
    });

    it('places panel to the right for right-start', () => {
        const { top, left } = computePosition(anchor, panel, 'right-start', 8, false);
        expect(left).toBe(188); // anchor.right + offset = 180 + 8
        expect(top).toBe(200); // anchor.top (start)
    });

    it('places panel to the left for left-start (clamped to 0)', () => {
        const { left } = computePosition(anchor, panel, 'left-start', 8, false);
        // Raw: 100 - 120 - 8 = -28 → clamped to 0 by viewport boundary.
        expect(left).toBe(0);
    });

    it('returns the resolved placement', () => {
        const { resolvedPlacement } = computePosition(anchor, panel, 'bottom', 8, false);
        expect(resolvedPlacement).toBe('bottom');
    });
});

// ── pointToDOMRect ────────────────────────────────────────────────────────────

describe('pointToDOMRect', () => {
    it('creates a zero-size DOMRect at the given coordinates', () => {
        const r = pointToDOMRect(50, 75);
        expect(r.x).toBe(50);
        expect(r.y).toBe(75);
        expect(r.width).toBe(0);
        expect(r.height).toBe(0);
    });
});

// ── OverlayRef ────────────────────────────────────────────────────────────────

describe('OverlayRef', () => {
    it('starts closed', () => {
        const ref = new OverlayRef();
        expect(ref.isOpen()).toBe(false);
    });

    it('_setOpen updates the signal', () => {
        const ref = new OverlayRef();
        ref._setOpen(true);
        expect(ref.isOpen()).toBe(true);
        ref._setOpen(false);
        expect(ref.isOpen()).toBe(false);
    });

    it('toggle calls open then close', () => {
        const ref = new OverlayRef();
        const calls: string[] = [];
        ref._open = () => {
            ref._setOpen(true);
            calls.push('open');
        };
        ref._close = () => {
            ref._setOpen(false);
            calls.push('close');
        };
        ref._updatePosition = () => {};

        ref.toggle(); // opens
        ref.toggle(); // closes
        expect(calls).toEqual(['open', 'close']);
    });
});
