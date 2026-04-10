import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlocAutocompleteComponent, BlocAutocompleteOption } from './autocomplete.component';
import { BlocAutocompleteModule } from './autocomplete.module';
import { BlocAutocompleteFuzzySearch } from './autocomplete-fuzzy-search.directive';
import { BlocAutocompleteHighlightComponent } from './autocomplete-highlight.component';

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

    // — placeholder —

    it('should reflect placeholder input on the HTML input element', () => {
        fixture.componentRef.setInput('placeholder', 'Search teams');
        fixture.detectChanges();
        expect(input().placeholder).toBe('Search teams');
    });

    // — error input —

    it('should return true from hasError() when error input is true', () => {
        fixture.componentRef.setInput('error', true);
        fixture.detectChanges();
        expect(component.hasError()).toBe(true);
    });

    it('should add is-error host class when error input is true', () => {
        fixture.componentRef.setInput('error', true);
        fixture.detectChanges();
        expect((host() as HTMLElement).classList.contains('is-error')).toBe(true);
    });

    // — onInput —

    it('should open panel and set query when onInput is called while closed', async () => {
        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: { value: 'des' } });
        component.onInput(event);
        await flush();
        expect(component.query()).toBe('des');
        expect(component.isOpen()).toBe(true);
    });

    it('should reset activeIndex to first enabled when typing while panel is open', async () => {
        openPanel();
        component.activeIndex.set(2);
        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: { value: 'des' } });
        component.onInput(event);
        await flush();
        // 'Design' matches 'des' → first enabled index is 0
        expect(component.activeIndex()).toBe(0);
    });

    // — handleBlur —

    it('should close the panel after blur', async () => {
        openPanel();
        component.handleBlur();
        await new Promise((resolve) => setTimeout(resolve, 150));
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
    });

    it('should restore selected label in query after blur', async () => {
        component.selectOption(teamOptions[0]);
        openPanel();
        component.query.set('partial');
        component.handleBlur();
        await new Promise((resolve) => setTimeout(resolve, 150));
        fixture.detectChanges();
        expect(component.query()).toBe('Design');
    });

    // — filterFn —

    it('should use filterFn when provided instead of default filter', async () => {
        const customFilter = vi.fn().mockReturnValue([teamOptions[0]]);
        fixture.componentRef.setInput('filterFn', customFilter);
        openPanel();
        component.query.set('anything');
        await flush();
        expect(customFilter).toHaveBeenCalledWith(teamOptions, 'anything');
        expect(panelOptions().length).toBe(1);
        expect(panelOptions()[0].textContent).toContain('Design');
    });

    it('should not call filterFn for empty query', async () => {
        const customFilter = vi.fn().mockReturnValue([]);
        fixture.componentRef.setInput('filterFn', customFilter);
        openPanel();
        component.query.set('');
        await flush();
        expect(customFilter).not.toHaveBeenCalled();
        expect(panelOptions().length).toBe(4);
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

// ── BlocAutocompleteFuzzySearch ───────────────────────────────────────────────
describe('BlocAutocompleteFuzzySearch', () => {
    const countries: BlocAutocompleteOption<string>[] = [
        { label: 'United States', value: 'us', description: 'North America' },
        { label: 'United Kingdom', value: 'uk', description: 'Europe' },
        { label: 'Germany', value: 'de', description: 'Europe' },
        { label: 'France', value: 'fr', description: 'Europe' },
    ];

    @Component({
        template: `
            <bloc-autocomplete
                [options]="options"
                [blocAutocompleteFuzzySearch]="config"
            />
        `,
        standalone: true,
        imports: [BlocAutocompleteComponent, BlocAutocompleteFuzzySearch],
    })
    class FuzzyHostComponent {
        options = countries;
        config = { keys: ['label', 'description'], threshold: 0.6 };
    }

    let hostFixture: ComponentFixture<FuzzyHostComponent>;
    let autocomplete: BlocAutocompleteComponent<string>;
    let fuzzyDir: BlocAutocompleteFuzzySearch<string>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuzzyHostComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(FuzzyHostComponent);
        hostFixture.detectChanges();

        const acEl = hostFixture.debugElement.query(By.directive(BlocAutocompleteComponent));
        autocomplete = acEl.componentInstance as BlocAutocompleteComponent<string>;
        fuzzyDir = acEl.injector.get(BlocAutocompleteFuzzySearch) as BlocAutocompleteFuzzySearch<string>;
    });

    afterEach(() => {
        hostFixture.destroy();
        document.body.querySelectorAll('.bloc-overlay-container').forEach((n) => n.remove());
    });

    it('returns all options when query is empty', () => {
        autocomplete.query.set('');
        hostFixture.detectChanges();
        expect(autocomplete.filteredOptions().length).toBe(countries.length);
    });

    it('uses fuzzy matching to find options', () => {
        autocomplete.query.set('ger');
        hostFixture.detectChanges();
        expect(autocomplete.filteredOptions().some((o) => o.value === 'de')).toBe(true);
    });

    it('is case-insensitive by default', () => {
        autocomplete.query.set('FRANCE');
        hostFixture.detectChanges();
        expect(autocomplete.filteredOptions().some((o) => o.value === 'fr')).toBe(true);
    });

    it('searches description field by default', () => {
        autocomplete.query.set('north');
        hostFixture.detectChanges();
        expect(autocomplete.filteredOptions().some((o) => o.value === 'us')).toBe(true);
    });

    it('highlight() wraps matched ranges in <mark> tags', () => {
        const html = fuzzyDir.highlight('Design', [[0, 2]]);
        expect(html).toContain('<mark>Des</mark>');
    });

    it('highlight() escapes HTML special characters outside match', () => {
        const html = fuzzyDir.highlight('<bold>', []);
        expect(html).not.toContain('<bold>');
        expect(html).toContain('&lt;bold&gt;');
    });

    it('highlight() merges overlapping match ranges', () => {
        const html = fuzzyDir.highlight('Design', [[0, 2], [1, 4]]);
        expect(html).toContain('<mark>Desig</mark>');
    });

    it('search() returns scored results sorted best-first', () => {
        const results = fuzzyDir.search(countries, 'france');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].option.value).toBe('fr');
        expect(results[0].score).toBeLessThanOrEqual(results[results.length - 1].score);
    });
});

// ── BlocAutocompleteHighlightComponent ────────────────────────────────────────
describe('BlocAutocompleteHighlightComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocAutocompleteHighlightComponent],
        }).compileComponents();
    });

    afterEach(() => {
        document.body.querySelectorAll('.bloc-overlay-container').forEach((n) => n.remove());
    });

    it('should create', () => {
        const f = TestBed.createComponent(BlocAutocompleteHighlightComponent);
        f.detectChanges();
        expect(f.componentInstance).toBeTruthy();
    });

    it('renders a bloc-autocomplete inside', () => {
        const f = TestBed.createComponent(BlocAutocompleteHighlightComponent);
        f.detectChanges();
        expect((f.nativeElement as HTMLElement).querySelector('bloc-autocomplete')).not.toBeNull();
    });

    it('passes options to the inner autocomplete', () => {
        const f = TestBed.createComponent(BlocAutocompleteHighlightComponent);
        f.componentRef.setInput('options', teamOptions);
        f.detectChanges();
        const inner = f.debugElement.query(By.directive(BlocAutocompleteComponent));
        expect((inner.componentInstance as BlocAutocompleteComponent<string>).options()).toEqual(
            teamOptions,
        );
    });

    it('proxies selectionChange output', () => {
        const f = TestBed.createComponent(BlocAutocompleteHighlightComponent);
        f.componentRef.setInput('options', teamOptions);
        f.detectChanges();

        const spy = vi.fn();
        f.componentInstance.selectionChange.subscribe(spy);

        const inner = f.debugElement
            .query(By.directive(BlocAutocompleteComponent))
            .componentInstance as BlocAutocompleteComponent<string>;
        inner.selectOption(teamOptions[0]);

        expect(spy).toHaveBeenCalledWith('design');
    });
});

// ── BlocAutocompleteComponent form integration ────────────────────────────────
describe('BlocAutocompleteComponent form integration', () => {
    @Component({
        standalone: true,
        imports: [ReactiveFormsModule, BlocAutocompleteComponent],
        template: `
            <section class="required">
                <bloc-autocomplete [options]="options" [formControl]="requiredControl" />
            </section>
            <section class="disabled">
                <bloc-autocomplete
                    [options]="options"
                    [formControl]="disabledControl"
                    [clearable]="true"
                />
            </section>
        `,
    })
    class ReactiveHostComponent {
        readonly options = teamOptions;
        readonly requiredControl = new FormControl<string | null>(null, {
            validators: [Validators.required],
        });
        readonly disabledControl = new FormControl<string | null>({
            value: 'design',
            disabled: true,
        });
    }

    it('should reflect the disabled FormControl state on the input', () => {
        const fixture = TestBed.createComponent(ReactiveHostComponent);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        const disabledInput = host.querySelector(
            '.disabled .bloc-autocomplete__input',
        ) as HTMLInputElement;

        expect(disabledInput.disabled).toBe(true);
        expect(host.querySelector('.disabled .bloc-autocomplete__clear')).toBeNull();
    });

    it('should set the error class when the bound FormControl is touched and invalid', () => {
        const fixture = TestBed.createComponent(ReactiveHostComponent);
        fixture.detectChanges();

        const hostComponent = fixture.componentInstance;
        hostComponent.requiredControl.markAsTouched();
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        const autocomplete = host.querySelector('.required bloc-autocomplete') as HTMLElement;
        const input = host.querySelector('.required .bloc-autocomplete__input') as HTMLInputElement;

        expect(autocomplete.classList.contains('is-error')).toBe(true);
        expect(input.getAttribute('aria-invalid')).toBe('true');
    });
});
