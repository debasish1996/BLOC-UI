import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BlocAutocompleteComponent, BlocAutocompleteOption } from './autocomplete.component';
import { BlocAutocompleteModule } from './autocomplete.module';

const teamOptions: BlocAutocompleteOption<string>[] = [
    { label: 'Design', value: 'design', description: 'Brand, motion' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Growth', value: 'growth' },
    { label: 'Operations', value: 'ops', disabled: true },
];

// ── BlocAutocompleteComponent ────────────────────────────────────────────────
describe('BlocAutocompleteComponent', () => {
    let fixture: ComponentFixture<BlocAutocompleteComponent<string>>;
    let component: BlocAutocompleteComponent<string>;

    async function flush(): Promise<void> {
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
    }

    function host(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    function input(): HTMLInputElement {
        return host().querySelector('.bloc-autocomplete__input') as HTMLInputElement;
    }

    // The panel is moved into .bloc-overlay-container via OverlayService when open.
    function panel(): HTMLElement | null {
        return document.body.querySelector('.bloc-overlay-container .bloc-autocomplete__panel');
    }

    function panelOptions(): NodeListOf<Element> {
        return document.body.querySelectorAll('.bloc-overlay-container .bloc-autocomplete__option');
    }

    function panelState(): HTMLElement | null {
        return document.body.querySelector('.bloc-overlay-container .bloc-autocomplete__state');
    }

    function openPanel(): void {
        component.openPanel();
        fixture.detectChanges();
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocAutocompleteComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlocAutocompleteComponent<string>);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', teamOptions);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        document.body.querySelectorAll('.bloc-overlay-container').forEach((n) => n.remove());
    });

    // — creation —

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render an input element', () => {
        expect(input()).not.toBeNull();
    });

    it('should not show panel in body on initial render', () => {
        expect(panel()).toBeNull();
    });

    // — open / close —

    it('should open panel on input focus', async () => {
        input().dispatchEvent(new Event('focus'));
        await flush();
        expect(panel()).not.toBeNull();
    });

    it('should show all options when opened with empty query', async () => {
        input().dispatchEvent(new Event('focus'));
        await flush();
        expect(panelOptions().length).toBe(4);
    });

    it('should close panel on Escape', async () => {
        openPanel();
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await flush();
        expect(component.isOpen()).toBe(false);
        expect(panel()).toBeNull();
    });

    // — filtering —

    it('should filter options by label query', async () => {
        openPanel();
        component.query.set('des');
        await flush();
        expect(panelOptions().length).toBe(1);
        expect(panelOptions()[0].textContent).toContain('Design');
    });

    it('should filter by description text as well', async () => {
        openPanel();
        component.query.set('Brand');
        await flush();
        expect(panelOptions().length).toBe(1);
    });

    it('should show empty state when query matches nothing', async () => {
        openPanel();
        component.query.set('zzz');
        await flush();
        expect(panelState()?.textContent?.trim()).toBe('No results found');
    });

    it('should show custom emptyText when provided', async () => {
        fixture.componentRef.setInput('emptyText', 'Nothing here');
        openPanel();
        component.query.set('zzz');
        await flush();
        expect(panelState()?.textContent?.trim()).toBe('Nothing here');
    });

    // — keyboard navigation —

    it('should open panel on ArrowDown when closed', async () => {
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await flush();
        expect(component.isOpen()).toBe(true);
    });

    it('should advance activeIndex on ArrowDown', () => {
        openPanel();
        component.activeIndex.set(0);
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(component.activeIndex()).toBe(1);
    });

    it('should skip disabled options when advancing with ArrowDown', () => {
        // Growth is index 2, ops (index 3) is disabled → next enabled = -1
        openPanel();
        component.activeIndex.set(2);
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(component.activeIndex()).toBe(-1);
    });

    it('should move activeIndex back on ArrowUp', () => {
        openPanel();
        component.activeIndex.set(2);
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        fixture.detectChanges();
        expect(component.activeIndex()).toBe(1);
    });

    it('should select active option on Enter', async () => {
        openPanel();
        component.activeIndex.set(0);
        fixture.detectChanges();
        input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await flush();
        expect(component.selectedOption()?.value).toBe('design');
        expect(component.isOpen()).toBe(false);
    });

    // — selection —

    it('should update query to option label after selection', () => {
        component.selectOption(teamOptions[0]);
        fixture.detectChanges();
        expect(component.query()).toBe('Design');
    });

    it('should close panel after selection', async () => {
        openPanel();
        component.selectOption(teamOptions[0]);
        await flush();
        expect(component.isOpen()).toBe(false);
        expect(panel()).toBeNull();
    });

    it('should emit selectionChange on selection', () => {
        const spy = vi.fn();
        component.selectionChange.subscribe(spy);
        component.selectOption(teamOptions[0]);
        expect(spy).toHaveBeenCalledWith('design');
    });

    it('should not select a disabled option', () => {
        component.selectOption(teamOptions[3]); // ops is disabled
        expect(component.selectedOption()).toBeNull();
    });

    it('should mark is-selected class on the selected option', async () => {
        openPanel();
        component.selectOption(teamOptions[0]);
        component.query.set(''); // clear filter so all options are visible
        openPanel();
        await flush();
        expect(panelOptions()[0].classList.contains('is-selected')).toBe(true);
        expect(panelOptions()[1].classList.contains('is-selected')).toBe(false);
    });

    // — clearable —

    it('should not show clear button when clearable=false (default)', () => {
        component.selectedOption.set(teamOptions[0]);
        fixture.detectChanges();
        expect(host().querySelector('.bloc-autocomplete__clear')).toBeNull();
    });

    it('should show clear button when clearable=true and option is selected', () => {
        fixture.componentRef.setInput('clearable', true);
        component.selectedOption.set(teamOptions[0]);
        fixture.detectChanges();
        expect(host().querySelector('.bloc-autocomplete__clear')).not.toBeNull();
    });

    it('should clear selection when clear button is clicked', () => {
        fixture.componentRef.setInput('clearable', true);
        component.selectedOption.set(teamOptions[0]);
        component.query.set('Design');
        fixture.detectChanges();
        const clearBtn = host().querySelector<HTMLButtonElement>('.bloc-autocomplete__clear')!;
        clearBtn.click();
        fixture.detectChanges();
        expect(component.selectedOption()).toBeNull();
        expect(component.query()).toBe('');
    });

    it('should emit null on clear', () => {
        const spy = vi.fn();
        component.selectionChange.subscribe(spy);
        component.selectedOption.set(teamOptions[0]);
        component.clear();
        expect(spy).toHaveBeenCalledWith(null);
    });

    // — loading state —

    it('should show loading message when loading=true and panel is open', async () => {
        fixture.componentRef.setInput('loading', true);
        openPanel();
        await flush();
        expect(panelState()?.textContent?.trim()).toBe('Loading options...');
    });

    it('should show custom loadingText', async () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('loadingText', 'Fetching teams...');
        openPanel();
        await flush();
        expect(panelState()?.textContent?.trim()).toBe('Fetching teams...');
    });

    it('should not render an option list when loading=true', async () => {
        fixture.componentRef.setInput('loading', true);
        openPanel();
        await flush();
        expect(panelOptions().length).toBe(0);
    });

    // — disabled —

    it('should not open panel when disabled=true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        component.openPanel();
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
    });

    // — ControlValueAccessor —

    it('should call onChange when option is selected', () => {
        const fn = vi.fn();
        component.registerOnChange(fn);
        component.selectOption(teamOptions[0]);
        expect(fn).toHaveBeenCalledWith('design');
    });

    it('should call onChange with null on clear', () => {
        const fn = vi.fn();
        component.registerOnChange(fn);
        component.selectedOption.set(teamOptions[0]);
        component.clear();
        expect(fn).toHaveBeenCalledWith(null);
    });

    it('writeValue should update query and selectedOption to matching option', () => {
        component.writeValue('engineering');
        expect(component.query()).toBe('Engineering');
        expect(component.selectedOption()?.value).toBe('engineering');
    });

    it('writeValue with null should clear selection and query', () => {
        component.writeValue('engineering');
        component.writeValue(null);
        expect(component.selectedOption()).toBeNull();
        expect(component.query()).toBe('');
    });

    it('setDisabledState true should disable the control', () => {
        component.setDisabledState(true);
        expect(component.isDisabled()).toBe(true);
    });

    it('setDisabledState false should re-enable the control', () => {
        component.setDisabledState(true);
        component.setDisabledState(false);
        expect(component.isDisabled()).toBe(false);
    });

    // — ARIA —

    it('should have role="combobox" on the input', () => {
        expect(input().getAttribute('role')).toBe('combobox');
    });

    it('should set aria-expanded="false" when panel is closed', () => {
        expect(input().getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-expanded="true" when panel is open', () => {
        openPanel();
        expect(input().getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-controls to the panelId', () => {
        expect(input().getAttribute('aria-controls')).toBe(component.panelId);
    });

    it('should set aria-activedescendant to active option id', () => {
        openPanel();
        component.activeIndex.set(0);
        fixture.detectChanges();
        expect(input().getAttribute('aria-activedescendant')).toBe(component.optionId(0));
    });

    it('should have role="listbox" on the panel', async () => {
        openPanel();
        await flush();
        expect(panel()?.getAttribute('role')).toBe('listbox');
    });

    it('should have role="option" on each option button', async () => {
        openPanel();
        await flush();
        const options = panelOptions();
        expect(options.length).toBeGreaterThan(0);
        options.forEach((opt) => expect(opt.getAttribute('role')).toBe('option'));
    });

    it('should set aria-selected="true" on the selected option', async () => {
        openPanel();
        component.selectOption(teamOptions[0]);
        openPanel();
        await flush();
        expect(panelOptions()[0].getAttribute('aria-selected')).toBe('true');
    });
});

// ── BlocAutocompleteModule ────────────────────────────────────────────────────
describe('BlocAutocompleteModule', () => {
    it('should be defined', () => {
        expect(BlocAutocompleteModule).toBeDefined();
    });

    it('should allow using BlocAutocompleteComponent via the module', async () => {
        @Component({
            template: `<bloc-autocomplete></bloc-autocomplete>`,
            standalone: true,
            imports: [BlocAutocompleteModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const f = TestBed.createComponent(ModuleHostComponent);
        f.detectChanges();
        expect((f.nativeElement as HTMLElement).querySelector('bloc-autocomplete')).not.toBeNull();
    });
});
