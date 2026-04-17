import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BlocToastService } from './toast.service';
import { BlocToastModule } from './toast.module';

// ── BlocToastService ───────────────────────────────────────────────────────

describe('BlocToastService', () => {
    let service: BlocToastService;

    beforeEach(async () => {
        vi.useFakeTimers();

        await TestBed.configureTestingModule({
            imports: [BlocToastModule],
        }).compileComponents();

        service = TestBed.inject(BlocToastService);
    });

    afterEach(() => {
        service.dismissAll();
        vi.useRealTimers();
        document.querySelectorAll('bloc-toast-container').forEach((el) => el.remove());
    });

    // ── show() ───────────────────────────────────────────────────────────

    it('show() adds a toast to the toasts signal', () => {
        service.show({ message: 'Hello world', type: 'info' });
        expect(service.toasts().length).toBe(1);
        expect(service.toasts()[0].message).toBe('Hello world');
    });

    it('show() assigns an id to the toast', () => {
        const id = service.show({ message: 'Test' });
        expect(typeof id).toBe('number');
        expect(service.toasts()[0].id).toBe(id);
    });

    it('show() defaults type to "info"', () => {
        service.show({ message: 'Default type' });
        expect(service.toasts()[0].type).toBe('info');
    });

    it('show() defaults duration to 4000', () => {
        service.show({ message: 'Check duration' });
        expect(service.toasts()[0].duration).toBe(4000);
    });

    it('show() defaults dismissible to true', () => {
        service.show({ message: 'Dismissible' });
        expect(service.toasts()[0].dismissible).toBe(true);
    });

    it('multiple show() calls accumulate toasts', () => {
        service.show({ message: 'A' });
        service.show({ message: 'B' });
        expect(service.toasts().length).toBe(2);
    });

    // ── Shorthand methods ─────────────────────────────────────────────────

    it('info() adds a toast with type "info"', () => {
        service.info('Information message');
        expect(service.toasts()[0].type).toBe('info');
        expect(service.toasts()[0].message).toBe('Information message');
    });

    it('success() adds a toast with type "success"', () => {
        service.success('Saved!');
        expect(service.toasts()[0].type).toBe('success');
    });

    it('warning() adds a toast with type "warning"', () => {
        service.warning('Be careful');
        expect(service.toasts()[0].type).toBe('warning');
    });

    it('error() adds a toast with type "error"', () => {
        service.error('Something went wrong');
        expect(service.toasts()[0].type).toBe('error');
    });

    it('shorthand methods pass title to the toast instance', () => {
        service.info('Message', 'My Title');
        expect(service.toasts()[0].title).toBe('My Title');
    });

    // ── dismiss() ─────────────────────────────────────────────────────────

    it('dismiss() removes the toast with the matching id', () => {
        const id = service.show({ message: 'To remove' });
        service.show({ message: 'To keep' });
        service.dismiss(id);
        expect(service.toasts().length).toBe(1);
        expect(service.toasts()[0].message).toBe('To keep');
    });

    it('dismiss() with an unknown id is a no-op', () => {
        service.show({ message: 'Stays' });
        service.dismiss(999);
        expect(service.toasts().length).toBe(1);
    });

    // ── dismissAll() ──────────────────────────────────────────────────────

    it('dismissAll() clears all toasts', () => {
        service.show({ message: 'A' });
        service.show({ message: 'B' });
        service.show({ message: 'C' });
        service.dismissAll();
        expect(service.toasts()).toHaveLength(0);
    });

    // ── Auto-dismiss ──────────────────────────────────────────────────────

    it('toast with a positive duration is automatically dismissed after that delay', () => {
        service.show({ message: 'Auto dismiss', type: 'info', duration: 2000 });
        expect(service.toasts().length).toBe(1);
        vi.advanceTimersByTime(2000);
        expect(service.toasts().length).toBe(0);
    });

    it('toast with duration 0 persists after a long delay', () => {
        service.show({ message: 'Persistent', type: 'info', duration: 0 });
        vi.advanceTimersByTime(10_000);
        expect(service.toasts().length).toBe(1);
    });

    it('only the correct toast is removed when auto-dismiss fires', () => {
        service.show({ message: 'Short', type: 'info', duration: 1000 });
        service.show({ message: 'Long', type: 'info', duration: 5000 });
        vi.advanceTimersByTime(1000);
        expect(service.toasts().length).toBe(1);
        expect(service.toasts()[0].message).toBe('Long');
    });
});

// ── BlocToastModule ────────────────────────────────────────────────────────

describe('BlocToastModule', () => {
    it('should be importable as an NgModule', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocToastModule],
        }).compileComponents();
        expect(true).toBe(true);
    });
});
