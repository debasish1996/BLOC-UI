import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BlocTooltipDirective } from './tooltip.directive';
import { OverlayService } from '@bloc-ui/overlay';

// ── Host component ────────────────────────────────────────────────────────────

@Component({
    selector: 'test-host',
    standalone: true,
    imports: [BlocTooltipDirective],
    template: `
        <button
            [blocTooltip]="text"
            [tooltipDisabled]="disabled"
            [tooltipShowDelay]="showDelay"
            [tooltipHideDelay]="hideDelay"
        >
            Hover me
        </button>
    `,
})
class HostComponent {
    text = 'Hello tooltip';
    disabled = false;
    showDelay = 200;
    hideDelay = 100;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function dispatchOn(el: HTMLElement, eventName: string): void {
    el.dispatchEvent(new Event(eventName));
}

// ── Spec ──────────────────────────────────────────────────────────────────────

describe('BlocTooltipDirective', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;
    let button: HTMLButtonElement;
    let mockPanel: HTMLDivElement;
    let mockOverlay: { createPanel: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        mockPanel = document.createElement('div');
        mockOverlay = {
            createPanel: vi.fn().mockReturnValue(mockPanel),
        };

        vi.useFakeTimers();

        await TestBed.configureTestingModule({
            imports: [HostComponent],
            providers: [{ provide: OverlayService, useValue: mockOverlay }],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    });

    afterEach(() => {
        vi.runAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    // ── creation ──────────────────────────────────────────────────────────────

    it('should create without errors', () => {
        expect(button).not.toBeNull();
    });

    // ── show on mouseenter after delay ────────────────────────────────────────

    it('should show tooltip after showDelay on mouseenter', () => {
        dispatchOn(button, 'mouseenter');
        expect(mockOverlay.createPanel).not.toHaveBeenCalled();

        vi.advanceTimersByTime(200);

        expect(mockOverlay.createPanel).toHaveBeenCalledOnce();
        expect(mockOverlay.createPanel).toHaveBeenCalledWith('bloc-tooltip-panel');
    });

    it('should not show before showDelay elapses', () => {
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(199);
        expect(mockOverlay.createPanel).not.toHaveBeenCalled();
    });

    // ── show on focus after delay ─────────────────────────────────────────────

    it('should show tooltip after showDelay on focus', () => {
        dispatchOn(button, 'focus');
        vi.advanceTimersByTime(200);
        expect(mockOverlay.createPanel).toHaveBeenCalledOnce();
    });

    // ── role="tooltip" on panel ───────────────────────────────────────────────

    it('should set role="tooltip" on the panel element', () => {
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);
        expect(mockPanel.getAttribute('role')).toBe('tooltip');
    });

    // ── aria-describedby on host ──────────────────────────────────────────────

    it('should set aria-describedby on host element when shown', () => {
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);
        const id = button.getAttribute('aria-describedby');
        expect(id).not.toBeNull();
        expect(id).toMatch(/^bloc-tooltip-\d+$/);
    });

    it('should set aria-describedby to match the panel id', () => {
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);
        expect(button.getAttribute('aria-describedby')).toBe(mockPanel.id);
    });

    // ── hide on mouseleave ────────────────────────────────────────────────────

    it('should remove aria-describedby from host after mouseleave delay', () => {
        // Show first
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);
        expect(button.getAttribute('aria-describedby')).not.toBeNull();

        // Hide
        dispatchOn(button, 'mouseleave');
        vi.advanceTimersByTime(100);
        expect(button.getAttribute('aria-describedby')).toBeNull();
    });

    it('should not hide before hideDelay elapses', () => {
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);

        dispatchOn(button, 'mouseleave');
        vi.advanceTimersByTime(99);
        expect(button.getAttribute('aria-describedby')).not.toBeNull();
    });

    // ── hide on blur ──────────────────────────────────────────────────────────

    it('should remove aria-describedby after blur delay', () => {
        dispatchOn(button, 'focus');
        vi.advanceTimersByTime(200);

        dispatchOn(button, 'blur');
        vi.advanceTimersByTime(100);
        expect(button.getAttribute('aria-describedby')).toBeNull();
    });

    // ── tooltipDisabled blocks show ───────────────────────────────────────────

    describe('when tooltipDisabled is true', () => {
        let disabledButton: HTMLButtonElement;

        beforeEach(() => {
            // Create a fresh fixture with disabled=true set BEFORE the first
            // detectChanges() to avoid ExpressionChangedAfterItHasBeenCheckedError
            // with Angular signal inputs.
            mockOverlay.createPanel.mockClear();
            const disabledFixture = TestBed.createComponent(HostComponent);
            disabledFixture.componentInstance.disabled = true;
            disabledFixture.detectChanges();
            disabledButton = disabledFixture.nativeElement.querySelector('button')!;
        });

        it('should not create panel when tooltipDisabled is true on mouseenter', () => {
            dispatchOn(disabledButton, 'mouseenter');
            vi.advanceTimersByTime(200);
            expect(mockOverlay.createPanel).not.toHaveBeenCalled();
        });

        it('should not create panel on focus when tooltipDisabled is true', () => {
            dispatchOn(disabledButton, 'focus');
            vi.advanceTimersByTime(200);
            expect(mockOverlay.createPanel).not.toHaveBeenCalled();
        });
    });

    // ── idempotent _show (panel not re-created if already visible) ────────────

    it('should not re-create the panel if it is already visible', () => {
        // First show
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);
        expect(mockOverlay.createPanel).toHaveBeenCalledOnce();

        // Second mouseenter while panel still open (no hide in between)
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);
        expect(mockOverlay.createPanel).toHaveBeenCalledOnce(); // still once
    });

    // ── timer clearance on ngOnDestroy ────────────────────────────────────────

    it('should clear pending show timer on destroy (no memory leak)', () => {
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

        dispatchOn(button, 'mouseenter'); // starts show timer

        fixture.destroy();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should clear pending hide timer on destroy', () => {
        // Show first
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);

        dispatchOn(button, 'mouseleave'); // starts hide timer

        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
        fixture.destroy();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should not show tooltip after component is destroyed', () => {
        dispatchOn(button, 'mouseenter');
        fixture.destroy(); // should cancel the pending show timer

        vi.runAllTimers();

        expect(mockOverlay.createPanel).not.toHaveBeenCalled();
    });

    // ── event listener cleanup on destroy ────────────────────────────────────

    it('should remove event listeners on destroy so mouseenter no longer triggers show', () => {
        fixture.destroy();

        // Advance to ensure any in-flight timer would have fired
        vi.runAllTimers();

        // Trigger after destroy
        dispatchOn(button, 'mouseenter');
        vi.advanceTimersByTime(200);

        expect(mockOverlay.createPanel).not.toHaveBeenCalled();
    });
});
