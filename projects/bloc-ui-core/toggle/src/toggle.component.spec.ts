import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BlocToggleComponent } from './toggle.component';
import { BlocToggleModule } from './toggle.module';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// ── BlocToggleComponent ──────────────────────────────────────────────
describe('BlocToggleComponent', () => {
    let fixture: ComponentFixture<BlocToggleComponent>;
    let component: BlocToggleComponent;

    function host(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocToggleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlocToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // — creation —
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // — ARIA role —
    it('should have role="switch"', () => {
        expect(host().getAttribute('role')).toBe('switch');
    });

    // — default state —
    it('should be unchecked by default (aria-checked=false)', () => {
        expect(host().getAttribute('aria-checked')).toBe('false');
    });

    it('should have tabindex 0 by default', () => {
        expect(host().getAttribute('tabindex')).toBe('0');
    });

    it('should not have aria-disabled by default', () => {
        expect(host().hasAttribute('aria-disabled')).toBe(false);
    });

    it('should not have disabled class by default', () => {
        expect(host().classList.contains('bloc-toggle--disabled')).toBe(false);
    });

    it('should not have checked class by default', () => {
        expect(host().classList.contains('bloc-toggle--checked')).toBe(false);
    });

    // — size input —
    it('should not apply size classes for default size "md"', () => {
        expect(host().classList.contains('bloc-toggle--sm')).toBe(false);
        expect(host().classList.contains('bloc-toggle--lg')).toBe(false);
    });

    it('should apply bloc-toggle--sm when size="sm"', () => {
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-toggle--sm')).toBe(true);
    });

    it('should apply bloc-toggle--lg when size="lg"', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-toggle--lg')).toBe(true);
    });

    // — labelPosition —
    it('should not apply label-before class by default', () => {
        expect(host().classList.contains('bloc-toggle--label-before')).toBe(false);
    });

    it('should apply bloc-toggle--label-before when labelPosition="before"', () => {
        fixture.componentRef.setInput('labelPosition', 'before');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-toggle--label-before')).toBe(true);
    });

    it('should not apply label-before class when labelPosition="after"', () => {
        fixture.componentRef.setInput('labelPosition', 'after');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-toggle--label-before')).toBe(false);
    });

    // — disabled input —
    it('should apply disabled state when disabled=true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        expect(host().classList.contains('bloc-toggle--disabled')).toBe(true);
        expect(host().getAttribute('aria-disabled')).toBe('true');
        expect(host().getAttribute('tabindex')).toBe('-1');
    });

    it('should not be disabled when disabled=false', () => {
        fixture.componentRef.setInput('disabled', false);
        fixture.detectChanges();
        expect(host().classList.contains('bloc-toggle--disabled')).toBe(false);
        expect(host().hasAttribute('aria-disabled')).toBe(false);
    });

    // — template structure —
    it('should render blog-toggle__track span', () => {
        expect(fixture.nativeElement.querySelector('.bloc-toggle__track')).not.toBeNull();
    });

    it('should render bloc-toggle__thumb span inside track', () => {
        expect(
            fixture.nativeElement.querySelector('.bloc-toggle__track .bloc-toggle__thumb'),
        ).not.toBeNull();
    });

    // — click toggling —
    it('should toggle to checked when clicked while unchecked', () => {
        host().click();
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('true');
        expect(host().classList.contains('bloc-toggle--checked')).toBe(true);
    });

    it('should toggle back to unchecked when clicked twice', () => {
        host().click();
        host().click();
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('false');
    });

    it('should not toggle when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        host().click();
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('false');
    });

    // — Space key —
    it('should toggle on Space keydown', () => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        const preventSpy = vi.spyOn(event, 'preventDefault');
        host().dispatchEvent(event);
        fixture.detectChanges();
        expect(preventSpy).toHaveBeenCalled();
        expect(host().getAttribute('aria-checked')).toBe('true');
    });

    it('should not toggle on Space when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const event = new KeyboardEvent('keydown', { key: ' ' });
        host().dispatchEvent(event);
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('false');
    });

    // — blur / touch callback —
    it('should call _onTouched on blur', () => {
        const spy = vi.fn();
        component._onTouched = spy;
        host().dispatchEvent(new Event('blur'));
        expect(spy).toHaveBeenCalledOnce();
    });

    // — ControlValueAccessor —
    it('writeValue(true) should mark as checked', () => {
        component.writeValue(true);
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('true');
    });

    it('writeValue(false) should mark as unchecked', () => {
        component.writeValue(true);
        component.writeValue(false);
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('false');
    });

    it('writeValue with truthy non-boolean should mark as checked', () => {
        component.writeValue(1);
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('true');
    });

    it('writeValue with falsy non-boolean should mark as unchecked', () => {
        component.writeValue(0);
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('false');
    });

    it('registerOnChange should register and fire on toggle', () => {
        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);
        host().click();
        expect(changeSpy).toHaveBeenCalledWith(true);
    });

    it('registerOnTouched should register the touched callback', () => {
        const touchSpy = vi.fn();
        component.registerOnTouched(touchSpy);
        host().dispatchEvent(new Event('blur'));
        expect(touchSpy).toHaveBeenCalledOnce();
    });

    it('setDisabledState(true) should disable via form API', () => {
        component.setDisabledState(true);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
        expect(host().classList.contains('bloc-toggle--disabled')).toBe(true);
    });

    it('setDisabledState(false) should re-enable when only form-disabled', () => {
        component.setDisabledState(true);
        component.setDisabledState(false);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(false);
    });

    it('isDisabled should be true when both disabled input and form disable', () => {
        fixture.componentRef.setInput('disabled', true);
        component.setDisabledState(true);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
    });

    it('isDisabled stays true if disabled input=true even when form re-enables', () => {
        fixture.componentRef.setInput('disabled', true);
        component.setDisabledState(false);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
    });

    // — default no-op callback (covers initial function body for 100% coverage) —
    it('default _onTouched no-op does not throw when called before registerOnTouched', () => {
        // _onTouched is still the initial () => {} function here
        expect(() => component._onTouched()).not.toThrow();
    });
});

// ── Integration: BlocToggleComponent with FormControl ────────────────
describe('BlocToggleComponent reactive forms integration', () => {
    @Component({
        template: `<bloc-toggle [formControl]="ctrl"></bloc-toggle>`,
        standalone: true,
        imports: [BlocToggleComponent, ReactiveFormsModule],
    })
    class ReactiveHostComponent {
        ctrl = new FormControl(false);
    }

    it('should reflect programmatic FormControl value changes', async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ReactiveHostComponent);
        f.detectChanges();
        const h = f.nativeElement.querySelector('bloc-toggle') as HTMLElement;

        expect(h.getAttribute('aria-checked')).toBe('false');
        f.componentInstance.ctrl.setValue(true);
        f.detectChanges();
        expect(h.getAttribute('aria-checked')).toBe('true');
    });

    it('should disable via FormControl.disable()', async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ReactiveHostComponent);
        f.detectChanges();
        f.componentInstance.ctrl.disable();
        f.detectChanges();
        const h = f.nativeElement.querySelector('bloc-toggle') as HTMLElement;
        expect(h.classList.contains('bloc-toggle--disabled')).toBe(true);
    });

    it('should update FormControl value when toggle is clicked', async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ReactiveHostComponent);
        f.detectChanges();
        const h = f.nativeElement.querySelector('bloc-toggle') as HTMLElement;
        h.click();
        f.detectChanges();
        expect(f.componentInstance.ctrl.value).toBe(true);
    });
});

// ── BlocToggleModule ──────────────────────────────────────────────────
describe('BlocToggleModule', () => {
    it('should be defined', () => {
        expect(BlocToggleModule).toBeDefined();
    });

    it('should allow using BlocToggleComponent via the module', async () => {
        @Component({
            template: `<bloc-toggle></bloc-toggle>`,
            standalone: true,
            imports: [BlocToggleModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHostComponent);
        modFixture.detectChanges();
        expect(
            (modFixture.nativeElement as HTMLElement).querySelector('bloc-toggle'),
        ).not.toBeNull();
    });
});
