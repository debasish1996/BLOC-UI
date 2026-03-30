import { Component, computed, input, output, signal } from '@angular/core';

export type BlocAlertVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_BADGES: Record<BlocAlertVariant, string> = {
    info: 'I',
    success: 'S',
    warning: '!',
    danger: 'X',
};

@Component({
    selector: 'bloc-alert',
    standalone: true,
    template: `
        @if (visible()) {
            <div class="bloc-alert__icon" [attr.aria-label]="variantLabel()">
                {{ badge() }}
            </div>
            <div class="bloc-alert__body">
                @if (title()) {
                    <p class="bloc-alert__title">{{ title() }}</p>
                }
                <div class="bloc-alert__content">
                    <ng-content />
                </div>
            </div>
            @if (dismissible()) {
                <button
                    class="bloc-alert__close"
                    type="button"
                    [attr.aria-label]="closeLabel()"
                    (click)="close()"
                >
                    ×
                </button>
            }
        }
    `,
    styleUrl: './alert.component.scss',
    host: {
        '[class.bloc-alert]': 'visible()',
        '[class.bloc-alert--info]': "variant() === 'info'",
        '[class.bloc-alert--success]': "variant() === 'success'",
        '[class.bloc-alert--warning]': "variant() === 'warning'",
        '[class.bloc-alert--danger]': "variant() === 'danger'",
        '[attr.role]': "'alert'",
    },
})
export class BlocAlertComponent {
    readonly variant = input<BlocAlertVariant>('info');
    readonly title = input('');
    readonly dismissible = input(false);
    readonly closeLabel = input('Dismiss alert');
    readonly dismissed = output<void>();
    readonly visible = signal(true);

    readonly badge = computed(() => VARIANT_BADGES[this.variant()]);
    readonly variantLabel = computed(() => `${this.variant()} alert`);

    close(): void {
        if (!this.dismissible()) return;
        this.visible.set(false);
        this.dismissed.emit();
    }
}
