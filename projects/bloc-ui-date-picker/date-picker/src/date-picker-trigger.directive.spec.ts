import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { BlocDatePickerTriggerDirective } from './date-picker-trigger.directive';

// ── Test host (button trigger) ─────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [BlocDatePickerTriggerDirective],
    template: `
        <button blocDatePickerTrigger #trigger="blocDatePickerTrigger" [disabled]="isDisabled()">
            Pick a date
        </button>
    `,
})
class TriggerTestHost {
    readonly isDisabled = signal(false);
}

// ── BlocDatePickerTriggerDirective ─────────────────────────────────────────

describe('BlocDatePickerTriggerDirective', () => {
    let fixture: ComponentFixture<TriggerTestHost>;
    let host: TriggerTestHost;
    let directive: BlocDatePickerTriggerDirective;
    let button: HTMLButtonElement;

    function el(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TriggerTestHost],
        }).compileComponents();

        fixture = TestBed.createComponent(TriggerTestHost);
        host = fixture.componentInstance;
        fixture.detectChanges();

        button = el().querySelector('button')!;
        // Access the directive instance through the debug element
        const debugEl = fixture.debugElement.query((de) => de.nativeElement === button);
        directive = debugEl?.injector.get(BlocDatePickerTriggerDirective);
    });

    afterEach(() => {
        document.querySelectorAll('.bloc-dp-trigger-dropdown').forEach((el) => el.remove());
    });

    // ── Initial state ─────────────────────────────────────────────────────

    it('isOpen starts as false', () => {
        expect(directive.isOpen()).toBe(false);
    });

    it('selectedDate starts as null', () => {
        expect(directive.selectedDate()).toBeNull();
    });

    it('button has aria-haspopup="dialog"', () => {
        expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('button has aria-expanded="false" initially', () => {
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    // ── ControlValueAccessor: writeValue ──────────────────────────────────

    it('writeValue(Date) updates selectedDate signal', () => {
        const d = new Date(2025, 5, 15);
        directive.writeValue(d);
        expect(directive.selectedDate()).toEqual(d);
    });

    it('writeValue(null) clears selectedDate signal', () => {
        directive.writeValue(new Date());
        directive.writeValue(null);
        expect(directive.selectedDate()).toBeNull();
    });

    it('writeValue with a date string converts to Date', () => {
        directive.writeValue('2025-06-15');
        expect(directive.selectedDate()).toBeInstanceOf(Date);
    });

    // ── ControlValueAccessor: setDisabledState ────────────────────────────

    it('setDisabledState(true) makes isDisabled return true', () => {
        directive.setDisabledState(true);
        fixture.detectChanges();
        expect(directive.isDisabled()).toBe(true);
    });

    it('setDisabledState(false) makes isDisabled return false', () => {
        directive.setDisabledState(true);
        directive.setDisabledState(false);
        fixture.detectChanges();
        expect(directive.isDisabled()).toBe(false);
    });

    // ── Toggle: enabled ───────────────────────────────────────────────────

    it('clicking the trigger opens the calendar (isOpen → true)', () => {
        button.click();
        fixture.detectChanges();
        expect(directive.isOpen()).toBe(true);
    });

    it('aria-expanded becomes "true" when open', () => {
        button.click();
        fixture.detectChanges();
        expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('second click closes the calendar (toggle)', () => {
        button.click();
        fixture.detectChanges();
        button.click();
        fixture.detectChanges();
        expect(directive.isOpen()).toBe(false);
    });

    // ── Toggle: disabled ──────────────────────────────────────────────────

    it('clicking while disabled does not open calendar', () => {
        directive.setDisabledState(true);
        fixture.detectChanges();
        button.click();
        fixture.detectChanges();
        expect(directive.isOpen()).toBe(false);
    });

    it('disabled input: true also prevents toggle', () => {
        host.isDisabled.set(true);
        fixture.detectChanges();
        button.click();
        fixture.detectChanges();
        expect(directive.isOpen()).toBe(false);
    });
});
