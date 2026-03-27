import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BlocButtonComponent } from './button.component';
import { BlocButtonModule } from './button.module';
import { Component } from '@angular/core';

// ── BlocButtonComponent ────────────────────────────────────────────
describe('BlocButtonComponent', () => {
    let fixture: ComponentFixture<BlocButtonComponent>;
    let component: BlocButtonComponent;

    function btn(): HTMLButtonElement {
        return fixture.nativeElement as HTMLButtonElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlocButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // — creation —
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // — default host class —
    it('should apply bloc-button class by default', () => {
        expect(btn().classList.contains('bloc-button')).toBe(true);
    });

    it('should apply bloc-button--primary variant class by default', () => {
        expect(btn().classList.contains('bloc-button--primary')).toBe(true);
    });

    it('should not be disabled by default', () => {
        expect(btn().disabled).toBe(false);
    });

    it('should not be in loading state by default', () => {
        expect(btn().classList.contains('bloc-button--loading')).toBe(false);
    });

    // — variant input —
    it('should apply bloc-button--secondary when variant="secondary"', () => {
        fixture.componentRef.setInput('variant', 'secondary');
        fixture.detectChanges();
        expect(btn().classList.contains('bloc-button--secondary')).toBe(true);
        expect(btn().classList.contains('bloc-button--primary')).toBe(false);
    });

    it('should apply bloc-button--outline when variant="outline"', () => {
        fixture.componentRef.setInput('variant', 'outline');
        fixture.detectChanges();
        expect(btn().classList.contains('bloc-button--outline')).toBe(true);
    });

    // — disabled input —
    it('should disable the button when disabled=true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        expect(btn().disabled).toBe(true);
    });

    it('should enable the button when disabled=false', () => {
        fixture.componentRef.setInput('disabled', false);
        fixture.detectChanges();
        expect(btn().disabled).toBe(false);
    });

    // — loading input —
    it('should add loading class when loading=true', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();
        expect(btn().classList.contains('bloc-button--loading')).toBe(true);
    });

    it('should disable the button while loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();
        expect(btn().disabled).toBe(true);
    });

    it('should set aria-busy when loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();
        expect(btn().getAttribute('aria-busy')).toBe('true');
    });

    it('should not set aria-busy when not loading', () => {
        fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();
        // null attribute renders as missing attribute
        expect(btn().hasAttribute('aria-busy')).toBe(false);
    });

    it('should render a spinner element when loading=true', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();
        const spinner = fixture.nativeElement.querySelector('[blocSpinner]');
        expect(spinner).not.toBeNull();
    });

    it('should not render a spinner element when loading=false', () => {
        fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();
        const spinner = fixture.nativeElement.querySelector('[blocSpinner]');
        expect(spinner).toBeNull();
    });

    // — clicked output —
    it('should emit clicked when button is clicked and not disabled or loading', () => {
        const spy = vi.fn();
        component.clicked.subscribe(spy);
        btn().click();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
    });

    it('should not emit clicked when disabled=true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const spy = vi.fn();
        component.clicked.subscribe(spy);
        component.handleClick(new MouseEvent('click'));
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit clicked when loading=true', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();
        const spy = vi.fn();
        component.clicked.subscribe(spy);
        component.handleClick(new MouseEvent('click'));
        expect(spy).not.toHaveBeenCalled();
    });

    it('should emit clicked when neither disabled nor loading', () => {
        fixture.componentRef.setInput('disabled', false);
        fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();
        const spy = vi.fn();
        component.clicked.subscribe(spy);
        const event = new MouseEvent('click');
        component.handleClick(event);
        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0][0]).toBe(event);
    });
});

// ── BlocButtonModule ──────────────────────────────────────────────
describe('BlocButtonModule', () => {
    it('should be defined', () => {
        expect(BlocButtonModule).toBeDefined();
    });

    it('should allow using BlocButtonComponent via the module', async () => {
        @Component({
            template: `<button blocButton>Click</button>`,
            standalone: true,
            imports: [BlocButtonModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHostComponent);
        modFixture.detectChanges();
        expect((modFixture.nativeElement as HTMLElement).querySelector('button')).not.toBeNull();
    });
});
