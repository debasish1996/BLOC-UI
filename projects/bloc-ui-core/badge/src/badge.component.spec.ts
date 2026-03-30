import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BlocBadgeComponent } from './badge.component';
import { BlocBadgeModule } from './badge.module';

describe('BlocBadgeComponent', () => {
    it('should create', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocBadgeComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(BlocBadgeComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should apply the default variant and size classes', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocBadgeComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(BlocBadgeComponent);
        fixture.detectChanges();
        const el = fixture.nativeElement as HTMLElement;
        expect(el.classList.contains('bloc-badge')).toBe(true);
        expect(el.classList.contains('bloc-badge--neutral')).toBe(true);
        expect(el.classList.contains('bloc-badge--md')).toBe(true);
    });

    it('should update classes when inputs change', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocBadgeComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(BlocBadgeComponent);
        fixture.componentRef.setInput('variant', 'success');
        fixture.componentRef.setInput('size', 'lg');
        fixture.componentRef.setInput('pill', true);
        fixture.detectChanges();

        const el = fixture.nativeElement as HTMLElement;
        expect(el.classList.contains('bloc-badge--success')).toBe(true);
        expect(el.classList.contains('bloc-badge--lg')).toBe(true);
        expect(el.classList.contains('bloc-badge--pill')).toBe(true);
    });
});

describe('BlocBadgeModule', () => {
    it('should be defined', () => {
        expect(BlocBadgeModule).toBeDefined();
    });

    it('should allow using BlocBadgeComponent via the module', async () => {
        @Component({
            template: `<bloc-badge>New</bloc-badge>`,
            standalone: true,
            imports: [BlocBadgeModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(ModuleHostComponent);
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).querySelector('bloc-badge')).not.toBeNull();
    });
});
