import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirExpMasterComponent } from './master/airexp-master.component';
import { AirExpMasterEditComponent } from './master/edit/airexp-master-edit.component';
import { AirExpHouseComponent } from './house/airexp-house.component';
 

const routes: Routes = [
  { path : 'AirExpMasterPage', component : AirExpMasterComponent },
  { path : 'AirExpMasterEditPage', component : AirExpMasterEditComponent },
  { path : 'AirExpHousePage', component : AirExpHouseComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirExportRoutingModule { }