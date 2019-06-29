import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { StoreModule } from '@ngrx/store';

import { ShipHandReportComponent } from './ship-hand-report/ship-hand-report.component';
import { TeuReportComponent } from './teu-report/teu-report.component';
import { TonReportComponent } from './ton-report/ton-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ProfitReportHouseComponent } from './profit-report-house/profit-report-house.component';

import { ShipHandReportReducer } from './ship-hand-report/store/ship-hand-report.reducer';
import { TeuReportReducer } from './teu-report/store/teu-report.reducer';
import { TonReportReducer } from './ton-report/store/ton-report.reducer';
import { ProfitReportReducer } from './profit-report/store/profit-report.reducer';
import { ProfitReportHouseReducer } from './profit-report-house/store/profit-report-house.reducer';

@NgModule({
  declarations: [
    ShipHandReportComponent,
    TeuReportComponent,
    TonReportComponent,
    ProfitReportComponent,
    ProfitReportHouseComponent,
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule,
    StoreModule.forFeature('ShipHandReport',ShipHandReportReducer ),    
    StoreModule.forFeature('TeuReport',TeuReportReducer ),        
    StoreModule.forFeature('TonReport',TonReportReducer ),        
    StoreModule.forFeature('ProfitReport',ProfitReportReducer ),        
    StoreModule.forFeature('ProfitReportHouse',ProfitReportHouseReducer ),        
  ],
  providers: [
  ]
})
export class ReportsModule { }
