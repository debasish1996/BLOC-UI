import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import {
    BlocInputDirective,
    BlocInputComponent,
    BlocInputGroupDirective,
    BlocPrefixDirective,
    BlocSuffixDirective,
    BLOC_INPUT_GROUP_DIRECTIVES,
} from './input.directive';
import { BlocInputModule } from './input.module';

// ── Helpers ─────────────────────────────────────────────────────────

@Component({
    template: `<input blocInput [error]="error()" [autocomplete]="autocomplete()" />`,
    standalone: true,
    imports: [BlocInputDirective],
})
class SimpleHostComponent {
    readonly error = input<boolean>(false);
    readonly autocomplete = input<string | null>(null);
}

@Component({
    template: `<input blocInput [formControl]="ctrl" />`,
    standalone: true,
    imports: [BlocInputDirective, ReactiveFormsModule],
})
class FormControlHostComponent {
    ctrl = new FormControl('', Validators.required);
}

@Component({
    template: `
        <bloc-input-group>
            <bloc-prefix>$</bloc-prefix>
            <input blocInput />
            <bloc-suffix>kg</bloc-suffix>
        </bloc-input-group>
    `,
    standalone: true,
    imports: [BlocInputDirective, ...BLOC_INPUT_GROUP_DIRECTIVES],
})
class GroupHostComponent {}

@Component({
    template: `<div blocInputGroup></div>`,
    standalone: true,
    imports: [BlocInputGroupDirective],
})
class GroupAttrHostComponent {}

@Component({
    template: `<span blocPrefix></span>`,
    standalone: true,
    imports: [BlocPrefixDirective],
})
class PrefixAttrHostComponent {}

@Component({
    template: `<span blocSuffix></span>`,
    standalone: true,
    imports: [BlocSuffixDirective],
})
class SuffixAttrHostComponent {}

// ── BlocInputDirective ───────────────────────────────────────────────
describe('BlocInputDirective', () => {
    let fixture: ComponentFixture<SimpleHostComponent>;

    function input(): HTMLInputElement {
        return fixture.nativeElement.querySelector('input') as HTMLInputElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SimpleHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SimpleHostComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(input()).not.toBeNull();
    });

    it('should apply bloc-input class', () => {
        expect(input().classList.contains('bloc-input')).toBe(true);
    });

    it('should not have error class by default', () => {
        expect(input().classList.contains('bloc-input--error')).toBe(false);
    });

    it('should not have aria-invalid by default', () => {
        expect(input().hasAttribute('aria-invalid')).toBe(false);
    });

    it('should apply error class when error=true', () => {
        fixture.componentRef.setInput('error', true);
        fixture.detectChanges();
        expect(input().classList.contains('bloc-input--error')).toBe(true);
    });

    it('should set aria-invalid when error=true', () => {
        fixture.componentRef.setInput('error', true);
        fixture.detectChanges();
        expect(input().getAttribute('aria-invalid')).toBe('true');
    });

    it('should not set autocomplete attribute when null', () => {
        fixture.componentRef.setInput('autocomplete', null);
        fixture.detectChanges();
        expect(input().hasAttribute('autocomplete')).toBe(false);
    });

    it('should set autocomplete attribute when provided', () => {
        fixture.componentRef.setInput('autocomplete', 'off');
        fixture.detectChanges();
        expect(input().getAttribute('autocomplete')).toBe('off');
    });

    it('should inject a <style> tag with id "bloc-input-styles"', () => {
        const doc = TestBed.inject(DOCUMENT);
        expect(doc.getElementById('bloc-input-styles')).not.toBeNull();
    });

    it('should not inject duplicate style tags', () => {
        const doc = TestBed.inject(DOCUMENT);
        expect(doc.querySelectorAll('#bloc-input-styles').length).toBe(1);
    });

    // ── BlocInputComponent alias ──────────────────────────────────────
    it('BlocInputComponent should be an alias for BlocInputDirective', () => {
        expect(BlocInputComponent).toBe(BlocInputDirective);
    });
});

// ── BlocInputDirective + FormControl integration ─────────────────────
describe('BlocInputDirective with FormControl', () => {
    let fixture: ComponentFixture<FormControlHostComponent>;
    let host: FormControlHostComponent;

    function input(): HTMLInputElement {
        return fixture.nativeElement.querySelector('input') as HTMLInputElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormControlHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FormControlHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should not have error class when control is pristine', () => {
        expect(input().classList.contains('bloc-input--error')).toBe(false);
    });

    it('should not apply error class when control is valid after touch', () => {
        host.ctrl.setValue('hello');
        host.ctrl.markAsTouched();
        fixture.detectChanges();
        expect(input().classList.contains('bloc-input--error')).toBe(false);
    });

    it('should apply error class when control is invalid and touched', () => {
        host.ctrl.setValue('');
        host.ctrl.markAsTouched();
        host.ctrl.updateValueAndValidity();
        fixture.detectChanges();
        expect(input().classList.contains('bloc-input--error')).toBe(true);
    });

    it('should apply error class after blur on invalid touched control', () => {
        host.ctrl.setValue('');
        host.ctrl.markAsTouched();
        input().dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(input().classList.contains('bloc-input--error')).toBe(true);
    });

    it('should remove error class when control becomes valid', () => {
        host.ctrl.setValue('');
        host.ctrl.markAsTouched();
        host.ctrl.updateValueAndValidity();
        fixture.detectChanges();

        host.ctrl.setValue('valid');
        host.ctrl.updateValueAndValidity();
        fixture.detectChanges();
        expect(input().classList.contains('bloc-input--error')).toBe(false);
    });
});

// ── BlocInputGroupDirective ──────────────────────────────────────────
describe('BlocInputGroupDirective', () => {
    it('should apply bloc-input-group class on element selector', async () => {
        await TestBed.configureTestingModule({
            imports: [GroupHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(GroupHostComponent);
        f.detectChanges();
        const group = f.nativeElement.querySelector('bloc-input-group') as HTMLElement;
        expect(group.classList.contains('bloc-input-group')).toBe(true);
    });

    it('should apply bloc-input-group class on attribute selector', async () => {
        await TestBed.configureTestingModule({
            imports: [GroupAttrHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(GroupAttrHostComponent);
        f.detectChanges();
        const el = f.nativeElement.querySelector('[blocInputGroup]') as HTMLElement;
        expect(el.classList.contains('bloc-input-group')).toBe(true);
    });

    it('should inject bloc-input-group-styles into document.head', () => {
        const doc = TestBed.inject(DOCUMENT);
        expect(doc.getElementById('bloc-input-group-styles')).not.toBeNull();
    });
});

// ── BlocPrefixDirective ──────────────────────────────────────────────
describe('BlocPrefixDirective', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GroupHostComponent],
        }).compileComponents();
    });

    it('should apply bloc-input-prefix class', () => {
        const f = TestBed.createComponent(GroupHostComponent);
        f.detectChanges();
        const prefix = f.nativeElement.querySelector('bloc-prefix') as HTMLElement;
        expect(prefix.classList.contains('bloc-input-prefix')).toBe(true);
    });

    it('should apply bloc-input-prefix class via attribute selector', async () => {
        await TestBed.configureTestingModule({
            imports: [PrefixAttrHostComponent],
        }).compileComponents();
        const f = TestBed.createComponent(PrefixAttrHostComponent);
        f.detectChanges();
        expect(
            (f.nativeElement.querySelector('[blocPrefix]') as HTMLElement).classList.contains(
                'bloc-input-prefix',
            ),
        ).toBe(true);
    });
});

// ── BlocSuffixDirective ──────────────────────────────────────────────
describe('BlocSuffixDirective', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GroupHostComponent],
        }).compileComponents();
    });

    it('should apply bloc-input-suffix class', () => {
        const f = TestBed.createComponent(GroupHostComponent);
        f.detectChanges();
        const suffix = f.nativeElement.querySelector('bloc-suffix') as HTMLElement;
        expect(suffix.classList.contains('bloc-input-suffix')).toBe(true);
    });

    it('should apply bloc-input-suffix class via attribute selector', async () => {
        await TestBed.configureTestingModule({
            imports: [SuffixAttrHostComponent],
        }).compileComponents();
        const f = TestBed.createComponent(SuffixAttrHostComponent);
        f.detectChanges();
        expect(
            (f.nativeElement.querySelector('[blocSuffix]') as HTMLElement).classList.contains(
                'bloc-input-suffix',
            ),
        ).toBe(true);
    });
});

// ── BlocInputModule ──────────────────────────────────────────────────
describe('BlocInputModule', () => {
    it('should be defined', () => {
        expect(BlocInputModule).toBeDefined();
    });

    it('should allow using BlocInputDirective via the module', async () => {
        @Component({
            template: `<input blocInput />`,
            standalone: true,
            imports: [BlocInputModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHostComponent);
        modFixture.detectChanges();
        expect(
            (modFixture.nativeElement as HTMLElement)
                .querySelector('input')
                ?.classList.contains('bloc-input'),
        ).toBe(true);
    });
});
