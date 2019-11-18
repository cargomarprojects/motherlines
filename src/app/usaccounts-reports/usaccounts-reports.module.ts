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




@NgModule({
    declarations :[


      BankEnquiryReportComponent,  
      BankStmtReportComponent,
      BankBalReportComponent,
      AgingReportComponent,

  ],
  imports: [
    SharedModule,
    UsAccountsReportsRoutingModule,
    StoreModule.forFeature('BankEnquiryReport',BankEnquiryReportReducer ),    
    StoreModule.forFeature('BankStmtReport',BankStmtReportReducer ),    
    StoreModule.forFeature('BankBalReport',BankBalReportReducer ),    
    StoreModule.forFeature('AgingReport',AgingReportReducer ),    
  ],
  providers: [
  ]
})
export class UsAccountsReportsModule { }
