import { NgModule } from '@angular/core';

import { BlocSidebarContentComponent } from './sidebar-content.component';
import { BlocSidebarComponent } from './sidebar.component';
import { BlocSidebarLayoutComponent } from './sidebar-layout.component';

@NgModule({
    imports: [BlocSidebarLayoutComponent, BlocSidebarComponent, BlocSidebarContentComponent],
    exports: [BlocSidebarLayoutComponent, BlocSidebarComponent, BlocSidebarContentComponent],
})
export class BlocLayoutModule {}
