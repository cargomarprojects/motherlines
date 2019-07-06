import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { USAccountsRoutingModule } from './usaccounts-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
  declarations: [
  InvoiceComponent],
  imports: [
    SharedModule,
    USAccountsRoutingModule
  ]
})
export class USAccountsModule { }
