import { NgModule } from '@angular/core';
import { BlocToastComponent } from './toast.component';
import { BlocToastContainerComponent } from './toast-container.component';

@NgModule({
    imports: [BlocToastComponent, BlocToastContainerComponent],
    exports: [BlocToastComponent, BlocToastContainerComponent],
})
export class BlocToastModule {}
