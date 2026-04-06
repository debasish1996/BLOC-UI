import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BlocSliderComponent } from './slider.component';
import { BlocSliderModule } from './slider.module';

async function createComponent(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
        imports: [BlocSliderComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BlocSliderComponent);
    for (const [key, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
}

describe('BlocSliderComponent', () => {
    it('should create', async () => {
        const fixture = await createComponent();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render a range input with default min/max/step', async () => {
        const fixture = await createComponent();
        const input = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        expect(input).not.toBeNull();
        expect(input.min).toBe('0');
        expect(input.max).toBe('100');
        expect(input.step).toBe('1');
    });

    it('should render the label when label input is provided', async () => {
        const fixture = await createComponent({ label: 'Volume' });
        const label = (fixture.nativeElement as HTMLElement).querySelector('.bloc-slider__label');
        expect(label).not.toBeNull();
        expect(label!.textContent?.trim()).toBe('Volume');
    });

    it('should render the value span when showValue is true (default)', async () => {
        const fixture = await createComponent({ label: 'Test' });
        const valueEl = (fixture.nativeElement as HTMLElement).querySelector('.bloc-slider__value');
        expect(valueEl).not.toBeNull();
    });

    it('should not render meta block when label is empty and showValue is false', async () => {
        const fixture = await createComponent({ showValue: false });
        const meta = (fixture.nativeElement as HTMLElement).querySelector('.bloc-slider__meta');
        expect(meta).toBeNull();
    });

    it('should reflect min/max/step on the native input', async () => {
        const fixture = await createComponent({ min: 10, max: 200, step: 5 });
        const input = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        expect(input.min).toBe('10');
        expect(input.max).toBe('200');
        expect(input.step).toBe('5');
    });

    it('should disable the native input when disabled input is true', async () => {
        const fixture = await createComponent({ disabled: true });
        const input = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    it('should update value signal on input event', async () => {
        const fixture = await createComponent();
        const comp = fixture.componentInstance;
        const input = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        input.value = '42';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(comp.value()).toBe(42);
    });

    it('should call onChange callback on input event', async () => {
        const fixture = await createComponent();
        const comp = fixture.componentInstance;
        const onChange = vi.fn();
        comp.registerOnChange(onChange);

        const input = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        input.value = '75';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(onChange).toHaveBeenCalledWith(75);
    });

    it('should emit valueChange output on input event', async () => {
        const fixture = await createComponent();
        const emitted: number[] = [];
        fixture.componentInstance.valueChange.subscribe((v: number) => emitted.push(v));

        const input = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        input.value = '60';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emitted).toEqual([60]);
    });

    it('writeValue should set value clamped within min/max', async () => {
        const fixture = await createComponent({ min: 10, max: 80 });
        fixture.componentInstance.writeValue(200);
        expect(fixture.componentInstance.value()).toBe(80);

        fixture.componentInstance.writeValue(-5);
        expect(fixture.componentInstance.value()).toBe(10);
    });

    it('writeValue with null should default to min', async () => {
        const fixture = await createComponent({ min: 20 });
        fixture.componentInstance.writeValue(null);
        expect(fixture.componentInstance.value()).toBe(20);
    });

    it('setDisabledState should disable the input via forms integration', async () => {
        const fixture = await createComponent();
        fixture.componentInstance.setDisabledState(true);
        fixture.detectChanges();
        const input = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    it('markAsTouched should call onTouched callback', async () => {
        const fixture = await createComponent();
        const onTouched = vi.fn();
        fixture.componentInstance.registerOnTouched(onTouched);
        fixture.componentInstance.markAsTouched();
        expect(onTouched).toHaveBeenCalledOnce();
    });

    it('should work with a reactive FormControl', async () => {
        @Component({
            template: `<bloc-slider [formControl]="ctrl" [min]="0" [max]="100" />`,
            standalone: true,
            imports: [BlocSliderComponent, ReactiveFormsModule],
        })
        class HostComponent {
            readonly ctrl = new FormControl<number>(50, { nonNullable: true });
        }

        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const slider = (fixture.nativeElement as HTMLElement).querySelector(
            'input[type="range"]',
        ) as HTMLInputElement;
        expect(slider.value).toBe('50');
    });
});

describe('BlocSliderModule', () => {
    it('should be defined', () => {
        expect(BlocSliderModule).toBeDefined();
    });

    it('should allow using BlocSliderComponent via the module', async () => {
        @Component({
            template: `<bloc-slider />`,
            standalone: true,
            imports: [BlocSliderModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(ModuleHostComponent);
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).querySelector('bloc-slider')).not.toBeNull();
    });
});
