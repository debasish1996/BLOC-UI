import { AfterContentInit, Component, contentChildren, input } from '@angular/core';

import { BlocAccordionItemComponent } from './accordion-item.component';

@Component({
    selector: 'bloc-accordion',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './accordion.component.scss',
    host: {
        class: 'bloc-accordion',
    },
})
export class BlocAccordionComponent implements AfterContentInit {
    readonly multi = input(false);

    readonly items = contentChildren(BlocAccordionItemComponent);

    ngAfterContentInit(): void {
        this._normalizeExpandedState();
    }

    toggleItem(item: BlocAccordionItemComponent): void {
        if (item.disabled()) return;

        if (this.multi()) {
            item.setExpanded(!item.expanded());
            return;
        }

        const shouldExpand = !item.expanded();
        for (const current of this.items()) {
            current.setExpanded(false);
        }
        item.setExpanded(shouldExpand);
    }

    private _normalizeExpandedState(): void {
        if (this.multi()) return;

        let foundExpanded = false;
        for (const item of this.items()) {
            if (!foundExpanded && item.expanded()) {
                foundExpanded = true;
                continue;
            }
            item.setExpanded(false);
        }
    }
}
