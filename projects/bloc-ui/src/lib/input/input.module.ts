import { NgModule } from '@angular/core';
import { BlocInputDirective, BLOC_INPUT_GROUP_DIRECTIVES } from './input.component';

@NgModule({
  imports: [BlocInputDirective, ...BLOC_INPUT_GROUP_DIRECTIVES],
  exports: [BlocInputDirective, ...BLOC_INPUT_GROUP_DIRECTIVES],
})
export class BlocInputModule { }
