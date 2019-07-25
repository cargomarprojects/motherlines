import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeaexpMasterComponent } from './master/seaexp-master.component';
import { SeaexpMasterEditComponent } from './master/edit/seaexp-master-edit.component';
import { BookingComponent } from './booking/booking.component';
import { MblPageComponent } from './mblpage/mblpage.component';
import { DockPageComponent } from './dockpage/dockpage.component';
import { HousePageComponent } from './housepage/housepage.component';

const routes: Routes = [
  { path : 'SeaExpMasterPage', component : SeaexpMasterComponent },
  { path : 'SeaExpMasterEditPage', component : SeaexpMasterEditComponent },
  { path : 'BookingPage', component : BookingComponent },
  { path : 'MBLPage', component : MblPageComponent },
  { path : 'DockPage', component : DockPageComponent },
  { path : 'SeaExpHouseEditPage', component : HousePageComponent },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeaExportRoutingModule { }
