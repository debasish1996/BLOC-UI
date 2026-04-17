import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BlocSkeletonDirective, SkeletonShape } from './skeleton.directive';
import { BlocSkeletonModule } from './skeleton.module';

@Component({
    template: `<bloc-skeleton [shape]="shape()" [animated]="animated()" [width]="width()" [height]="height()"></bloc-skeleton>`,
    standalone: true,
    imports: [BlocSkeletonDirective],
})
class HostComponent {
    readonly shape = input<SkeletonShape>('line');
    readonly animated = input<boolean>(true);
    readonly width = input<string>('');
    readonly height = input<string>('');
}

describe('BlocSkeletonDirective', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();
    });

    it('should apply the base and default shape classes', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('bloc-skeleton') as HTMLElement;
        expect(el.classList.contains('bloc-skeleton')).toBe(true);
        expect(el.classList.contains('bloc-skeleton--line')).toBe(true);
        expect(el.classList.contains('bloc-skeleton--animated')).toBe(true);
    });

    it('should update shape and size bindings', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.componentRef.setInput('shape', 'circle');
        fixture.componentRef.setInput('width', '64px');
        fixture.componentRef.setInput('height', '64px');
        fixture.detectChanges();

        const el = fixture.nativeElement.querySelector('bloc-skeleton') as HTMLElement;
        expect(el.classList.contains('bloc-skeleton--circle')).toBe(true);
        expect(el.style.width).toBe('64px');
        expect(el.style.height).toBe('64px');
    });

    it('should inject a single style tag into the document head', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const doc = TestBed.inject(DOCUMENT);
        expect(doc.getElementById('bloc-skeleton-styles')).not.toBeNull();
        expect(doc.querySelectorAll('#bloc-skeleton-styles').length).toBe(1);
    });
});

describe('BlocSkeletonModule', () => {
    it('should be defined', () => {
        expect(BlocSkeletonModule).toBeDefined();
    });

    it('should allow using BlocSkeletonDirective via the module', async () => {
        @Component({
            template: `<div blocSkeleton shape="rect"></div>`,
            standalone: true,
            imports: [BlocSkeletonModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(ModuleHostComponent);
        fixture.detectChanges();
        expect(
            (fixture.nativeElement as HTMLElement)
                .querySelector('[blocSkeleton]')
                ?.classList.contains('bloc-skeleton'),
        ).toBe(true);
    });
});
