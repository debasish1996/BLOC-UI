import { NgModule } from '@angular/core';
import { BlocRadioGroupComponent } from './radio-group.component';
import { BlocRadioComponent } from './radio.component';

@NgModule({
    imports: [BlocRadioGroupComponent, BlocRadioComponent],
    exports: [BlocRadioGroupComponent, BlocRadioComponent],
})
export class BlocRadioModule {}
