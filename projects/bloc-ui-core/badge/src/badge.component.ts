import { Component, ViewEncapsulation, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

const LAYER_ORDER = '@layer theme, base, bloc-badge, components, utilities;';

function ensureLayerOrder(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-badge-layers')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-badge-layers';
    style.textContent = LAYER_ORDER;
    doc.head.insertBefore(style, doc.head.firstChild);
}

@Component({
    selector: 'bloc-badge',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './badge.component.scss',
    encapsulation: ViewEncapsulation.None,
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

    constructor() {
        ensureLayerOrder(inject(DOCUMENT));
    }
}
