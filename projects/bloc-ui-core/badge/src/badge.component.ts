import { Component, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'bloc-badge',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './badge.component.scss',
    host: {
        '[class]':
            '"bloc-badge bloc-badge--" + variant() + " bloc-badge--" + size() + (pill() ? " bloc-badge--pill" : "")',
    },
})
export class BlocBadgeComponent {
    /** Visual badge variant. */
    readonly variant = input<BadgeVariant>('neutral');

    /** Preset badge size. */
    readonly size = input<BadgeSize>('md');

    /** Applies a full pill radius. */
    readonly pill = input<boolean>(false);
}
