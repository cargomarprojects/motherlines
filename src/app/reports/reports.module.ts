import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { StoreModule } from '@ngrx/store';

import { ShipHandReportComponent } from './ship-hand-report/ship-hand-report.component';
import { TeuReportComponent } from './teu-report/teu-report.component';
import { TonReportComponent } from './ton-report/ton-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ProfitReportHouseComponent } from './profit-report-house/profit-report-house.component';
import { ShipLabelReportComponent } from './ship-label-report/ship-label-report.component';
import { TopCustomerReportComponent } from './top-customer-report/top-customer-report.component';
import { ShipmentLogReportComponent } from './ship-log-report/ship-log-report.component';

import { ShipHandReportReducer } from './ship-hand-report/store/ship-hand-report.reducer';
import { TeuReportReducer } from './teu-report/store/teu-report.reducer';
import { TonReportReducer } from './ton-report/store/ton-report.reducer';
import { ProfitReportReducer } from './profit-report/store/profit-report.reducer';
import { ProfitReportHouseReducer } from './profit-report-house/store/profit-report-house.reducer';
import { ShipLabelReportReducer } from './ship-label-report/store/ship-label-report.reducer';


import { TopCustomerReportReducer } from './top-customer-report/store/top-customer-report.reducer';
import { ConsShipReportReducer } from './cons-ship-report/store/cons-ship-report.reducer';
import { ConsShipReportComponent } from './cons-ship-report/cons-ship-report.component';
import { ShipmentLogReportReducer } from './ship-log-report/store/ship-log-report.reducer';
import { InvoiceIssueReportComponent } from './invoice-issue/invoice-issue-report.component';
import { InvoiceIssueReportReducer } from './invoice-issue/store/invoice-issue-report.reducer';

@NgModule({
    declarations :[
    ShipHandReportComponent,
    TeuReportComponent,
    TonReportComponent,
    ProfitReportComponent,
    ProfitReportHouseComponent,
    ShipLabelReportComponent,
    ConsShipReportComponent,
    TopCustomerReportComponent,
    ShipmentLogReportComponent,
    InvoiceIssueReportComponent
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule,
    StoreModule.forFeature('ShipHandReport',ShipHandReportReducer ),    
    StoreModule.forFeature('TeuReport',TeuReportReducer ),        
    StoreModule.forFeature('TonReport',TonReportReducer ),        
    StoreModule.forFeature('ProfitReport',ProfitReportReducer ),        
    StoreModule.forFeature('ProfitReportHouse',ProfitReportHouseReducer ), 
    StoreModule.forFeature('ShipLabelReport',ShipLabelReportReducer ),
    StoreModule.forFeature('ConsShipReport',ConsShipReportReducer ),
    StoreModule.forFeature('ShipLabelReport',ShipLabelReportReducer ),
    StoreModule.forFeature('TopCustomerReport',TopCustomerReportReducer ),   
    StoreModule.forFeature('ShipmentLogReport',ShipmentLogReportReducer ),
    StoreModule.forFeature('InvoiceIssueReport',InvoiceIssueReportReducer ),
  ],
  providers: [
  ]
})
export class ReportsModule { }
