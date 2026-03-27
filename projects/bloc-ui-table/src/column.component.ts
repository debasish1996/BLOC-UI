import { Component, ContentChild, Directive, input, TemplateRef } from '@angular/core';

/**
 * Defines a single column in a `<bloc-table>`.
 *
 * The `field` input is the key to read from each data row.
 * The `header` input is the column header label.
 *
 * Optionally provide a custom cell template via `<ng-template blocCellDef>`.
 *
 * ```html
 * <bloc-column field="name" header="Name" />
 *
 * <bloc-column field="status" header="Status">
 *   <ng-template blocCellDef let-value let-row="row">
 *     <span [class]="value === 'active' ? 'text-green-600' : 'text-red-600'">{{ value }}</span>
 *   </ng-template>
 * </bloc-column>
 * ```
 */
@Directive({
    selector: '[blocCellDef]',
    standalone: true,
})
export class BlocCellDefDirective {
    constructor(public readonly templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: 'bloc-column',
    standalone: true,
    template: '',
})
export class BlocColumnComponent {
    /** The object key to read from each data row. */
    readonly field = input.required<string>();

    /** Column header label. */
    readonly header = input<string>('');

    /** Optional custom cell template. */
    @ContentChild(BlocCellDefDirective) cellDef?: BlocCellDefDirective;
}
