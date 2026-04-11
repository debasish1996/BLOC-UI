import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
    Component,
    DestroyRef,
    ElementRef,
    Injector,
    OnInit,
    ViewEncapsulation,
    computed,
    contentChild,
    forwardRef,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { BlocAutocompleteOptionDef } from './autocomplete-option-def.directive';
import { BlocAutocompleteFuzzySearch } from './autocomplete-fuzzy-search.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { computePosition, OverlayService } from '@bloc-ui/overlay';
export interface BlocAutocompleteOption<T = string> {
    label: string;
    value: T;
    description?: string;
    disabled?: boolean;
}

let nextAutocompleteId = 0;

const OVERLAY_STYLE_VARS = [
    '--bloc-autocomplete-bg',
    '--bloc-autocomplete-border',
    '--bloc-autocomplete-border-focus',
    '--bloc-autocomplete-color',
    '--bloc-autocomplete-muted',
    '--bloc-autocomplete-radius',
    '--bloc-autocomplete-panel-radius',
    '--bloc-autocomplete-panel-shadow',
    '--bloc-autocomplete-option-hover',
    '--bloc-autocomplete-option-active',
    '--bloc-autocomplete-option-selected',
] as const;

@Component({
    selector: 'bloc-autocomplete',
    standalone: true,
    imports: [NgTemplateOutlet],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.bloc-autocomplete--open]': 'isOpen()',
        '[class.is-error]': 'hasError()',
    },
    templateUrl: './autocomplete.component.html',
    styleUrl: './autocomplete.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BlocAutocompleteComponent),
            multi: true,
        },
    ],
})
export class BlocAutocompleteComponent<T = string> implements ControlValueAccessor, OnInit {
    // — inputs —
    readonly options = input<readonly BlocAutocompleteOption<T>[]>([]);
    readonly placeholder = input('Search options');
    readonly emptyText = input('No results found');
    readonly loadingText = input('Loading options...');
    readonly clearable = input(false);
    readonly loading = input(false);
    readonly disabled = input(false);
    readonly error = input(false);
    readonly filterFn = input<
        | ((
              options: readonly BlocAutocompleteOption<T>[],
              query: string,
          ) => BlocAutocompleteOption<T>[])
        | null
    >(null);
    readonly selectionChange = output<T | null>();

    // — content children —
    readonly optionDef = contentChild(BlocAutocompleteOptionDef);

    // — public state —
    readonly selectedOption = signal<BlocAutocompleteOption<T> | null>(null);
    readonly query = signal('');
    readonly isOpen = signal(false);
    readonly activeIndex = signal(-1);
    readonly panelId = `bloc-autocomplete-panel-${nextAutocompleteId++}`;

    // — computed —
    readonly isDisabled = computed(() => this.disabled() || this._formsDisabled());
    readonly filteredOptions = computed(() => {
        const term = this.query().trim();
        if (!term) return this.options();

        // Use custom filterFn if provided
        const customFilter = this.filterFn();
        if (customFilter) {
            return customFilter(this.options(), term);
        }

        // Use fuzzy search if directive is present
        if (this._fuzzySearch) {
            return this._fuzzySearch.filter(this.options(), term);
        }

        // Fall back to default substring matching
        return this.options().filter((option) => {
            const haystack = `${option.label} ${option.description ?? ''}`.toLowerCase();
            return haystack.includes(term.toLowerCase());
        });
    });
    readonly activeDescendant = computed(() =>
        this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null,
    );

    // — DI —
    private readonly _host = inject(ElementRef<HTMLElement>);
    private readonly _overlay = inject(OverlayService);
    private readonly _doc = inject(DOCUMENT);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _injector = inject(Injector);
    private readonly _fuzzySearch = inject(BlocAutocompleteFuzzySearch<T>, { optional: true });

    // — view references —
    private readonly _panelHost = viewChild.required<ElementRef<HTMLElement>>('panelHost');
    private readonly _panelContent = viewChild.required<ElementRef<HTMLElement>>('panelContent');

    // — internal state —
    private readonly _formsDisabled = signal(false);
    private _overlayPanel: HTMLElement | null = null;
    private _resolvedPlacement: 'top' | 'bottom' | null = null;
    private _cleanup: Array<() => void> = [];
    private _ngControl: NgControl | null = null;
    private onChange: (value: T | null) => void = () => undefined;
    private onTouched: () => void = () => undefined;

    constructor() {
        this._destroyRef.onDestroy(() => this._closePanel(false));
    }

    ngOnInit(): void {
        this._ngControl = this._injector.get(NgControl, null, { optional: true, self: true });
    }

    // ── ControlValueAccessor ────────────────────────────────────────────────

    writeValue(value: T | null): void {
        const selected = this.options().find((option) => Object.is(option.value, value)) ?? null;
        this.selectedOption.set(selected);
        this.query.set(selected?.label ?? '');
    }

    registerOnChange(fn: (value: T | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._formsDisabled.set(isDisabled);
        if (isDisabled) {
            this._closePanel(true);
        }
    }

    // ── Opening / closing ───────────────────────────────────────────────────

    openPanel(): void {
        if (this.isDisabled() || this.isOpen()) return;

        const panelContent = this._panelContent().nativeElement;
        const hostRect = this._host.nativeElement.getBoundingClientRect();

        this._overlayPanel = this._overlay.createPanel();
        this._overlayPanel.style.minWidth = `${Math.round(hostRect.width)}px`;
        this._syncOverlayStyles();
        this._overlayPanel.appendChild(panelContent);

        this.isOpen.set(true);
        this.activeIndex.set(this._findNextEnabledIndex(0));
        this._repositionOverlay();

        const reposition = () => this._repositionOverlay();
        this._doc.addEventListener('scroll', reposition, { passive: true, capture: true });
        window.addEventListener('resize', reposition, { passive: true });
        this._cleanup.push(() => {
            this._doc.removeEventListener('scroll', reposition, {
                capture: true,
            } as EventListenerOptions);
            window.removeEventListener('resize', reposition);
        });

        const onDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (this._overlayPanel?.contains(target) || this._host.nativeElement.contains(target)) {
                return;
            }
            this._closePanel(true);
        };

        const timer = setTimeout(() => {
            this._doc.addEventListener('click', onDocumentClick);
        });
        this._cleanup.push(() => {
            clearTimeout(timer);
            this._doc.removeEventListener('click', onDocumentClick);
        });

        queueMicrotask(() => this._repositionOverlay());
    }

    handleBlur(): void {
        setTimeout(() => {
            if (this.isOpen()) {
                this._closePanel(true);
            }
            this.onTouched();
        }, 120);
    }

    // ── Event handlers ──────────────────────────────────────────────────────

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.query.set(value);
        if (!this.isOpen()) {
            this.openPanel();
        } else {
            this.activeIndex.set(this._findNextEnabledIndex(0));
            queueMicrotask(() => this._repositionOverlay());
        }
    }

    onKeydown(event: KeyboardEvent): void {
        if (!this.isOpen() && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            this.openPanel();
            event.preventDefault();
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.activeIndex.set(this._findNextEnabledIndex(this.activeIndex() + 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.activeIndex.set(this._findPreviousEnabledIndex(this.activeIndex() - 1));
        } else if (event.key === 'Enter') {
            const option = this.filteredOptions()[this.activeIndex()];
            if (option && !option.disabled) {
                event.preventDefault();
                this.selectOption(option);
            }
        } else if (event.key === 'Escape') {
            this._closePanel(true);
        }
    }

    // ── Selection ───────────────────────────────────────────────────────────

    selectOption(option: BlocAutocompleteOption<T>): void {
        if (this.isDisabled() || option.disabled) return;

        this.selectedOption.set(option);
        this.query.set(option.label);
        this._closePanel(false);
        this.onChange(option.value);
        this.selectionChange.emit(option.value);
    }

    clear(): void {
        if (this.isDisabled()) return;
        this.selectedOption.set(null);
        this.query.set('');
        this._closePanel(false);
        this.onChange(null);
        this.selectionChange.emit(null);
    }

    optionId(index: number): string {
        return `${this.panelId}-option-${index}`;
    }

    hasError(): boolean {
        const control = this._ngControl?.control;
        return this.error() || !!(control && control.invalid && control.touched);
    }

    // ── Private helpers ─────────────────────────────────────────────────────

    private _closePanel(restoreSelectedLabel: boolean): void {
        if (!this.isOpen()) return;

        const panelHost = this._panelHost().nativeElement;
        const panelContent = this._panelContent().nativeElement;

        this._cleanup.forEach((fn) => fn());
        this._cleanup = [];

        panelHost.appendChild(panelContent);
        this._overlayPanel?.remove();
        this._overlayPanel = null;
        this._resolvedPlacement = null;

        this.isOpen.set(false);
        this.activeIndex.set(-1);

        if (restoreSelectedLabel) {
            this.query.set(this.selectedOption()?.label ?? '');
        }
    }

    private _repositionOverlay(): void {
        if (!this._overlayPanel) return;

        const rect = this._host.nativeElement.getBoundingClientRect();
        const overlaySize = {
            width: this._overlayPanel.offsetWidth,
            height: this._overlayPanel.offsetHeight,
        };

        // On the first call after opening, let computePosition auto-flip and
        // lock the resolved placement for the lifetime of this open session.
        // Subsequent repositions reuse the locked placement so the panel never
        // jumps between top/bottom while the user is typing.
        const autoFlip = this._resolvedPlacement === null;
        const preferred = this._resolvedPlacement
            ? (`${this._resolvedPlacement}-start` as const)
            : 'bottom-start';

        const { top, left, resolvedPlacement } = computePosition(
            rect,
            overlaySize,
            preferred,
            4,
            autoFlip,
        );

        if (autoFlip) {
            this._resolvedPlacement = resolvedPlacement as 'top' | 'bottom';
        }

        if (this._resolvedPlacement === 'top') {
            // Anchor by bottom edge so the panel stays connected to the input
            // even when the content shrinks (e.g. filtering narrows the list).
            const bottom = window.innerHeight - rect.top + 4;
            this._overlayPanel.style.top = 'auto';
            this._overlayPanel.style.bottom = `${bottom}px`;
        } else {
            this._overlayPanel.style.bottom = 'auto';
            this._overlayPanel.style.top = `${top}px`;
        }
        this._overlayPanel.style.left = `${left}px`;
    }

    private _syncOverlayStyles(): void {
        if (!this._overlayPanel) return;

        const styles = getComputedStyle(this._host.nativeElement);
        for (const variable of OVERLAY_STYLE_VARS) {
            const value = styles.getPropertyValue(variable).trim();
            if (value) {
                this._overlayPanel.style.setProperty(variable, value);
            }
        }
    }

    private _findNextEnabledIndex(startIndex: number): number {
        const options = this.filteredOptions();
        for (let index = Math.max(0, startIndex); index < options.length; index += 1) {
            if (!options[index].disabled) return index;
        }
        return -1;
    }

    private _findPreviousEnabledIndex(startIndex: number): number {
        const options = this.filteredOptions();
        for (let index = Math.min(startIndex, options.length - 1); index >= 0; index -= 1) {
            if (!options[index].disabled) return index;
        }
        return this._findNextEnabledIndex(0);
    }
}
