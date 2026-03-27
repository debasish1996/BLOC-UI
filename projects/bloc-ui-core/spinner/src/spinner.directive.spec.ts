import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BlocSpinnerDirective, SpinnerSize } from './spinner.directive';
import { BlocSpinnerModule } from './spinner.module';

// ── Minimal host component (uses input() so setInput works) ─────────
@Component({
    template: `<bloc-spinner [size]="size()" [width]="width()" [height]="height()"></bloc-spinner>`,
    standalone: true,
    imports: [BlocSpinnerDirective],
})
class HostComponent {
    readonly size = input<SpinnerSize | null>('md');
    readonly width = input<string>('');
    readonly height = input<string>('');
}

// ── Attribute-selector variant ──────────────────────────────────────
@Component({
    template: `<div blocSpinner [size]="size()"></div>`,
    standalone: true,
    imports: [BlocSpinnerDirective],
})
class AttributeHostComponent {
    readonly size = input<SpinnerSize | null>('md');
}

// ───────────────────────────────────────────────────────────────────-
describe('BlocSpinnerDirective', () => {
    let fixture: ComponentFixture<HostComponent>;

    function el(): HTMLElement {
        return fixture.nativeElement.querySelector('bloc-spinner') as HTMLElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    // — basic creation —
    it('should create the directive', () => {
        expect(el()).not.toBeNull();
    });

    it('should always carry the bloc-spinner base class', () => {
        expect(el().classList.contains('bloc-spinner')).toBe(true);
    });

    // — role / aria —
    it('should have role="status"', () => {
        expect(el().getAttribute('role')).toBe('status');
    });

    it('should have aria-label="Loading"', () => {
        expect(el().getAttribute('aria-label')).toBe('Loading');
    });

    // — default size —
    it('should apply bloc-spinner--md class by default', () => {
        expect(el().classList.contains('bloc-spinner--md')).toBe(true);
    });

    // — size presets —
    const sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    for (const size of sizes) {
        it(`should apply bloc-spinner--${size} when size="${size}"`, () => {
            fixture.componentRef.setInput('size', size);
            fixture.detectChanges();
            expect(el().classList.contains(`bloc-spinner--${size}`)).toBe(true);
        });

        // Every OTHER size class must be absent
        it(`should not apply other size classes when size="${size}"`, () => {
            fixture.componentRef.setInput('size', size);
            fixture.detectChanges();
            const others = sizes.filter((s) => s !== size);
            for (const other of others) {
                expect(el().classList.contains(`bloc-spinner--${other}`)).toBe(false);
            }
        });
    }

    // — null size —
    it('should not apply any size class when size is null', () => {
        fixture.componentRef.setInput('size', null);
        fixture.detectChanges();
        for (const s of sizes) {
            expect(el().classList.contains(`bloc-spinner--${s}`)).toBe(false);
        }
    });

    // — explicit width / height —
    it('should apply inline width style when width is provided', () => {
        fixture.componentRef.setInput('width', '40px');
        fixture.detectChanges();
        expect(el().style.width).toBe('40px');
    });

    it('should apply inline height style when height is provided', () => {
        fixture.componentRef.setInput('height', '40px');
        fixture.detectChanges();
        expect(el().style.height).toBe('40px');
    });

    it('should not set inline width when width is empty string', () => {
        fixture.componentRef.setInput('width', '');
        fixture.detectChanges();
        expect(el().style.width).toBe('');
    });

    it('should not set inline height when height is empty string', () => {
        fixture.componentRef.setInput('height', '');
        fixture.detectChanges();
        expect(el().style.height).toBe('');
    });

    // — style injection —
    it('should inject a <style> tag into document.head with id "bloc-spinner-styles"', () => {
        const doc = TestBed.inject(DOCUMENT);
        expect(doc.getElementById('bloc-spinner-styles')).not.toBeNull();
    });

    it('should not inject duplicate <style> tags on multiple instances', () => {
        const doc = TestBed.inject(DOCUMENT);
        const count = doc.querySelectorAll('#bloc-spinner-styles').length;
        expect(count).toBe(1);
    });

    // — attribute selector variant —
    it('should also work with the [blocSpinner] attribute selector', async () => {
        const attrFixture = TestBed.createComponent(AttributeHostComponent);
        attrFixture.detectChanges();
        const el = attrFixture.nativeElement.querySelector('[blocSpinner]') as HTMLElement;
        expect(el.classList.contains('bloc-spinner')).toBe(true);
        expect(el.getAttribute('role')).toBe('status');
    });
});

// ── BlocSpinnerModule ───────────────────────────────────────────────
describe('BlocSpinnerModule', () => {
    it('should be defined', () => {
        expect(BlocSpinnerModule).toBeDefined();
    });

    it('should allow importing and using BlocSpinnerDirective via the module', async () => {
        @Component({
            template: `<bloc-spinner></bloc-spinner>`,
            standalone: true,
            imports: [BlocSpinnerModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHostComponent);
        modFixture.detectChanges();
        expect(
            (modFixture.nativeElement as HTMLElement).querySelector('bloc-spinner'),
        ).not.toBeNull();
    });
});
