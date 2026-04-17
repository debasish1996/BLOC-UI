import { NgModule } from '@angular/core';

import { BlocAccordionComponent } from './accordion.component';
import { BlocAccordionItemDirective } from './accordion-item.directive';
import { BlocAccordionTriggerDirective } from './accordion-trigger.directive';
import { BlocAccordionContentDirective } from './accordion-content.directive';
import { BlocAccordionChevronDirective } from './accordion-chevron.directive';

@NgModule({
    imports: [
        BlocAccordionComponent,
        BlocAccordionItemDirective,
        BlocAccordionTriggerDirective,
        BlocAccordionContentDirective,
        BlocAccordionChevronDirective,
    ],
    exports: [
        BlocAccordionComponent,
        BlocAccordionItemDirective,
        BlocAccordionTriggerDirective,
        BlocAccordionContentDirective,
        BlocAccordionChevronDirective,
    ],
})
export class BlocAccordionModule {}
