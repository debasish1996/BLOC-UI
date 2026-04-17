import {
    Directive,
    ElementRef,
    booleanAttribute,
    computed,
    inject,
    input,
} from '@angular/core';

import { BLOC_SELECT } from './select.token';

let nextOptionId = 0;

@Directive({
    selector: 'bloc-option,[blocOption],[bloc-option]',
    standalone: true,
    host: {
        role: 'option',
        '[attr.id]': 'optionId',
        '[attr.tabindex]': '-1',
        '[attr.aria-selected]': 'isSelected().toString()',
        '[attr.aria-disabled]': 'isDisabled() || null',
        '[attr.hidden]': 'isHidden() ? "" : null',
        '[class.bloc-select-option]': 'true',
        '[class.bloc-select-option--active]': 'isActive()',
        '[class.bloc-select-option--selected]': 'isSelected()',
        '[class.bloc-select-option--disabled]': 'isDisabled()',
        '[class.bloc-select-option--hidden]': 'isHidden()',
        '(click)': '_onClick()',
        '(mouseenter)': '_onMouseEnter()',
    },
})
export class BlocOptionDirective {
    readonly value = input<unknown>(null);
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly filterText = input<string | null>(null);

    readonly optionId = `bloc-select-option-${++nextOptionId}`;

    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _select = inject(BLOC_SELECT);

    readonly isDisabled = computed(() => this.disabled() || this._select.isSelectDisabled());

    isSelected(): boolean {
        return this._select.isOptionSelected(this);
    }

    isActive(): boolean {
        return this._select.isOptionActive(this);
    }

    isHidden(): boolean {
        return this._select.isOptionHidden(this);
    }

    textLabel(): string {
        return this._labelText();
    }

    matchesFilter(query: string): boolean {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return true;

        return this._labelText().toLowerCase().includes(normalized);
    }

    focusIntoView(): void {
        this._el.nativeElement.scrollIntoView?.({ block: 'nearest' });
    }

    _onClick(): void {
        if (this.isDisabled() || this.isHidden()) return;
        this._select.selectOption(this);
    }

    _onMouseEnter(): void {
        if (this.isDisabled() || this.isHidden()) return;
        this._select.setActiveOption(this);
    }

    private _labelText(): string {
        return (this.filterText() ?? this._el.nativeElement.textContent ?? '').trim();
    }
}
