import { Component, input, output } from '@angular/core';
import { BlocSpinnerDirective } from '@bloc-ui/core/spinner';

@Component({
    selector: 'button[blocButton]',
    standalone: true,
    imports: [BlocSpinnerDirective],
    template: `
        @if (loading()) {
            <span blocSpinner size="sm"></span>
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

    /** Emits when the button is clicked. */
    readonly clicked = output<MouseEvent>();

    handleClick(event: MouseEvent): void {
        if (!this.disabled() && !this.loading()) {
            this.clicked.emit(event);
        }
    }
}
