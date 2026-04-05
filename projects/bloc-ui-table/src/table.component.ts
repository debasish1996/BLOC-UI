import { Component, contentChildren, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BlocColumnComponent, BlocCellDefDirective } from './column.component';

/**
 * Lightweight data table component.
 *
 * ```html
 * <bloc-table [data]="users" [striped]="true">
 *   <bloc-column field="name" header="Name" />
 *   <bloc-column field="email" header="Email" />
 * </bloc-table>
 * ```
 */
@Component({
    selector: 'bloc-table',
    standalone: true,
    imports: [NgTemplateOutlet],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    host: {
        '[class.bloc-table]': 'true',
        '[class.bloc-table--striped]': 'striped()',
        '[class.bloc-table--bordered]': 'bordered()',
        '[class.bloc-table--hoverable]': 'hoverable()',
        '[class.bloc-table--sticky]': 'sticky()',
        '[class.bloc-table--sm]': 'size() === "sm"',
        '[class.bloc-table--lg]': 'size() === "lg"',
    },
})
export class BlocTableComponent {
    /** Array of row objects to display. */
    readonly data = input<Record<string, unknown>[]>([]);

    /** Whether to apply alternating row stripes. */
    readonly striped = input<boolean>(false);

    /** Whether to show cell borders. */
    readonly bordered = input<boolean>(false);

    /** Whether rows highlight on hover. */
    readonly hoverable = input<boolean>(false);

    /** Whether the header is sticky. */
    readonly sticky = input<boolean>(false);

    /** Preset size. Defaults to `'md'`. */
    readonly size = input<'sm' | 'md' | 'lg'>('md');

    readonly columns = contentChildren(BlocColumnComponent);
}
