import { NgModule } from '@angular/core';
import { BlocTextHighlightDirective } from './text-highlight.directive';

@NgModule({
    imports: [BlocTextHighlightDirective],
    exports: [BlocTextHighlightDirective],
})
export class BlocTextHighlightModule {}
