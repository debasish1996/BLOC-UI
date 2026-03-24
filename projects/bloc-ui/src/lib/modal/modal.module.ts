import { NgModule } from '@angular/core';
import { BlocModalService } from './modal.service';

/** NgModule wrapper for `BlocModalService`. Since the service is `providedIn: 'root'` this module is optional, but importing it signals intent in NgModule-based apps. */
@NgModule({
  providers: [BlocModalService],
})
export class BlocModalModule { }

