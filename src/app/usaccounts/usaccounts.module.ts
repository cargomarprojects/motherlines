import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { USAccountsRoutingModule } from './usaccounts-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/edit/invoice-edit.component';

@NgModule({
  declarations: [
  InvoiceComponent,
  InvoiceEditComponent
],
  imports: [
    SharedModule,
    USAccountsRoutingModule
  ]
})
export class USAccountsModule { }
