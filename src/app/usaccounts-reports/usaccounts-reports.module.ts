import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsAccountsReportsRoutingModule } from './usaccounts-reports-routing.module';
import { StoreModule } from '@ngrx/store';

import { BankEnquiryReportComponent } from './bank-enquiry-report/bank-enquiry-report.component';
import { BankEnquiryReportReducer  } from './bank-enquiry-report/store/bank-enquiry-report.reducer';


@NgModule({
    declarations :[
      BankEnquiryReportComponent,  
  ],
  imports: [
    SharedModule,
    UsAccountsReportsRoutingModule,
    StoreModule.forFeature('BankEnquiryReport',BankEnquiryReportReducer ),    
  ],
  providers: [
  ]
})
export class UsAccountsReportsModule { }
