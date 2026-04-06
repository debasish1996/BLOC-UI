import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BlocAlertComponent } from './alert.component';
import { BlocAlertModule } from './alert.module';

// ── BlocAlertComponent ───────────────────────────────────────────────
describe('BlocAlertComponent', () => {
    let fixture: ComponentFixture<BlocAlertComponent>;
    let component: BlocAlertComponent;

    function host(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocAlertComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlocAlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // — creation —
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // — visible input —
    it('should render inner content when visible is true (default)', () => {
        expect(host().querySelector('.bloc-alert__body')).not.toBeNull();
    });

    it('should not render inner content when visible is false', () => {
        fixture.componentRef.setInput('visible', false);
        fixture.detectChanges();
        expect(host().querySelector('.bloc-alert__body')).toBeNull();
    });

    // — variant classes —
    it('should apply bloc-alert--info class for variant="info" (default)', () => {
        expect(host().classList.contains('bloc-alert--info')).toBe(true);
    });

    it('should apply bloc-alert--success class for variant="success"', () => {
        fixture.componentRef.setInput('variant', 'success');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-alert--success')).toBe(true);
        expect(host().classList.contains('bloc-alert--info')).toBe(false);
    });

    it('should apply bloc-alert--warning class for variant="warning"', () => {
        fixture.componentRef.setInput('variant', 'warning');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-alert--warning')).toBe(true);
        expect(host().classList.contains('bloc-alert--info')).toBe(false);
    });

    it('should apply bloc-alert--danger class for variant="danger"', () => {
        fixture.componentRef.setInput('variant', 'danger');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-alert--danger')).toBe(true);
        expect(host().classList.contains('bloc-alert--info')).toBe(false);
    });

    // — role ARIA attribute derived from variant —
    it('should have role="status" for variant="info"', () => {
        expect(host().getAttribute('role')).toBe('status');
    });

    it('should have role="status" for variant="success"', () => {
        fixture.componentRef.setInput('variant', 'success');
        fixture.detectChanges();
        expect(host().getAttribute('role')).toBe('status');
    });

    it('should have role="alert" for variant="warning"', () => {
        fixture.componentRef.setInput('variant', 'warning');
        fixture.detectChanges();
        expect(host().getAttribute('role')).toBe('alert');
    });

    it('should have role="alert" for variant="danger"', () => {
        fixture.componentRef.setInput('variant', 'danger');
        fixture.detectChanges();
        expect(host().getAttribute('role')).toBe('alert');
    });

    // — live input overrides role —
    it('should have role="alert" when live="assertive" overrides info variant', () => {
        fixture.componentRef.setInput('variant', 'info');
        fixture.componentRef.setInput('live', 'assertive');
        fixture.detectChanges();
        expect(host().getAttribute('role')).toBe('alert');
    });

    it('should have role="status" when live="polite" overrides warning variant', () => {
        fixture.componentRef.setInput('variant', 'warning');
        fixture.componentRef.setInput('live', 'polite');
        fixture.detectChanges();
        expect(host().getAttribute('role')).toBe('status');
    });

    // — a11y: host aria-label reflects variant —
    it('should set aria-label on host to "info" for variant="info"', () => {
        expect(host().getAttribute('aria-label')).toBe('info');
    });

    it('should set aria-label on host to "danger" for variant="danger"', () => {
        fixture.componentRef.setInput('variant', 'danger');
        fixture.detectChanges();
        expect(host().getAttribute('aria-label')).toBe('danger');
    });

    // — a11y: icon is decorative —
    it('should mark the icon element as aria-hidden', () => {
        const icon = host().querySelector('.bloc-alert__icon');
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    // — dismissible input —
    it('should show dismiss button when dismissible=true', () => {
        fixture.componentRef.setInput('dismissible', true);
        fixture.detectChanges();
        expect(host().querySelector('.bloc-alert__close')).not.toBeNull();
    });

    it('should not show dismiss button when dismissible=false (default)', () => {
        expect(host().querySelector('.bloc-alert__close')).toBeNull();
    });

    // — clicking dismiss —
    it('should hide content when dismiss button is clicked', () => {
        fixture.componentRef.setInput('dismissible', true);
        fixture.detectChanges();

        const closeBtn = host().querySelector<HTMLButtonElement>('.bloc-alert__close')!;
        closeBtn.click();
        fixture.detectChanges();

        expect(host().querySelector('.bloc-alert__body')).toBeNull();
        expect(component._selfVisible()).toBe(false);
    });

    it('should emit dismissed output when dismiss button is clicked', () => {
        fixture.componentRef.setInput('dismissible', true);
        fixture.detectChanges();

        const emitSpy = vi.spyOn(component.dismissed, 'emit');
        const closeBtn = host().querySelector<HTMLButtonElement>('.bloc-alert__close')!;
        closeBtn.click();

        expect(emitSpy).toHaveBeenCalledOnce();
    });

    // — title input —
    it('should render title element when title is provided', () => {
        fixture.componentRef.setInput('title', 'Alert Title');
        fixture.detectChanges();
        const titleEl = host().querySelector('.bloc-alert__title');
        expect(titleEl).not.toBeNull();
        expect(titleEl!.textContent?.trim()).toBe('Alert Title');
    });

    it('should not render title element when title is empty (default)', () => {
        expect(host().querySelector('.bloc-alert__title')).toBeNull();
    });
});

// ── BlocAlertModule ──────────────────────────────────────────────────
describe('BlocAlertModule', () => {
    it('should be defined', () => {
        expect(BlocAlertModule).toBeDefined();
    });

    it('should allow using BlocAlertComponent via the module', async () => {
        @Component({
            template: `<bloc-alert>Hello</bloc-alert>`,
            standalone: true,
            imports: [BlocAlertModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(ModuleHostComponent);
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).querySelector('bloc-alert')).not.toBeNull();
    });
});
