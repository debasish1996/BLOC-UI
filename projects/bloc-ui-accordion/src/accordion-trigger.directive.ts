import { Component, contentChild, ElementRef, inject, input } from '@angular/core';

import { BlocAccordionItemDirective } from './accordion-item.directive';
import { BlocAccordionChevronDirective } from './accordion-chevron.directive';

@Component({
    selector: '[blocAccordionTrigger]',
    standalone: true,
    template: `
        <ng-content />
        @if (chevron() && !customChevron()) {
            <svg
                class="bloc-accordion-chevron"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        }
    `,
    host: {
        class: 'bloc-accordion-trigger',
        role: 'button',
        '[attr.id]': 'item.triggerId',
        '[attr.aria-controls]': 'item.panelId',
        '[attr.aria-expanded]': 'item.expanded()',
        '[attr.disabled]': 'item.disabled() || null',
        '[class.is-open]': 'item.expanded()',
        '(click)': 'item.toggle()',
        '(keydown.enter)': 'item.toggle()',
        '(keydown.space)': '$event.preventDefault(); item.toggle()',
    },
})
export class BlocAccordionTriggerDirective {
    readonly item = inject(BlocAccordionItemDirective);
    readonly customChevron = contentChild(BlocAccordionChevronDirective);
    readonly chevron = input(true);
    private readonly el = inject(ElementRef);

    constructor() {
        // Ensure the trigger element is focusable if it's not a native button
        const tag = this.el.nativeElement.tagName?.toLowerCase();
        if (tag !== 'button') {
            this.el.nativeElement.setAttribute('tabindex', '0');
        }
    }
}
