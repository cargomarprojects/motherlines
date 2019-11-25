
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankEnquiryReportComponent } from './bank-enquiry-report/bank-enquiry-report.component';
import { BankStmtReportComponent } from './bank-stmt-report/bank-stmt-report.component';
import { BankBalReportComponent } from './bank-bal-report/bank-bal-report.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { CustStmtReportComponent } from './cust-stmt-report/cust-stmt-report.component';
import { PaySearchComponent } from './paysearch/paysearch.component';
import { DayBookReportComponent } from './day-book-report/day-book-report.component';
import { GenLedgerReportComponent } from './gen-ledger-report/gen-ledger-report.component';
import { TrialBalReportComponent } from './trial-bal-report/trial-bal-report.component';

const routes: Routes = [
  { path :'BankPage', component : BankEnquiryReportComponent },
  { path :'BankStmtPage', component : BankStmtReportComponent },
  { path :'BankBalancePage', component : BankBalReportComponent },
  { path :'AgingReport', component : AgingReportComponent },
  { path :'PaySearchPage', component : PaySearchComponent }, 
  { path :'CustStmtPage', component : CustStmtReportComponent }, 
  { path :'DayBookPage', component : DayBookReportComponent },
  { path :'LedgerPage', component : GenLedgerReportComponent },
  { path :'TrialPage', component : TrialBalReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsAccountsReportsRoutingModule { 

  
}
