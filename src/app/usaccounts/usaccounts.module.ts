import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { USAccountsRoutingModule } from './usaccounts-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/edit/invoice-edit.component';
import { ProfitReportComponent } from './profitreport/profitreport.component';

@NgModule({
  declarations: [
  InvoiceComponent,
  InvoiceEditComponent,
  ProfitReportComponent
],
  imports: [
    SharedModule,
    USAccountsRoutingModule
  ]
})
export class USAccountsModule { }
