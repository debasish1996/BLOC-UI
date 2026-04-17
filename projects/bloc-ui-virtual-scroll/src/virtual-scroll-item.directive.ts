import { Directive, TemplateRef, inject } from '@angular/core';

/** Context exposed to each virtual-item template. */
export interface BlocVirtualItemContext<T = unknown> {
    /** The data item. */
    $implicit: T;
    /** Absolute index in the full items array. */
    index: number;
}

/**
 * Structural directive used inside `<bloc-virtual-scroll>` to define the
 * per-item template.
 *
 * ```html
 * <bloc-virtual-scroll [items]="rows" [itemHeight]="40">
 *   <ng-template blocVirtualItem let-item let-i="index">
 *     <div>{{ i }}. {{ item.name }}</div>
 *   </ng-template>
 * </bloc-virtual-scroll>
 * ```
 */
@Directive({ selector: '[blocVirtualItem]', standalone: true })
export class BlocVirtualItemDirective<T = unknown> {
    readonly templateRef = inject<TemplateRef<BlocVirtualItemContext<T>>>(TemplateRef);
}
