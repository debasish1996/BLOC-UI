import { Component, input, output } from '@angular/core';
import { BlocToastInstance } from './toast.config';

/**
 * Individual toast notification.
 *
 * Rendered by `BlocToastContainerComponent`; not typically used directly.
 */
@Component({
    selector: 'bloc-toast',
    standalone: true,
    template: `
    <div class="bloc-toast__icon" [class]="'bloc-toast__icon--' + toast().type">
      @switch (toast().type) {
        @case ('success') { <span>&#10003;</span> }
        @case ('error') { <span>&#10007;</span> }
        @case ('warning') { <span>&#9888;</span> }
        @default { <span>&#8505;</span> }
      }
    </div>
    <div class="bloc-toast__body">
      @if (toast().title) {
        <div class="bloc-toast__title">{{ toast().title }}</div>
      }
      <div class="bloc-toast__message">{{ toast().message }}</div>
    </div>
    @if (toast().dismissible) {
      <button
        class="bloc-toast__close"
        type="button"
        aria-label="Dismiss"
        (click)="dismissed.emit()">
        &#10005;
      </button>
    }
  `,
    styleUrl: './toast.component.scss',
    host: {
        role: 'alert',
        '[attr.aria-live]': '"polite"',
        '[class.bloc-toast]': 'true',
        '[class.bloc-toast--info]': 'toast().type === "info"',
        '[class.bloc-toast--success]': 'toast().type === "success"',
        '[class.bloc-toast--warning]': 'toast().type === "warning"',
        '[class.bloc-toast--error]': 'toast().type === "error"',
    },
})
export class BlocToastComponent {
    readonly toast = input.required<BlocToastInstance>();
    readonly dismissed = output<void>();
}
