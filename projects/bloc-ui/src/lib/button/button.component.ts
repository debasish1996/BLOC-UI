import { Component, input, output } from '@angular/core';

@Component({
  selector: 'button[blocButton]',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  styleUrl: './button.component.scss',
  host: {
    '[class]': '"bloc-button bloc-button--" + variant()',
    '[disabled]': 'disabled()',
    '(click)': 'handleClick($event)',
  },
})
export class BlocButtonComponent {
  /** Button variant style. */
  readonly variant = input<'primary' | 'secondary' | 'outline'>('primary');

  /** Whether the button is disabled. */
  readonly disabled = input<boolean>(false);

  /** Emits when the button is clicked. */
  readonly clicked = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}
