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
        @if (isShown()) {
            <div class="bloc-alert__icon" aria-hidden="true">
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
        '[class.bloc-alert]': 'isShown()',
        '[class.bloc-alert--info]': "variant() === 'info'",
        '[class.bloc-alert--success]': "variant() === 'success'",
        '[class.bloc-alert--warning]': "variant() === 'warning'",
        '[class.bloc-alert--danger]': "variant() === 'danger'",
        '[attr.role]': 'role()',
        '[attr.aria-label]': 'variant()',
    },
})
export class BlocAlertComponent {
    readonly variant = input<BlocAlertVariant>('info');
    readonly title = input('');
    readonly dismissible = input(false);
    readonly closeLabel = input('Dismiss alert');
    readonly live = input<'assertive' | 'polite' | undefined>();
    readonly visible = input<boolean>(true);
    readonly dismissed = output<void>();

    readonly _selfVisible = signal(true);

    readonly badge = computed(() => VARIANT_BADGES[this.variant()]);
    readonly variantLabel = computed(() => `${this.variant()} alert`);
    readonly isShown = computed(() => this.visible() && this._selfVisible());
    readonly role = computed(() => {
        const live = this.live();
        if (live === 'assertive') return 'alert';
        if (live === 'polite') return 'status';
        const variant = this.variant();
        return variant === 'warning' || variant === 'danger' ? 'alert' : 'status';
    });

    close(): void {
        if (!this.dismissible()) return;
        this._selfVisible.set(false);
        this.dismissed.emit();
    }
}
