import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BlocOptionDirective } from './option.directive';
import { BlocSelectComponent } from './select.component';
import { BlocSelectModule } from './select.module';

@Component({
    standalone: true,
    imports: [BlocSelectComponent, BlocOptionDirective, ReactiveFormsModule],
    template: `
        <bloc-select
            [formControl]="control"
            [searchable]="searchable"
            [clearable]="clearable"
            [loading]="loading"
            placeholder="Select fruit"
        >
            <div bloc-option value="apple">
                <strong>Apple</strong>
                <span class="option-meta">Fresh</span>
            </div>
            <div bloc-option value="banana">Banana</div>
            <div bloc-option value="cherry" [disabled]="disableCherry">Cherry</div>
        </bloc-select>
    `,
})
class ReactiveHostComponent {
    control = new FormControl<string | null>(null);
    searchable = true;
    clearable = true;
    loading = false;
    disableCherry = false;
}

describe('BlocSelectComponent', () => {
    let fixture: ComponentFixture<ReactiveHostComponent>;

    async function flush(): Promise<void> {
        fixture.detectChanges();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
    }

    function selectHost(): HTMLElement {
        return fixture.nativeElement.querySelector('bloc-select') as HTMLElement;
    }

    function openPanel(): HTMLElement {
        selectHost().click();
        fixture.detectChanges();
        return document.body.querySelector('.bloc-select__panel') as HTMLElement;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ReactiveHostComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        document.body.querySelectorAll('.bloc-select__panel').forEach((node) => node.remove());
    });

    it('should create the select host', () => {
        expect(selectHost()).toBeTruthy();
        expect(selectHost().getAttribute('role')).toBe('combobox');
    });

    it('should open on click and close on outside click', async () => {
        openPanel();
        await flush();

        expect(selectHost().getAttribute('aria-expanded')).toBe('true');
        expect(document.body.querySelector('.bloc-select__panel')).not.toBeNull();

        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.click();
        await flush();

        expect(selectHost().getAttribute('aria-expanded')).toBe('false');
        outside.remove();
    });

    it('should support keyboard navigation and Enter selection', async () => {
        selectHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await flush();

        let active = document.body.querySelector('.bloc-select-option--active') as HTMLElement;
        expect(active.textContent?.replace(/\s+/g, ' ').trim()).toContain('Apple');

        selectHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await flush();

        active = document.body.querySelector('.bloc-select-option--active') as HTMLElement;
        expect(active.textContent?.trim()).toBe('Banana');

        selectHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await flush();

        expect(fixture.componentInstance.control.value).toBe('banana');
        expect(selectHost().textContent).toContain('Banana');
        expect(selectHost().getAttribute('aria-expanded')).toBe('false');
    });

    it('should filter visible options when searchable', async () => {
        openPanel();
        await flush();

        const input = document.body.querySelector('.bloc-select__search-input') as HTMLInputElement;
        input.value = 'ban';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await flush();

        const visible = Array.from(
            document.body.querySelectorAll('.bloc-select-option:not([hidden])'),
        ).map((node) => node.textContent?.replace(/\s+/g, ' ').trim());

        expect(visible).toEqual(['Banana']);
    });

    it('should preserve projected custom option markup inside the overlay panel', async () => {
        openPanel();
        await flush();

        const customMeta = document.body.querySelector('.option-meta') as HTMLElement | null;
        expect(customMeta?.textContent).toBe('Fresh');
    });

    it('should reflect reactive form value and disabled state', async () => {
        fixture.componentInstance.control.setValue('apple');
        fixture.detectChanges();
        await flush();

        expect(selectHost().textContent).toContain('Apple');

        fixture.componentInstance.control.disable();
        fixture.detectChanges();
        await flush();

        expect(selectHost().getAttribute('aria-disabled')).toBe('true');
        expect(selectHost().getAttribute('tabindex')).toBe('-1');
    });

    it('should clear the current selection when clear is clicked', async () => {
        fixture.componentInstance.control.setValue('banana');
        fixture.detectChanges();
        await flush();

        const clearButton = selectHost().querySelector('.bloc-select__clear') as HTMLButtonElement;
        clearButton.click();
        await flush();

        expect(fixture.componentInstance.control.value).toBeNull();
        expect(selectHost().textContent).toContain('Select fruit');
    });
});

describe('BlocSelectModule', () => {
    it('should be defined', () => {
        expect(BlocSelectModule).toBeDefined();
    });
});
