import { Component, TemplateRef, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BlocSpinnerDirective } from '@bloc-ui/core/spinner';

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

    handleClick(event: MouseEvent): void {
        if (!this.disabled() && !this.loading()) {
            this.clicked.emit(event);
        }
    }
}
