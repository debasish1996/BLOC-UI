import { NgModule } from '@angular/core';
import { BlocModalService } from './modal.service';
import { BlocGenericModalService } from './generic-modal.service';

/** NgModule wrapper for `BlocModalService` and `BlocGenericModalService`. Since both services are `providedIn: 'root'` this module is optional, but importing it signals intent in NgModule-based apps. */
@NgModule({
  providers: [BlocModalService, BlocGenericModalService],
})
export class BlocModalModule { }
