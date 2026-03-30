import { describe, it, expect, beforeEach } from 'vitest';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlocTextareaDirective } from './textarea.directive';

@Component({
    standalone: true,
    imports: [BlocTextareaDirective],
    template: `<textarea blocTextarea [error]="error()"></textarea>`,
})
class BasicHostComponent {
    readonly error = signal(false);
}

@Component({
    standalone: true,
    imports: [BlocTextareaDirective, ReactiveFormsModule],
    template: `<textarea blocTextarea [formControl]="ctrl"></textarea>`,
})
class ReactiveHostComponent {
    readonly ctrl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}

describe('BlocTextareaDirective', () => {
    it('adds the bloc-textarea class', () => {
        const fixture = TestBed.createComponent(BasicHostComponent);
        fixture.detectChanges();

        const el = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
        expect(el.classList.contains('bloc-textarea')).toBe(true);
    });

    it('applies manual error styling', () => {
        const fixture = TestBed.createComponent(BasicHostComponent);
        fixture.componentInstance.error.set(true);
        fixture.detectChanges();

        const el = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
        expect(el.classList.contains('bloc-textarea--error')).toBe(true);
        expect(el.getAttribute('aria-invalid')).toBe('true');
    });

    it('applies error styling when the control is invalid and touched', () => {
        const fixture = TestBed.createComponent(ReactiveHostComponent);
        fixture.detectChanges();

        const el = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
        fixture.componentInstance.ctrl.markAsTouched();
        el.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(el.classList.contains('bloc-textarea--error')).toBe(true);
        expect(el.getAttribute('aria-invalid')).toBe('true');
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({}).compileComponents();
    });
});
