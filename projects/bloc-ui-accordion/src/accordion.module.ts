import { NgModule } from '@angular/core';

import { BlocAccordionComponent } from './accordion.component';
import { BlocAccordionItemComponent } from './accordion-item.component';

@NgModule({
    imports: [BlocAccordionComponent, BlocAccordionItemComponent],
    exports: [BlocAccordionComponent, BlocAccordionItemComponent],
})
export class BlocAccordionModule {}
