import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface BlocAutocompleteOption<T = string> {
    label: string;
    value: T;
    description?: string;
    disabled?: boolean;
}

let nextAutocompleteId = 0;

@Component({
    selector: 'bloc-autocomplete',
    standalone: true,
    template: `
        <div class="bloc-autocomplete__field">
            <input
                class="bloc-autocomplete__input"
                type="text"
                role="combobox"
                autocomplete="off"
                [placeholder]="placeholder()"
                [disabled]="isDisabled()"
                [value]="query()"
                [attr.aria-expanded]="isOpen()"
                [attr.aria-controls]="panelId"
                [attr.aria-activedescendant]="activeDescendant()"
                (focus)="openPanel()"
                (input)="onInput($event)"
                (keydown)="onKeydown($event)"
                (blur)="handleBlur()"
            />
            @if (clearable() && selectedOption()) {
                <button
                    class="bloc-autocomplete__clear"
                    type="button"
                    aria-label="Clear selection"
                    (mousedown)="$event.preventDefault()"
                    (click)="clear()"
                >
                    ×
                </button>
            }
        </div>

        @if (isOpen()) {
            <div class="bloc-autocomplete__panel" [attr.id]="panelId" role="listbox">
                @if (loading()) {
                    <div class="bloc-autocomplete__state">{{ loadingText() }}</div>
                } @else if (!filteredOptions().length) {
                    <div class="bloc-autocomplete__state">{{ emptyText() }}</div>
                } @else {
                    @for (option of filteredOptions(); track $index; let index = $index) {
                        <button
                            class="bloc-autocomplete__option"
                            type="button"
                            role="option"
                            [attr.id]="optionId(index)"
                            [disabled]="option.disabled"
                            [class.is-active]="index === activeIndex()"
                            [class.is-selected]="selectedOption()?.value === option.value"
                            [attr.aria-selected]="selectedOption()?.value === option.value"
                            (mousedown)="$event.preventDefault()"
                            (click)="selectOption(option)"
                        >
                            <span>{{ option.label }}</span>
                            @if (option.description) {
                                <small>{{ option.description }}</small>
                            }
                        </button>
                    }
                }
            </div>
        }
    `,
    styleUrl: './autocomplete.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BlocAutocompleteComponent),
            multi: true,
        },
    ],
})
export class BlocAutocompleteComponent<T = string> implements ControlValueAccessor {
    readonly options = input<readonly BlocAutocompleteOption<T>[]>([]);
    readonly placeholder = input('Search options');
    readonly emptyText = input('No results found');
    readonly loadingText = input('Loading options...');
    readonly clearable = input(false);
    readonly loading = input(false);
    readonly disabled = input(false);
    readonly selectionChange = output<T | null>();

    readonly selectedOption = signal<BlocAutocompleteOption<T> | null>(null);
    readonly query = signal('');
    readonly isOpen = signal(false);
    readonly activeIndex = signal(-1);
    readonly panelId = `bloc-autocomplete-panel-${nextAutocompleteId++}`;

    readonly isDisabled = computed(() => this.disabled() || this._formsDisabled());
    readonly filteredOptions = computed(() => {
        const term = this.query().trim().toLowerCase();
        if (!term) {
            return this.options();
        }

        return this.options().filter((option) => {
            const haystack = `${option.label} ${option.description ?? ''}`.toLowerCase();
            return haystack.includes(term);
        });
    });
    readonly activeDescendant = computed(() =>
        this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null,
    );

    private readonly _formsDisabled = signal(false);
    private onChange: (value: T | null) => void = () => undefined;
    private onTouched: () => void = () => undefined;

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
    }

    openPanel(): void {
        if (this.isDisabled()) return;
        this.isOpen.set(true);
        this.activeIndex.set(this._findNextEnabledIndex(0));
    }

    handleBlur(): void {
        setTimeout(() => {
            this.closePanel(true);
            this.onTouched();
        }, 120);
    }

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.query.set(value);
        this.isOpen.set(true);
        this.activeIndex.set(this._findNextEnabledIndex(0));
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
            this.closePanel(true);
        }
    }

    selectOption(option: BlocAutocompleteOption<T>): void {
        if (option.disabled) return;

        this.selectedOption.set(option);
        this.query.set(option.label);
        this.isOpen.set(false);
        this.activeIndex.set(-1);
        this.onChange(option.value);
        this.selectionChange.emit(option.value);
    }

    clear(): void {
        this.selectedOption.set(null);
        this.query.set('');
        this.isOpen.set(false);
        this.activeIndex.set(-1);
        this.onChange(null);
        this.selectionChange.emit(null);
    }

    optionId(index: number): string {
        return `${this.panelId}-option-${index}`;
    }

    private closePanel(restoreSelectedLabel: boolean): void {
        this.isOpen.set(false);
        this.activeIndex.set(-1);
        if (restoreSelectedLabel) {
            this.query.set(this.selectedOption()?.label ?? '');
        }
    }

    private _findNextEnabledIndex(startIndex: number): number {
        const options = this.filteredOptions();
        for (let index = Math.max(0, startIndex); index < options.length; index += 1) {
            if (!options[index].disabled) {
                return index;
            }
        }
        return -1;
    }

    private _findPreviousEnabledIndex(startIndex: number): number {
        const options = this.filteredOptions();
        for (let index = Math.min(startIndex, options.length - 1); index >= 0; index -= 1) {
            if (!options[index].disabled) {
                return index;
            }
        }
        return this._findNextEnabledIndex(0);
    }
}
