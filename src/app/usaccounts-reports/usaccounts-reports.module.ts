import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsAccountsReportsRoutingModule } from './usaccounts-reports-routing.module';
import { StoreModule } from '@ngrx/store';

import { BankEnquiryReportComponent } from './bank-enquiry-report/bank-enquiry-report.component';
import { BankEnquiryReportReducer  } from './bank-enquiry-report/store/bank-enquiry-report.reducer';

import { BankStmtReportComponent } from './bank-stmt-report/bank-stmt-report.component';
import { BankStmtReportReducer  } from './bank-stmt-report/store/bank-stmt-report.reducer';

import { BankBalReportComponent } from './bank-bal-report/bank-bal-report.component';
import { BankBalReportReducer  } from './bank-bal-report/store/bank-bal-report.reducer';

import { AgingReportComponent } from './aging-report/aging-report.component';
import { AgingReportReducer  } from './aging-report/store/aging-report.reducer';

import { CustStmtReportComponent } from './cust-stmt-report/cust-stmt-report.component';
import { CustStmtReportReducer  } from './cust-stmt-report/store/cust-stmt-report.reducer';


import { PaySearchComponent } from './paysearch/paysearch.component';
import { PaySearchHeaderComponent } from './paysearch/paysearch-header.component';

import { CustStmtOsinvReportComponent } from './cust-stmt-report/cust-stmt-osinv-report.component';

@NgModule({
    declarations :[
      BankEnquiryReportComponent,  
      BankStmtReportComponent,
      BankBalReportComponent,
      AgingReportComponent,
      CustStmtReportComponent,
      PaySearchComponent,
      PaySearchHeaderComponent,
      CustStmtOsinvReportComponent
  ],
  imports: [
    SharedModule,
    UsAccountsReportsRoutingModule,
    StoreModule.forFeature('BankEnquiryReport',BankEnquiryReportReducer ),    
    StoreModule.forFeature('BankStmtReport',BankStmtReportReducer ),    
    StoreModule.forFeature('BankBalReport',BankBalReportReducer ),    
    StoreModule.forFeature('AgingReport',AgingReportReducer ),    
    StoreModule.forFeature('CustStmtReport',CustStmtReportReducer ),    
  ],
  providers: [
  ]
})
export class UsAccountsReportsModule { }
