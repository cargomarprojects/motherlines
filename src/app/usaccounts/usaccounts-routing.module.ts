import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/edit/invoice-edit.component';
import { ProfitReportComponent } from './profitreport/profitreport.component';
import { AcctmComponent } from './acctm/acctm.component';
import { AcctmEditComponent } from './acctm/acctm-edit.component';
import { AcgroupComponent } from './acgroupm/acgroup.component';
import { AcgroupEditComponent } from './acgroupm/acgroup-edit.component';
import { BudgetComponent } from './budget/budget.component';
import { AcopenComponent } from './acopening/acopen.component';


const routes: Routes = [
  { path : 'InvoicePage', component : InvoiceComponent },
  { path : 'InvoiceEditPage', component : InvoiceEditComponent },
  { path : 'ProfitReportPage', component : ProfitReportComponent },
  { path : 'AcctmPage', component : AcctmComponent },
  { path : 'AcctmEditPage', component : AcctmEditComponent },
  { path : 'AccGroupPage', component : AcgroupComponent },
  { path : 'AccGroupEditPage', component : AcgroupEditComponent },
  { path : 'AccBudgetPage', component : BudgetComponent },
  { path : 'OpeningPage', component : AcopenComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class USAccountsRoutingModule { }
