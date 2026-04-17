import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BlocProgressComponent } from './progress.component';
import { BlocProgressModule } from './progress.module';

describe('BlocProgressComponent', () => {
    it('should create', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocProgressComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(BlocProgressComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should expose progressbar aria attributes', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocProgressComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(BlocProgressComponent);
        fixture.componentRef.setInput('value', 45);
        fixture.componentRef.setInput('max', 90);
        fixture.detectChanges();

        const el = fixture.nativeElement as HTMLElement;
        expect(el.getAttribute('role')).toBe('progressbar');
        expect(el.getAttribute('aria-valuenow')).toBe('45');
        expect(el.getAttribute('aria-valuemax')).toBe('90');
    });

    it('should clamp values above the maximum and render the correct fill width', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocProgressComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(BlocProgressComponent);
        fixture.componentRef.setInput('value', 150);
        fixture.componentRef.setInput('max', 100);
        fixture.componentRef.setInput('showValue', true);
        fixture.detectChanges();

        const fill = (fixture.nativeElement as HTMLElement).querySelector(
            '.bloc-progress__fill',
        ) as HTMLElement;
        const valueText = (fixture.nativeElement as HTMLElement).querySelector(
            '.bloc-progress__value',
        ) as HTMLElement;
        expect(fill.style.width).toBe('100%');
        expect(valueText.textContent?.trim()).toBe('100%');
    });
});

describe('BlocProgressModule', () => {
    it('should be defined', () => {
        expect(BlocProgressModule).toBeDefined();
    });

    it('should allow using BlocProgressComponent via the module', async () => {
        @Component({
            template: `<bloc-progress [value]="32"></bloc-progress>`,
            standalone: true,
            imports: [BlocProgressModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(ModuleHostComponent);
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).querySelector('bloc-progress')).not.toBeNull();
    });
});
