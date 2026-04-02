import { Directive, inject } from '@angular/core';

import { BlocAccordionItemDirective } from './accordion-item.directive';

@Directive({
    selector: '[blocAccordionContent]',
    standalone: true,
    host: {
        class: 'bloc-accordion-panel',
        role: 'region',
        '[attr.id]': 'item.panelId',
        '[attr.aria-labelledby]': 'item.triggerId',
        '[hidden]': '!item.expanded()',
    },
})
export class BlocAccordionContentDirective {
    readonly item = inject(BlocAccordionItemDirective);
}
