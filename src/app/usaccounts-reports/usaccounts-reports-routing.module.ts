import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankEnquiryReportComponent } from './bank-enquiry-report/bank-enquiry-report.component';
import { BankStmtReportComponent } from './bank-stmt-report/bank-stmt-report.component';
import { BankBalReportComponent } from './bank-bal-report/bank-bal-report.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
<<<<<<< HEAD
import { CustStmtReportComponent } from './cust-stmt-report/cust-stmt-report.component';
=======
import { PaySearchComponent } from './paysearch/paysearch.component';
>>>>>>> 199a30b947ab2a80f2d8b152317cd460756ff768

const routes: Routes = [
  { path :'BankPage', component : BankEnquiryReportComponent },
  { path :'BankStmtPage', component : BankStmtReportComponent },
  { path :'BankBalancePage', component : BankBalReportComponent },
  { path :'AgingReport', component : AgingReportComponent },
<<<<<<< HEAD
  { path :'CustStmtPage', component : CustStmtReportComponent },
=======
  { path :'PaySearchPage', component : PaySearchComponent },
>>>>>>> 199a30b947ab2a80f2d8b152317cd460756ff768
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsAccountsReportsRoutingModule { 

  test : number;
  
}
