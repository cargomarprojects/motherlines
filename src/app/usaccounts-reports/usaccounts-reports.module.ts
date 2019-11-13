import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsAccountsReportsRoutingModule } from './usaccounts-reports-routing.module';
import { StoreModule } from '@ngrx/store';

import { BankEnquiryReportComponent } from './bank-enquiry-report/bank-enquiry-report.component';
import { BankEnquiryReportReducer  } from './bank-enquiry-report/store/bank-enquiry-report.reducer';

import { BankStmtReportComponent } from './bank-stmt-report/bank-stmt-report.component';
import { BankStmtReportReducer  } from './bank-stmt-report/store/bank-stmt-report.reducer';



@NgModule({
    declarations :[
      BankEnquiryReportComponent,  
      BankStmtReportComponent,
  ],
  imports: [
    SharedModule,
    UsAccountsReportsRoutingModule,
    StoreModule.forFeature('BankEnquiryReport',BankEnquiryReportReducer ),    
    StoreModule.forFeature('BankStmtReport',BankStmtReportReducer ),    
  ],
  providers: [
  ]
})
export class UsAccountsReportsModule { }
