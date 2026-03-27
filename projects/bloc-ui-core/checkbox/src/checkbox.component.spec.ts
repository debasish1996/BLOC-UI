import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BlocCheckboxComponent } from './checkbox.component';
import { BlocCheckboxModule } from './checkbox.module';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// ── BlocCheckboxComponent ────────────────────────────────────────────
describe('BlocCheckboxComponent', () => {
    let fixture: ComponentFixture<BlocCheckboxComponent>;
    let component: BlocCheckboxComponent;

    function host(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocCheckboxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlocCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // — creation —
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // — ARIA role —
    it('should have role="checkbox"', () => {
        expect(host().getAttribute('role')).toBe('checkbox');
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

    it('should not have disabled classes by default', () => {
        expect(host().classList.contains('bloc-checkbox--disabled')).toBe(false);
    });

    // — size input —
    it('should not apply size classes for default size "md"', () => {
        expect(host().classList.contains('bloc-checkbox--sm')).toBe(false);
        expect(host().classList.contains('bloc-checkbox--lg')).toBe(false);
    });

    it('should apply bloc-checkbox--sm when size="sm"', () => {
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-checkbox--sm')).toBe(true);
    });

    it('should apply bloc-checkbox--lg when size="lg"', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-checkbox--lg')).toBe(true);
    });

    // — labelPosition input —
    it('should not apply label-before class by default (after)', () => {
        expect(host().classList.contains('bloc-checkbox--label-before')).toBe(false);
    });

    it('should apply bloc-checkbox--label-before when labelPosition="before"', () => {
        fixture.componentRef.setInput('labelPosition', 'before');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-checkbox--label-before')).toBe(true);
    });

    it('should not apply label-before class when labelPosition="after"', () => {
        fixture.componentRef.setInput('labelPosition', 'after');
        fixture.detectChanges();
        expect(host().classList.contains('bloc-checkbox--label-before')).toBe(false);
    });

    // — disabled input —
    it('should apply disabled state when disabled=true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        expect(host().classList.contains('bloc-checkbox--disabled')).toBe(true);
        expect(host().getAttribute('aria-disabled')).toBe('true');
        expect(host().getAttribute('tabindex')).toBe('-1');
    });

    it('should not be disabled when disabled=false', () => {
        fixture.componentRef.setInput('disabled', false);
        fixture.detectChanges();
        expect(host().classList.contains('bloc-checkbox--disabled')).toBe(false);
        expect(host().hasAttribute('aria-disabled')).toBe(false);
    });

    // — click toggling —
    it('should toggle to checked when clicked while unchecked', () => {
        host().click();
        fixture.detectChanges();
        expect(host().getAttribute('aria-checked')).toBe('true');
        expect(host().classList.contains('bloc-checkbox--checked')).toBe(true);
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
        expect(host().classList.contains('bloc-checkbox--disabled')).toBe(true);
    });

    it('setDisabledState(false) should re-enable when only form-disabled', () => {
        component.setDisabledState(true);
        component.setDisabledState(false);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(false);
    });

    it('isDisabled should be true when both disabled input and form disable it', () => {
        fixture.componentRef.setInput('disabled', true);
        component.setDisabledState(true);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
    });

    // — isDisabled stays true even if form re-enables when input disabled is true —
    it('isDisabled stays true if disabled input=true even when form re-enables', () => {
        fixture.componentRef.setInput('disabled', true);
        component.setDisabledState(false);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
    });

    // — default no-op callbacks (covers initial function bodies for 100% coverage) —
    it('default _onTouched no-op does not throw when called before registerOnTouched', () => {
        // _onTouched is still the initial () => {} function here
        expect(() => component._onTouched()).not.toThrow();
    });
});

// ── Integration: BlocCheckboxComponent with FormControl ──────────────
describe('BlocCheckboxComponent reactive forms integration', () => {
    @Component({
        template: `<bloc-checkbox [formControl]="ctrl"></bloc-checkbox>`,
        standalone: true,
        imports: [BlocCheckboxComponent, ReactiveFormsModule],
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
        const host = f.nativeElement.querySelector('bloc-checkbox') as HTMLElement;

        expect(host.getAttribute('aria-checked')).toBe('false');
        f.componentInstance.ctrl.setValue(true);
        f.detectChanges();
        expect(host.getAttribute('aria-checked')).toBe('true');
    });

    it('should disable via FormControl.disable()', async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ReactiveHostComponent);
        f.detectChanges();
        f.componentInstance.ctrl.disable();
        f.detectChanges();
        const host = f.nativeElement.querySelector('bloc-checkbox') as HTMLElement;
        expect(host.classList.contains('bloc-checkbox--disabled')).toBe(true);
    });
});

// ── BlocCheckboxModule ───────────────────────────────────────────────
describe('BlocCheckboxModule', () => {
    it('should be defined', () => {
        expect(BlocCheckboxModule).toBeDefined();
    });

    it('should allow using BlocCheckboxComponent via the module', async () => {
        @Component({
            template: `<bloc-checkbox></bloc-checkbox>`,
            standalone: true,
            imports: [BlocCheckboxModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHostComponent);
        modFixture.detectChanges();
        expect(
            (modFixture.nativeElement as HTMLElement).querySelector('bloc-checkbox'),
        ).not.toBeNull();
    });
});
