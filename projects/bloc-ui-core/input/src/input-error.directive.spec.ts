import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BlocInputErrorDirective } from './input-error.directive';

@Component({
    template: `<span blocInputError>Error message</span>`,
    standalone: true,
    imports: [BlocInputErrorDirective],
})
class HostComponent {}

@Component({
    template: `<bloc-input-error>Error message</bloc-input-error>`,
    standalone: true,
    imports: [BlocInputErrorDirective],
})
class ElementHostComponent {}

describe('BlocInputErrorDirective', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
        const el = fixture.nativeElement.querySelector('[blocInputError]') as HTMLElement;
        expect(el).not.toBeNull();
    });

    it('should apply bloc-input-error class', () => {
        const el = fixture.nativeElement.querySelector('[blocInputError]') as HTMLElement;
        expect(el.classList.contains('bloc-input-error')).toBe(true);
    });

    it('should have role="alert"', () => {
        const el = fixture.nativeElement.querySelector('[blocInputError]') as HTMLElement;
        expect(el.getAttribute('role')).toBe('alert');
    });

    it('should inject a <style> tag with id "bloc-input-error-styles"', () => {
        const doc = TestBed.inject(DOCUMENT);
        expect(doc.getElementById('bloc-input-error-styles')).not.toBeNull();
    });

    it('should not inject duplicate style tags', () => {
        const doc = TestBed.inject(DOCUMENT);
        expect(doc.querySelectorAll('#bloc-input-error-styles').length).toBe(1);
    });
});

// ── element selector variant ─────────────────────────────────────────
describe('BlocInputErrorDirective (element selector)', () => {
    it('should work with element selector bloc-input-error', async () => {
        await TestBed.configureTestingModule({
            imports: [ElementHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ElementHostComponent);
        f.detectChanges();
        const el = f.nativeElement.querySelector('bloc-input-error') as HTMLElement;
        expect(el.classList.contains('bloc-input-error')).toBe(true);
        expect(el.getAttribute('role')).toBe('alert');
    });
});
