import { Component, input, output } from '@angular/core';

@Component({
  selector: 'bloc-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class BlocButtonComponent {
  /** Button display label. */
  readonly label = input<string>('');

  /** Button variant style. */
  readonly variant = input<'primary' | 'secondary' | 'outline'>('primary');

  /** Whether the button is disabled. */
  readonly disabled = input<boolean>(false);

  /** Emits when the button is clicked. */
  readonly clicked = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}
