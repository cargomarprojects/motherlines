import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipHandReportComponent } from './ship-hand-report/ship-hand-report.component';
import { TeuReportComponent } from './teu-report/teu-report.component';
import { TonReportComponent } from './ton-report/ton-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ProfitReportHouseComponent } from './profit-report-house/profit-report-house.component';
import { ShipLabelReportComponent } from './ship-label-report/ship-label-report.component';
<<<<<<< HEAD
import { ConsShipReportComponent } from './cons-ship-report/cons-ship-report.component';

=======
import { TopCustomerReportComponent } from './top-customer-report/top-customer-report.component';
>>>>>>> 6da04aa72b772fea680e0112cd4cf4c4c4e4b02b

const routes: Routes = [
   { path :'ShipmentHandledReport', component : ShipHandReportComponent },
   { path :'TeuReport', component : TeuReportComponent },
   { path :'TonnageReport', component : TonReportComponent },
   { path :'ProfitReport', component : ProfitReportComponent },
   { path :'HouseProfitReport', component : ProfitReportHouseComponent },
   { path :'ShipLabelPage', component : ShipLabelReportComponent },
<<<<<<< HEAD
   { path :'ConsShipReportPage', component : ConsShipReportComponent }
=======
   { path :'TopCustomerReport', component : TopCustomerReportComponent }
>>>>>>> 6da04aa72b772fea680e0112cd4cf4c4c4e4b02b
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
