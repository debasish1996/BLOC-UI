import { NgModule } from '@angular/core';
import { BlocTabGroupComponent } from './tab-group.component';
import { BlocTabComponent } from './tab.component';

@NgModule({
    imports: [BlocTabGroupComponent, BlocTabComponent],
    exports: [BlocTabGroupComponent, BlocTabComponent],
})
export class BlocTabModule { }
