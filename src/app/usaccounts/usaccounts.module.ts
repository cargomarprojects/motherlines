import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { USAccountsRoutingModule } from './usaccounts-routing.module';

import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/edit/invoice-edit.component';
import { ProfitReportComponent } from './profitreport/profitreport.component';
import { AcctmComponent } from './acctm/acctm.component';
import { AcctmHeaderComponent } from './acctm/acctm-header.component';
import { AcctmEditComponent } from './acctm/acctm-edit.component';
import { AcgroupComponent } from './acgroupm/acgroup.component';
import { AcgroupHeaderComponent } from './acgroupm/acgroup-header.component';
import { AcgroupEditComponent } from './acgroupm/acgroup-edit.component';
import { BudgetComponent } from './budget/budget.component';

@NgModule({
  declarations: [
  InvoiceComponent,
  InvoiceEditComponent,
  ProfitReportComponent,
  AcctmComponent,
  AcctmHeaderComponent,
  AcctmEditComponent,
  AcgroupComponent,
  AcgroupHeaderComponent,
  AcgroupEditComponent,
  BudgetComponent
],
  imports: [
    SharedModule,
    USAccountsRoutingModule
  ]
})
export class USAccountsModule { }
