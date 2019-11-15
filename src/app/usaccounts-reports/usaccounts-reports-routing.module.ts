import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankEnquiryReportComponent } from './bank-enquiry-report/bank-enquiry-report.component';
import { BankStmtReportComponent } from './bank-stmt-report/bank-stmt-report.component';
import { BankBalReportComponent } from './bank-bal-report/bank-bal-report.component';

const routes: Routes = [
  { path :'BankPage', component : BankEnquiryReportComponent },
  { path :'BankStmtPage', component : BankStmtReportComponent },
  { path :'BankBalancePage', component : BankBalReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsAccountsReportsRoutingModule { }
