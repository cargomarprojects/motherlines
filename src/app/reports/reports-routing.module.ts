import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipHandReportComponent } from './ship-hand-report/ship-hand-report.component';
import { TeuReportComponent } from './teu-report/teu-report.component';
import { TonReportComponent } from './ton-report/ton-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ProfitReportHouseComponent } from './profit-report-house/profit-report-house.component';
import { ShipLabelReportComponent } from './ship-label-report/ship-label-report.component';


const routes: Routes = [
   { path :'ShipmentHandledReport', component : ShipHandReportComponent },
   { path :'TeuReport', component : TeuReportComponent },
   { path :'TonnageReport', component : TonReportComponent },
   { path :'ProfitReport', component : ProfitReportComponent },
   { path :'HouseProfitReport', component : ProfitReportHouseComponent },
   { path :'ShipLabelPage', component : ShipLabelReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
