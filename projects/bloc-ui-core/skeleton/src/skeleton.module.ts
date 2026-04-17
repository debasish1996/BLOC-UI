import { NgModule } from '@angular/core';
import { BlocSkeletonDirective } from './skeleton.directive';

@NgModule({
    imports: [BlocSkeletonDirective],
    exports: [BlocSkeletonDirective],
})
export class BlocSkeletonModule {}
