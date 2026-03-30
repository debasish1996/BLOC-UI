import { Component, computed, input } from '@angular/core';

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

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
    host: {
        '[class]': '"bloc-progress bloc-progress--" + variant() + " bloc-progress--" + size()',
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

    /** Visual variant for the filled portion. */
    readonly variant = input<ProgressVariant>('primary');

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
}
