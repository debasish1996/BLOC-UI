import { DOCUMENT } from '@angular/common';
import { NgTemplateOutlet } from '@angular/common';
import {
    Component,
    DestroyRef,
    ElementRef,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    contentChild,
    contentChildren,
    effect,
    forwardRef,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { computePosition, OverlayPosition, OverlayService } from '@bloc-ui/overlay';

import { BlocOptionDirective } from './option.directive';
import { BlocSelectEmptyDirective, BlocSelectIconDirective, BlocSelectLoadingDirective } from './select-templates.directive';
import { BLOC_SELECT, BlocSelectRef } from './select.token';

let nextPanelId = 0;

type OpenFocusMode = 'selected' | 'first' | 'last';
const OVERLAY_STYLE_VARS = [
    '--bloc-select-bg',
    '--bloc-select-border',
    '--bloc-select-border-hover',
    '--bloc-select-muted',
    '--bloc-select-text',
    '--bloc-select-panel-shadow',
    '--bloc-select-option-hover',
    '--bloc-select-option-active',
    '--bloc-select-option-selected',
    '--bloc-select-radius',
    '--bloc-select-panel-radius',
] as const;

@Component({
    selector: 'bloc-select',
    standalone: true,
    imports: [NgTemplateOutlet],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BlocSelectComponent),
            multi: true,
        },
        {
            provide: BLOC_SELECT,
            useExisting: forwardRef(() => BlocSelectComponent),
        },
    ],
    host: {
        '[class.bloc-select]': 'true',
        '[class.bloc-select--open]': 'isOpen()',
        '[class.bloc-select--disabled]': 'isDisabled()',
        role: 'combobox',
        '[attr.aria-expanded]': 'isOpen().toString()',
        '[attr.aria-disabled]': 'isDisabled() || null',
        '[attr.aria-haspopup]': '"listbox"',
        '[attr.aria-controls]': 'panelId',
        '[attr.aria-activedescendant]': 'isOpen() ? activeOptionId() : null',
        '[attr.tabindex]': 'isDisabled() ? -1 : 0',
        '(click)': 'onHostClick()',
        '(keydown)': 'onHostKeydown($event)',
    },
})
export class BlocSelectComponent implements ControlValueAccessor, BlocSelectRef {
    readonly placeholder = input('Select an option');
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly searchable = input(false, { transform: booleanAttribute });
    readonly clearable = input(false, { transform: booleanAttribute });
    readonly loading = input(false, { transform: booleanAttribute });
    readonly position = input<OverlayPosition>('bottom-start');
    readonly compareWith = input<(left: unknown, right: unknown) => boolean>(Object.is);

    readonly loadingTpl = contentChild(BlocSelectLoadingDirective);
    readonly emptyTpl = contentChild(BlocSelectEmptyDirective);
    readonly iconTpl = contentChild(BlocSelectIconDirective);

    readonly panelId = `bloc-select-panel-${++nextPanelId}`;
    readonly isOpen = signal(false);
    readonly filterQuery = signal('');
    readonly selectedValue = signal<unknown>(null);
    readonly selectedOption = signal<BlocOptionDirective | null>(null);
    readonly activeOptionId = signal<string | null>(null);

    readonly displayLabel = computed(() => {
        const label = this.selectedOption()?.textLabel();
        return label && label.length > 0 ? label : this.placeholder();
    });

    readonly isDisabled = computed(() => this.disabled() || this._formDisabled());
    readonly options = contentChildren(BlocOptionDirective, { descendants: true });
    readonly visibleOptions = computed(() =>
        this.options().filter((option) => option.matchesFilter(this.filterQuery())),
    );
    readonly enabledVisibleOptions = computed(() =>
        this.visibleOptions().filter((option) => !option.isDisabled()),
    );
    readonly hasVisibleOptions = computed(() => this.visibleOptions().length > 0);

    private readonly _host = inject(ElementRef<HTMLElement>);
    private readonly _overlay = inject(OverlayService);
    private readonly _doc = inject(DOCUMENT);
    private readonly _destroyRef = inject(DestroyRef);

    private readonly _panelHost = viewChild.required<ElementRef<HTMLElement>>('panelHost');
    private readonly _panelContent = viewChild.required<ElementRef<HTMLElement>>('panelContent');
    private readonly _searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

    private readonly _formDisabled = signal(false);
    private _overlayPanel: HTMLElement | null = null;
    private _cleanup: Array<() => void> = [];
    private _onChange: (value: unknown) => void = () => {};
    private _onTouched: () => void = () => {};

    constructor() {
        effect(() => {
            const options = this.options();
            const value = this.selectedValue();
            const compareWith = this.compareWith();
            const selected = options.find((option) => compareWith(option.value(), value)) ?? null;

            this.selectedOption.set(selected);
        });

        effect(() => {
            if (!this.isOpen()) return;

            const activeId = this.activeOptionId();
            const options = this.enabledVisibleOptions();
            if (options.length === 0) {
                if (activeId !== null) {
                    this.activeOptionId.set(null);
                }
                queueMicrotask(() => this._repositionOverlay());
                return;
            }

            if (activeId && options.some((option) => option.optionId === activeId)) {
                queueMicrotask(() => {
                    this._repositionOverlay();
                    this._scrollActiveIntoView();
                });
                return;
            }

            const selected = this.selectedOption();
            const fallback = selected && options.includes(selected) ? selected : options[0];

            this.activeOptionId.set(fallback.optionId);

            queueMicrotask(() => {
                this._repositionOverlay();
                fallback.focusIntoView();
            });
        });

        effect(() => {
            if (this.isDisabled() && this.isOpen()) {
                this.close(false);
            }
        });

        this._destroyRef.onDestroy(() => this.close(false));
    }

    writeValue(value: unknown): void {
        this.selectedValue.set(value);
    }

    registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._formDisabled.set(isDisabled);
    }

    onHostClick(): void {
        if (this.isDisabled()) return;
        this.isOpen() ? this.close() : this.open('selected');
    }

    onHostKeydown(event: KeyboardEvent): void {
        if (this.isDisabled()) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this._moveActiveOption(1, this.isOpen() ? null : 'first');
                break;
            case 'ArrowUp':
                event.preventDefault();
                this._moveActiveOption(-1, this.isOpen() ? null : 'last');
                break;
            case 'Enter':
                event.preventDefault();
                if (!this.isOpen()) {
                    this.open('selected');
                    return;
                }
                this._selectActiveOption();
                break;
            case 'Escape':
                if (!this.isOpen()) return;
                event.preventDefault();
                this.close();
                break;
            case ' ':
                if (this.isOpen()) return;
                event.preventDefault();
                this.open('selected');
                break;
        }
    }

    onSearchInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.filterQuery.set(target.value);
    }

    onSearchKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this._moveActiveOption(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this._moveActiveOption(-1);
                break;
            case 'Enter':
                event.preventDefault();
                this._selectActiveOption();
                break;
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
        }
    }

    open(mode: OpenFocusMode = 'selected'): void {
        if (this.isDisabled() || this.isOpen()) return;

        const panelHost = this._panelHost().nativeElement;
        const panelContent = this._panelContent().nativeElement;
        const hostRect = this._host.nativeElement.getBoundingClientRect();

        this._overlayPanel = this._overlay.createPanel();
        this._overlayPanel.style.minWidth = `${Math.round(hostRect.width)}px`;
        this._syncOverlayStyles();
        this._overlayPanel.appendChild(panelContent);

        this.isOpen.set(true);
        this._setInitialActiveOption(mode);
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
            this.close(false);
        };

        const timer = setTimeout(() => {
            this._doc.addEventListener('click', onDocumentClick);
        });

        this._cleanup.push(() => {
            clearTimeout(timer);
            this._doc.removeEventListener('click', onDocumentClick);
        });

        queueMicrotask(() => {
            this._repositionOverlay();
            this._scrollActiveIntoView();
            if (this.searchable()) {
                this._searchInput()?.nativeElement.focus();
            }
        });

        panelHost.removeAttribute('aria-hidden');
    }

    close(restoreFocus = true): void {
        if (!this.isOpen()) return;

        const panelHost = this._panelHost().nativeElement;
        const panelContent = this._panelContent().nativeElement;

        this._cleanup.forEach((fn) => fn());
        this._cleanup = [];

        panelHost.appendChild(panelContent);
        this._overlayPanel?.remove();
        this._overlayPanel = null;

        this.isOpen.set(false);
        this.filterQuery.set('');
        this.activeOptionId.set(null);
        this._onTouched();

        if (restoreFocus) {
            this._host.nativeElement.focus({ preventScroll: true });
        }

        panelHost.setAttribute('aria-hidden', 'true');
    }

    clearSelection(event?: Event): void {
        event?.stopPropagation();
        if (this.isDisabled()) return;

        this.selectedValue.set(null);
        this.selectedOption.set(null);
        this._onChange(null);
        this._onTouched();
        this.filterQuery.set('');
    }

    isOptionSelected(option: BlocOptionDirective): boolean {
        return this.selectedOption()?.optionId === option.optionId;
    }

    isOptionActive(option: BlocOptionDirective): boolean {
        return this.activeOptionId() === option.optionId;
    }

    isOptionHidden(option: BlocOptionDirective): boolean {
        return !option.matchesFilter(this.filterQuery());
    }

    isSelectDisabled(): boolean {
        return this.isDisabled();
    }

    setActiveOption(option: BlocOptionDirective): void {
        if (option.isDisabled() || option.isHidden()) return;
        this.activeOptionId.set(option.optionId);
    }

    selectOption(option: BlocOptionDirective): void {
        if (option.isDisabled() || option.isHidden()) return;

        this.selectedValue.set(option.value());
        this.selectedOption.set(option);
        this._onChange(option.value());
        this.close();
    }

    private _selectActiveOption(): void {
        const active = this.enabledVisibleOptions().find(
            (option) => option.optionId === this.activeOptionId(),
        );
        if (active) {
            this.selectOption(active);
        }
    }

    private _moveActiveOption(direction: 1 | -1, openMode: OpenFocusMode | null = null): void {
        if (!this.isOpen()) {
            this.open(openMode ?? 'selected');
            return;
        }

        const options = this.enabledVisibleOptions();
        if (options.length === 0) return;

        const currentIndex = options.findIndex(
            (option) => option.optionId === this.activeOptionId(),
        );
        const nextIndex =
            currentIndex === -1
                ? direction === 1
                    ? 0
                    : options.length - 1
                : (currentIndex + direction + options.length) % options.length;

        const next = options[nextIndex];
        this.activeOptionId.set(next.optionId);
        queueMicrotask(() => next.focusIntoView());
    }

    private _setInitialActiveOption(mode: OpenFocusMode): void {
        const options = this.enabledVisibleOptions();
        if (options.length === 0) {
            this.activeOptionId.set(null);
            return;
        }

        const selected = this.selectedOption();
        const resolved =
            mode === 'selected' && selected && options.includes(selected)
                ? selected
                : mode === 'last'
                  ? options[options.length - 1]
                  : options[0];

        this.activeOptionId.set(resolved.optionId);
    }

    private _scrollActiveIntoView(): void {
        const active = this.enabledVisibleOptions().find(
            (option) => option.optionId === this.activeOptionId(),
        );
        active?.focusIntoView();
    }

    private _repositionOverlay(): void {
        if (!this._overlayPanel) return;

        const rect = this._host.nativeElement.getBoundingClientRect();
        const { top, left } = computePosition(
            rect,
            {
                width: this._overlayPanel.offsetWidth,
                height: this._overlayPanel.offsetHeight,
            },
            this.position(),
            8,
            true,
        );

        this._overlayPanel.style.top = `${top}px`;
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
}
