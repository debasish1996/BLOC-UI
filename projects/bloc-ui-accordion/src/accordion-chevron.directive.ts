import { Directive } from '@angular/core';

@Directive({
    selector: '[blocAccordionChevron]',
    standalone: true,
    host: {
        class: 'bloc-accordion-chevron',
        'aria-hidden': 'true',
    },
})
export class BlocAccordionChevronDirective {}
