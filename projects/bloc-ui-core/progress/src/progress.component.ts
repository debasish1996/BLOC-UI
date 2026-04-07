import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ProgressSize = 'sm' | 'md' | 'lg';

const LAYER_ORDER = '@layer theme, base, bloc-progress, components, utilities;';

function ensureLayerOrder(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-progress-layers')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-progress-layers';
    style.textContent = LAYER_ORDER;
    doc.head.insertBefore(style, doc.head.firstChild);
}

@Component({
    selector: 'bloc-progress',
    standalone: true,
    template: `
        @if (label() || showValue()) {
            <div class="bloc-progress__meta">
                @if (label()) {
                    <span class="bloc-progress__label">{{ label() }}</span>
                }
                @if (showValue()) {
                    <span class="bloc-progress__value">{{ percentLabel() }}</span>
                }
            </div>
        }
        <div class="bloc-progress__track">
            <div class="bloc-progress__fill" [style.width.%]="percentage()"></div>
        </div>
    `,
    styleUrl: './progress.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': '"bloc-progress bloc-progress--" + size()',
        role: 'progressbar',
        '[attr.aria-valuemin]': '0',
        '[attr.aria-valuemax]': 'normalizedMax()',
        '[attr.aria-valuenow]': 'clampedValue()',
        '[attr.aria-valuetext]': 'percentLabel()',
    },
})
export class BlocProgressComponent {
    /** Current progress value. */
    readonly value = input<number>(0);

    /** Maximum progress value. */
    readonly max = input<number>(100);

    /** Preset track height. */
    readonly size = input<ProgressSize>('md');

    /** Optional label shown above the track. */
    readonly label = input<string | null>(null);

    /** Displays the computed percentage text above the track. */
    readonly showValue = input<boolean>(false);

    readonly normalizedMax = computed(() => {
        const max = this.max();
        return Number.isFinite(max) && max > 0 ? max : 100;
    });

    readonly clampedValue = computed(() => {
        const value = this.value();
        const safeValue = Number.isFinite(value) ? value : 0;
        return Math.min(Math.max(safeValue, 0), this.normalizedMax());
    });

    readonly percentage = computed(() => (this.clampedValue() / this.normalizedMax()) * 100);

    readonly percentLabel = computed(() => `${Math.round(this.percentage())}%`);

    constructor() {
        ensureLayerOrder(inject(DOCUMENT));
    }
}
