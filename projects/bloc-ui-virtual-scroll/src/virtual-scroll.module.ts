import { NgModule } from '@angular/core';
import { BlocVirtualScrollComponent } from './virtual-scroll.component';
import { BlocVirtualItemDirective } from './virtual-scroll-item.directive';

@NgModule({
    imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
    exports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
})
export class BlocVirtualScrollModule {}
