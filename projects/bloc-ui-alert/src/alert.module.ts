import { NgModule } from '@angular/core';

import { BlocAlertComponent, BlocAlertIconDirective } from './alert.component';

@NgModule({
    imports: [BlocAlertComponent, BlocAlertIconDirective],
    exports: [BlocAlertComponent, BlocAlertIconDirective],
})
export class BlocAlertModule {}
