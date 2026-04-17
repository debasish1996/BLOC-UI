import { NgModule } from '@angular/core';
import { BlocTextareaDirective } from './textarea.directive';

@NgModule({
    imports: [BlocTextareaDirective],
    exports: [BlocTextareaDirective],
})
export class BlocTextareaModule {}
