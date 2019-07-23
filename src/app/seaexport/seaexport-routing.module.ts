import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeaexpMasterComponent } from './master/seaexp-master.component';
import { SeaexpMasterEditComponent } from './master/edit/seaexp-master-edit.component';
import { BookingComponent } from './booking/booking.component';
import { MblPageComponent } from './mblpage/mblpage.component';

const routes: Routes = [
  { path : 'SeaExpMasterPage', component : SeaexpMasterComponent },
  { path : 'SeaExpMasterEditPage', component : SeaexpMasterEditComponent },
  { path : 'BookingPage', component : BookingComponent },
  { path : 'MBLPage', component : MblPageComponent },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeaExportRoutingModule { }
