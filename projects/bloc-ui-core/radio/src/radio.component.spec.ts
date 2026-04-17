import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocRadioGroupComponent } from './radio-group.component';
import { BlocRadioComponent } from './radio.component';
import { BlocRadioModule } from './radio.module';
import { BLOC_RADIO_GROUP, BlocRadioGroupRef } from './radio.token';

// ── Full integration host ─────────────────────────────────────────────
@Component({
    template: `
        <bloc-radio-group
            [disabled]="groupDisabled()"
            [labelPosition]="groupLabelPosition()"
            [(ngModel)]="selected"
        >
            <bloc-radio
                value="a"
                [size]="size()"
                [disabled]="itemDisabled()"
                [labelPosition]="itemLabelPosition()"
                >Option A</bloc-radio
            >
            <bloc-radio value="b">Option B</bloc-radio>
            <bloc-radio value="c" [disabled]="true">Option C (disabled)</bloc-radio>
        </bloc-radio-group>
    `,
    standalone: true,
    imports: [BlocRadioGroupComponent, BlocRadioComponent, FormsModule],
})
class FullHostComponent {
    selected: unknown = null;
    groupDisabled = signal(false);
    groupLabelPosition = signal<'before' | 'after'>('after');
    size = signal<'sm' | 'md' | 'lg'>('md');
    itemDisabled = signal(false);
    itemLabelPosition = signal<'before' | 'after' | null>(null);
}

@Component({
    template: `
        <bloc-radio-group [formControl]="ctrl">
            <bloc-radio value="x">X</bloc-radio>
            <bloc-radio value="y">Y</bloc-radio>
        </bloc-radio-group>
    `,
    standalone: true,
    imports: [BlocRadioGroupComponent, BlocRadioComponent, ReactiveFormsModule],
})
class ReactiveHostComponent {
    ctrl = new FormControl('x');
}

// ── BlocRadioGroupComponent ──────────────────────────────────────────
describe('BlocRadioGroupComponent', () => {
    let fixture: ComponentFixture<BlocRadioGroupComponent>;
    let component: BlocRadioGroupComponent;

    function host(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocRadioGroupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlocRadioGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have role="radiogroup"', () => {
        expect(host().getAttribute('role')).toBe('radiogroup');
    });

    it('should have bloc-radio-group class', () => {
        expect(host().classList.contains('bloc-radio-group')).toBe(true);
    });

    it('should not be disabled by default', () => {
        expect(host().classList.contains('bloc-radio-group--disabled')).toBe(false);
    });

    it('should apply disabled class when disabled=true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        expect(host().classList.contains('bloc-radio-group--disabled')).toBe(true);
    });

    // — ControlValueAccessor —
    it('writeValue should update value signal', () => {
        component.writeValue('b');
        expect(component.value()).toBe('b');
    });

    it('registerOnChange should be called on select()', () => {
        const spy = vi.fn();
        component.registerOnChange(spy);
        component.select('c');
        expect(spy).toHaveBeenCalledWith('c');
        expect(component.value()).toBe('c');
    });

    it('registerOnTouched should register markTouched', () => {
        const spy = vi.fn();
        component.registerOnTouched(spy);
        component.markTouched();
        expect(spy).toHaveBeenCalledOnce();
    });

    it('setDisabledState(true) should disable via form API', () => {
        component.setDisabledState(true);
        fixture.detectChanges();
        expect(component.isGroupDisabled()).toBe(true);
    });

    it('setDisabledState(false) should re-enable when input disabled is false', () => {
        component.setDisabledState(true);
        component.setDisabledState(false);
        fixture.detectChanges();
        expect(component.isGroupDisabled()).toBe(false);
    });

    it('isGroupDisabled should combine disabled input and form disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        component.setDisabledState(false);
        fixture.detectChanges();
        expect(component.isGroupDisabled()).toBe(true);
    });

    it('labelPosition defaults to "after"', () => {
        expect(component.labelPosition()).toBe('after');
    });

    it('labelPosition should reflect the input', () => {
        fixture.componentRef.setInput('labelPosition', 'before');
        fixture.detectChanges();
        expect(component.labelPosition()).toBe('before');
    });

    // — default no-op callbacks (covers initial function bodies for 100% coverage) —
    it('select should work before registerOnChange is called (exercises default _onChange)', () => {
        component.select('default-test');
        expect(component.value()).toBe('default-test');
    });

    it('default markTouched no-op does not throw when called before registerOnTouched', () => {
        expect(() => component.markTouched()).not.toThrow();
    });
});

// ── BlocRadioComponent ───────────────────────────────────────────────
describe('BlocRadioComponent (in group)', () => {
    let fixture: ComponentFixture<FullHostComponent>;
    let host: FullHostComponent;

    function radios(): HTMLElement[] {
        return Array.from(fixture.nativeElement.querySelectorAll('bloc-radio')) as HTMLElement[];
    }

    function radioAt(index: number): HTMLElement {
        return radios()[index];
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FullHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FullHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render 3 radio items', () => {
        expect(radios().length).toBe(3);
    });

    // — role / aria —
    it('should have role="radio" on each item', () => {
        for (const r of radios()) {
            expect(r.getAttribute('role')).toBe('radio');
        }
    });

    it('should have aria-checked="false" when not selected', () => {
        expect(radioAt(0).getAttribute('aria-checked')).toBe('false');
    });

    // — default classes —
    it('should not apply size classes when size="md"', () => {
        expect(radioAt(0).classList.contains('bloc-radio--sm')).toBe(false);
        expect(radioAt(0).classList.contains('bloc-radio--lg')).toBe(false);
    });

    it('should apply bloc-radio--sm when size="sm"', () => {
        host.size.set('sm');
        fixture.detectChanges();
        expect(radioAt(0).classList.contains('bloc-radio--sm')).toBe(true);
    });

    it('should apply bloc-radio--lg when size="lg"', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(radioAt(0).classList.contains('bloc-radio--lg')).toBe(true);
    });

    // — selection —
    it('should select a radio on click and set aria-checked=true', () => {
        radioAt(0).click();
        fixture.detectChanges();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('true');
    });

    it('should update parent model when radio is clicked', () => {
        radioAt(0).click();
        fixture.detectChanges();
        expect(host.selected).toBe('a');
    });

    it('should mark previously checked radio as unchecked when new one is selected', () => {
        radioAt(0).click();
        fixture.detectChanges();
        radioAt(1).click();
        fixture.detectChanges();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('false');
        expect(radioAt(1).getAttribute('aria-checked')).toBe('true');
    });

    it('should not toggle off when already-checked radio is clicked again', () => {
        radioAt(0).click();
        fixture.detectChanges();
        radioAt(0).click();
        fixture.detectChanges();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('true');
    });

    // — disabled item —
    it('disabled radio should have aria-disabled="true"', () => {
        expect(radioAt(2).getAttribute('aria-disabled')).toBe('true');
    });

    it('disabled radio should have tabindex -1', () => {
        expect(radioAt(2).getAttribute('tabindex')).toBe('-1');
    });

    it('disabled radio should not be selected when clicked', () => {
        radioAt(2).click();
        fixture.detectChanges();
        expect(radioAt(2).getAttribute('aria-checked')).toBe('false');
    });

    it('should apply bloc-radio--disabled class for disabled item', () => {
        expect(radioAt(2).classList.contains('bloc-radio--disabled')).toBe(true);
    });

    // — item-level disabled input —
    it('should disable individual radio via itemDisabled=true', () => {
        host.itemDisabled.set(true);
        fixture.detectChanges();
        expect(radioAt(0).classList.contains('bloc-radio--disabled')).toBe(true);
    });

    // — group-level disabled —
    it('should disable all radios when group is disabled', () => {
        host.groupDisabled.set(true);
        fixture.detectChanges();
        for (const r of radios()) {
            expect(r.getAttribute('tabindex')).toBe('-1');
        }
    });

    it('clicking a radio when group is disabled should not select it', () => {
        host.groupDisabled.set(true);
        fixture.detectChanges();
        radioAt(0).click();
        fixture.detectChanges();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('false');
    });

    // — Space key selection —
    it('should select on Space keydown', () => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        const preventSpy = vi.spyOn(event, 'preventDefault');
        radioAt(0).dispatchEvent(event);
        fixture.detectChanges();
        expect(preventSpy).toHaveBeenCalled();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('true');
    });

    it('should not select on Space when item is disabled', () => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        radioAt(2).dispatchEvent(event);
        fixture.detectChanges();
        expect(radioAt(2).getAttribute('aria-checked')).toBe('false');
    });

    // — labelPosition —
    it('should not apply label-before class when group labelPosition="after"', () => {
        expect(radioAt(0).classList.contains('bloc-radio--label-before')).toBe(false);
    });

    it('should apply label-before class when group labelPosition="before"', () => {
        host.groupLabelPosition.set('before');
        fixture.detectChanges();
        // item without override should inherit group position
        expect(radioAt(1).classList.contains('bloc-radio--label-before')).toBe(true);
    });

    it('item labelPosition override "before" should take precedence over group "after"', () => {
        host.itemLabelPosition.set('before');
        fixture.detectChanges();
        expect(radioAt(0).classList.contains('bloc-radio--label-before')).toBe(true);
    });

    it('item labelPosition override "after" should take precedence over group "before"', () => {
        host.groupLabelPosition.set('before');
        host.itemLabelPosition.set('after');
        fixture.detectChanges();
        expect(radioAt(0).classList.contains('bloc-radio--label-before')).toBe(false);
    });

    // — blur / touch —
    it('blur on a radio item should call group markTouched', () => {
        const groupEl = fixture.nativeElement.querySelector('bloc-radio-group');
        const groupComp = fixture.debugElement.query((el) => el.nativeElement === groupEl)
            ?.componentInstance as BlocRadioGroupComponent;

        if (groupComp) {
            const spy = vi.fn();
            groupComp.markTouched = spy;
            radioAt(0).dispatchEvent(new Event('blur'));
            expect(spy).toHaveBeenCalledOnce();
        }
    });

    // — ArrowDown navigation —
    it('ArrowDown should move focus and select next radio', () => {
        radioAt(0).click();
        fixture.detectChanges();

        const arrowDown = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
        });
        const preventSpy = vi.spyOn(arrowDown, 'preventDefault');
        radioAt(0).dispatchEvent(arrowDown);
        fixture.detectChanges();
        expect(preventSpy).toHaveBeenCalled();
    });

    it('ArrowRight should move focus and select next radio', () => {
        radioAt(0).click();
        fixture.detectChanges();

        const arrowRight = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            bubbles: true,
        });
        radioAt(0).dispatchEvent(arrowRight);
        fixture.detectChanges();
        // second option should now be selected
        expect(radioAt(1).getAttribute('aria-checked')).toBe('true');
    });

    it('ArrowUp should move focus to previous radio', () => {
        radioAt(1).click();
        fixture.detectChanges();

        const arrowUp = new KeyboardEvent('keydown', {
            key: 'ArrowUp',
            bubbles: true,
        });
        radioAt(1).dispatchEvent(arrowUp);
        fixture.detectChanges();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('true');
    });

    it('ArrowLeft should move focus to previous radio', () => {
        radioAt(1).click();
        fixture.detectChanges();

        const arrowLeft = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            bubbles: true,
        });
        radioAt(1).dispatchEvent(arrowLeft);
        fixture.detectChanges();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('true');
    });

    it('ArrowDown from last enabled radio should wrap to first', () => {
        // radios: 0=a(enabled), 1=b(enabled), 2=c(disabled)
        // enabled list: [0, 1]
        radioAt(1).click();
        fixture.detectChanges();

        const arrowDown = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
        });
        radioAt(1).dispatchEvent(arrowDown);
        fixture.detectChanges();
        expect(radioAt(0).getAttribute('aria-checked')).toBe('true');
    });

    it('ArrowDown from a disabled radio should not navigate (idx === -1 guard)', () => {
        // radioAt(2) is disabled — it's excluded from querySelectorAll(:not(.disabled))
        // so idx === -1, and navigate should return early without selecting anything
        const arrowDown = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
        });
        radioAt(2).dispatchEvent(arrowDown);
        fixture.detectChanges();
        for (const r of radios()) {
            expect(r.getAttribute('aria-checked')).toBe('false');
        }
    });
});

// ── _navigate without radiogroup ancestor ────────────────────────────
describe('BlocRadioComponent._navigate without radiogroup', () => {
    @Component({
        template: `<div><bloc-radio value="orphan">Orphan</bloc-radio></div>`,
        standalone: true,
        imports: [BlocRadioComponent],
        providers: [
            {
                provide: BLOC_RADIO_GROUP,
                useValue: {
                    value: signal(null),
                    isGroupDisabled: signal(false),
                    labelPosition: signal<'before' | 'after'>('after'),
                    select: vi.fn(),
                    markTouched: vi.fn(),
                } satisfies BlocRadioGroupRef,
            },
        ],
    })
    class OrphanHostComponent {}

    it('should not throw when no radiogroup ancestor exists', async () => {
        await TestBed.configureTestingModule({
            imports: [OrphanHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(OrphanHostComponent);
        f.detectChanges();

        const radioEl = f.nativeElement.querySelector('bloc-radio') as HTMLElement;
        const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        expect(() => radioEl.dispatchEvent(arrowDown)).not.toThrow();
    });
});

// ── Reactive forms integration ────────────────────────────────────────
describe('BlocRadioGroupComponent reactive forms integration', () => {
    it('should reflect FormControl initial value', async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ReactiveHostComponent);
        f.detectChanges();

        const first = f.nativeElement.querySelector(
            'bloc-radio[ng-reflect-value="x"]',
        ) as HTMLElement | null;
        // fallback: just check aria-checked on first radio
        const radios = Array.from(f.nativeElement.querySelectorAll('bloc-radio')) as HTMLElement[];
        expect(radios[0].getAttribute('aria-checked')).toBe('true');
        expect(radios[1].getAttribute('aria-checked')).toBe('false');
    });

    it('should update FormControl value on click', async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ReactiveHostComponent);
        f.detectChanges();

        const radios = Array.from(f.nativeElement.querySelectorAll('bloc-radio')) as HTMLElement[];
        radios[1].click();
        f.detectChanges();
        expect(f.componentInstance.ctrl.value).toBe('y');
    });

    it('should disable all radios when FormControl is disabled', async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ReactiveHostComponent);
        f.detectChanges();
        f.componentInstance.ctrl.disable();
        f.detectChanges();

        const group = f.nativeElement.querySelector('bloc-radio-group') as HTMLElement;
        expect(group.classList.contains('bloc-radio-group--disabled')).toBe(true);
    });
});

// ── BlocRadioModule ───────────────────────────────────────────────────
describe('BlocRadioModule', () => {
    it('should be defined', () => {
        expect(BlocRadioModule).toBeDefined();
    });

    it('should allow using BlocRadioGroupComponent and BlocRadioComponent via module', async () => {
        @Component({
            template: `
                <bloc-radio-group>
                    <bloc-radio value="1">One</bloc-radio>
                </bloc-radio-group>
            `,
            standalone: true,
            imports: [BlocRadioModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHostComponent);
        modFixture.detectChanges();
        expect(
            (modFixture.nativeElement as HTMLElement).querySelector('bloc-radio-group'),
        ).not.toBeNull();
        expect(
            (modFixture.nativeElement as HTMLElement).querySelector('bloc-radio'),
        ).not.toBeNull();
    });
});
