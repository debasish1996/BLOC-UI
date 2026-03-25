import { NgModule } from '@angular/core';
import { BlocTableComponent } from './table.component';
import { BlocColumnComponent, BlocCellDefDirective } from './column.component';

@NgModule({
    imports: [BlocTableComponent, BlocColumnComponent, BlocCellDefDirective],
    exports: [BlocTableComponent, BlocColumnComponent, BlocCellDefDirective],
})
export class BlocTableModule { }
