import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipHandReportComponent } from './ship-hand-report/ship-hand-report.component';
import { TeuReportComponent } from './teu-report/teu-report.component';
import { TonReportComponent } from './ton-report/ton-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ProfitReportHouseComponent } from './profit-report-house/profit-report-house.component';
import { ShipLabelReportComponent } from './ship-label-report/ship-label-report.component';
import { ConsShipReportComponent } from './cons-ship-report/cons-ship-report.component';

import { TopCustomerReportComponent } from './top-customer-report/top-customer-report.component';
import { ShipmentLogReportComponent } from './ship-log-report/ship-log-report.component';
import { InvIssReportComponent } from './invoice-issue/inv-iss-report.component';
import { ItShipReportComponent } from './it-ship-report/it-ship-report.component';
import { ShipCloseReportComponent } from './ship-closing/ship-close-report.component';

const routes: Routes = [
   { path :'ShipmentHandledReport', component : ShipHandReportComponent },
   { path :'TeuReport', component : TeuReportComponent },
   { path :'TonnageReport', component : TonReportComponent },
   { path :'ProfitReport', component : ProfitReportComponent },
   { path :'HouseProfitReport', component : ProfitReportHouseComponent },
   { path :'ShipLabelPage', component : ShipLabelReportComponent },
   { path :'ConsigneeShipmentReport', component : ConsShipReportComponent },
   { path :'TopCustomerReport', component : TopCustomerReportComponent },
   { path :'ShipmentLogPage', component : ShipmentLogReportComponent },
   { path :'InvoiceIssueReport', component : InvIssReportComponent },
   { path :'ITShipmentReport', component : ItShipReportComponent },
   { path :'ShipmentClosingPage', component : ShipCloseReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
