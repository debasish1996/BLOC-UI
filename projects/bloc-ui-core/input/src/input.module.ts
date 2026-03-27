import { NgModule } from '@angular/core';
import { BlocInputDirective, BLOC_INPUT_GROUP_DIRECTIVES } from './input.directive';
import { BlocInputErrorDirective } from './input-error.directive';

@NgModule({
    imports: [BlocInputDirective, ...BLOC_INPUT_GROUP_DIRECTIVES, BlocInputErrorDirective],
    exports: [BlocInputDirective, ...BLOC_INPUT_GROUP_DIRECTIVES, BlocInputErrorDirective],
})
export class BlocInputModule {}
