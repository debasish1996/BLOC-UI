import { Component, ViewEncapsulation, computed, ElementRef, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BLOC_RADIO_GROUP } from './radio.token';

const LAYER_ORDER = '@layer theme, base, bloc-radio, components, utilities;';

function ensureLayerOrder(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-radio-layers')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-radio-layers';
    style.textContent = LAYER_ORDER;
    doc.head.insertBefore(style, doc.head.firstChild);
}

/**
 * Individual radio option. Must be placed inside a `<bloc-radio-group>`.
 *
 * ```html
 * <bloc-radio value="yes">Yes</bloc-radio>
 * ```
 *
 * - Clicking or pressing **Space** selects the option.
 * - **Arrow keys** navigate to adjacent options within the group.
 * - Label position is inherited from the group but can be overridden per item.
 */
@Component({
    selector: 'bloc-radio',
    standalone: true,
    template: `
        <span class="bloc-radio__dot"></span>
        <ng-content />
    `,
    styleUrl: './radio.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        role: 'radio',
        '[attr.aria-checked]': 'isChecked().toString()',
        '[attr.aria-disabled]': 'isDisabled() || null',
        '[attr.tabindex]': 'isDisabled() ? -1 : 0',
        '[class.bloc-radio--sm]': 'size() === "sm"',
        '[class.bloc-radio--lg]': 'size() === "lg"',
        '[class.bloc-radio--checked]': 'isChecked()',
        '[class.bloc-radio--disabled]': 'isDisabled()',
        '[class.bloc-radio--label-before]': '_effectiveLabelPosition() === "before"',
        '(click)': '_onClick()',
        '(keydown.space)': '_onKeydown($event)',
        '(keydown.arrowdown)': '_navigate(1, $event)',
        '(keydown.arrowright)': '_navigate(1, $event)',
        '(keydown.arrowup)': '_navigate(-1, $event)',
        '(keydown.arrowleft)': '_navigate(-1, $event)',
        '(blur)': '_group.markTouched()',
    },
})
export class BlocRadioComponent {
    /** The value this radio represents. Required. */
    readonly value = input.required<unknown>();

    /** Disables this individual radio regardless of the group state. */
    readonly disabled = input<boolean>(false);

    /** Visual size. Defaults to `'md'`. */
    readonly size = input<'sm' | 'md' | 'lg'>('md');

    /**
     * Label position for this radio. When `null` (default) the group's
     * `labelPosition` is used.
     */
    readonly labelPosition = input<'before' | 'after' | null>(null);

    protected readonly _group = inject(BLOC_RADIO_GROUP);
    private readonly _el = inject(ElementRef<HTMLElement>);

    readonly isChecked = computed(() => this._group.value() === this.value());
    readonly isDisabled = computed(() => this.disabled() || this._group.isGroupDisabled());

    /** @internal Resolved label position (own override → group default). */
    readonly _effectiveLabelPosition = computed(
        () => this.labelPosition() ?? this._group.labelPosition(),
    );

    constructor() {
        ensureLayerOrder(inject(DOCUMENT));
    }

    _onClick(): void {
        if (this.isDisabled() || this.isChecked()) return;
        this._group.select(this.value());
    }

    _onKeydown(event: Event): void {
        event.preventDefault();
        this._onClick();
    }

    /**
     * Roving focus: moves to the next/previous enabled radio within the group
     * and selects it (standard radio-button keyboard behaviour per WAI-ARIA).
     */
    _navigate(dir: 1 | -1, event: Event): void {
        event.preventDefault();
        const host = this._el.nativeElement;
        const group = host.closest('[role="radiogroup"]');
        if (!group) return;

        const radios = Array.from(
            group.querySelectorAll('bloc-radio:not(.bloc-radio--disabled)'),
        ) as HTMLElement[];
        const idx = radios.indexOf(host);
        if (idx === -1) return;

        const next = radios[(idx + dir + radios.length) % radios.length];
        next?.focus();
        next?.click(); // triggers _onClick() on the target item
    }
}
