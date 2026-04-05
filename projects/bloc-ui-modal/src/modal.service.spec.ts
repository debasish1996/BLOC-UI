import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component, inject } from '@angular/core';
import { BlocModalService } from './modal.service';
import { BlocModal, BLOC_MODAL_DATA } from './modal.config';
import { BlocModalRef } from './modal.ref';
import { BlocModalModule } from './modal.module';

// ── Minimal content components ─────────────────────────────────────────────

@Component({ standalone: true, template: `<p>Hello</p>` })
class EmptyModalContent extends BlocModal<unknown, string> {}

@Component({ standalone: true, template: `<p>{{ data.greeting }}</p>` })
class DataModalContent extends BlocModal<{ greeting: string }, void> {}

// ── BlocModalService ───────────────────────────────────────────────────────

describe('BlocModalService', () => {
    let service: BlocModalService;

    function dialog(): HTMLElement | null {
        return document.querySelector('[role="dialog"]');
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocModalModule],
        }).compileComponents();

        service = TestBed.inject(BlocModalService);
    });

    // Clean up any appended dialogs after each test.
    afterEach(() => {
        document.querySelectorAll('bloc-modal-container').forEach((el) => el.remove());
    });

    // ── open() ───────────────────────────────────────────────────────────

    it('open() appends a role="dialog" element to document.body', () => {
        service.open(EmptyModalContent);
        expect(dialog()).not.toBeNull();
        expect(dialog()!.getAttribute('role')).toBe('dialog');
    });

    it('open() returns a BlocModalRef', () => {
        const ref = service.open(EmptyModalContent);
        expect(ref).toBeInstanceOf(BlocModalRef);
    });

    it('open() exposes the content component instance on the ref', () => {
        const ref = service.open(EmptyModalContent);
        expect(ref.componentInstance).toBeInstanceOf(EmptyModalContent);
    });

    // ── config: title ─────────────────────────────────────────────────────

    it('title config renders an <h2> inside the dialog', () => {
        service.open(EmptyModalContent, { title: 'Confirm action' });
        const h2 = document.querySelector('[role="dialog"] h2');
        expect(h2).not.toBeNull();
        expect(h2!.textContent).toContain('Confirm action');
    });

    // ── config: showCloseButton ───────────────────────────────────────────

    it('showCloseButton: true (default) renders a close button', () => {
        service.open(EmptyModalContent);
        const closeBtn = document.querySelector('.bloc-modal__close');
        expect(closeBtn).not.toBeNull();
    });

    it('showCloseButton: false renders no close button', () => {
        service.open(EmptyModalContent, { showCloseButton: false });
        expect(document.querySelector('.bloc-modal__close')).toBeNull();
    });

    // ── config: size ──────────────────────────────────────────────────────

    it('size "sm" adds bloc-modal--sm class on the modal panel', () => {
        service.open(EmptyModalContent, { size: 'sm' });
        expect(document.querySelector('.bloc-modal--sm')).not.toBeNull();
    });

    it('size "lg" adds bloc-modal--lg class on the modal panel', () => {
        service.open(EmptyModalContent, { size: 'lg' });
        expect(document.querySelector('.bloc-modal--lg')).not.toBeNull();
    });

    it('default size is "md"', () => {
        service.open(EmptyModalContent);
        expect(document.querySelector('.bloc-modal--md')).not.toBeNull();
    });

    // ── config: data ──────────────────────────────────────────────────────

    it('data config is injected into the content component via BLOC_MODAL_DATA', () => {
        const data = { greeting: 'Hello from test' };
        const ref = service.open(DataModalContent, { data });
        expect(ref.componentInstance.data).toEqual(data);
    });

    // ── BlocModalRef.close() ──────────────────────────────────────────────

    it('close() removes the dialog from the DOM', () => {
        const ref = service.open(EmptyModalContent);
        expect(dialog()).not.toBeNull();
        ref.close();
        expect(dialog()).toBeNull();
    });

    it('close() emits the result via afterClosed$', () => {
        const ref = service.open(EmptyModalContent);
        let emitted: string | undefined;
        ref.afterClosed$.subscribe((r) => (emitted = r));
        ref.close('done');
        expect(emitted).toBe('done');
    });

    it('afterClosed$ completes after close()', () => {
        const ref = service.open(EmptyModalContent);
        let completed = false;
        ref.afterClosed$.subscribe({ complete: () => (completed = true) });
        ref.close();
        expect(completed).toBe(true);
    });

    it('close() called twice is a no-op (subject already completed)', () => {
        const ref = service.open(EmptyModalContent);
        const spy = vi.fn();
        ref.afterClosed$.subscribe(spy);
        ref.close('first');
        ref.close('second');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('first');
    });
});

// ── BlocModalModule ────────────────────────────────────────────────────────

describe('BlocModalModule', () => {
    it('should be importable as an NgModule', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocModalModule],
        }).compileComponents();
        expect(true).toBe(true);
    });
});
