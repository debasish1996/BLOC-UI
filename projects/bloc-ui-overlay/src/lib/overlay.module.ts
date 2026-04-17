import { NgModule } from '@angular/core';
import { BlocOverlayDirective } from './overlay.directive';

@NgModule({
    imports: [BlocOverlayDirective],
    exports: [BlocOverlayDirective],
})
export class BlocOverlayModule {}
