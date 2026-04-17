import { Component, TemplateRef, ViewEncapsulation, inject, input, output } from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { BlocSpinnerDirective } from '@bloc-ui/core/spinner';

const LAYER_ORDER = '@layer theme, base, bloc-button, components, utilities;';

function ensureLayerOrder(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-button-layers')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-button-layers';
    style.textContent = LAYER_ORDER;
    doc.head.insertBefore(style, doc.head.firstChild);
}

@Component({
    selector: 'button[blocButton]',
    standalone: true,
    imports: [BlocSpinnerDirective, NgTemplateOutlet],
    template: `
        @if (loading()) {
            @if (loadingTemplate()) {
                <ng-container [ngTemplateOutlet]="loadingTemplate()!" />
            } @else {
                <span blocSpinner size="sm"></span>
            }
        }
        <ng-content />
    `,
    styleUrl: './button.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]':
            '"bloc-button bloc-button--" + variant() + (loading() ? " bloc-button--loading" : "")',
        '[disabled]': 'disabled() || loading()',
        '[attr.aria-busy]': 'loading() || null',
        '(click)': 'handleClick($event)',
    },
})
export class BlocButtonComponent {
    /** Button variant style. */
    readonly variant = input<'primary' | 'secondary' | 'outline'>('primary');

    /** Whether the button is disabled. */
    readonly disabled = input<boolean>(false);

    /** Shows a spinner and prevents interaction while true. */
    readonly loading = input<boolean>(false);

    /** Custom loading icon template. When provided, replaces the default spinner. */
    readonly loadingTemplate = input<TemplateRef<unknown> | null>(null);

    /** Emits when the button is clicked. */
    readonly clicked = output<MouseEvent>();

    constructor() {
        ensureLayerOrder(inject(DOCUMENT));
    }

    handleClick(event: MouseEvent): void {
        if (!this.disabled() && !this.loading()) {
            this.clicked.emit(event);
        }
    }
}
