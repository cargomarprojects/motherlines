import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirImpMasterComponent } from './master/airimp-master.component';
import { AirImpMasterEditComponent } from './master/edit/airimp-master-edit.component';


const routes: Routes = [
  { path : 'AirImpMasterPage', component : AirImpMasterComponent },
  { path : 'AirImpMasterEditPage', component : AirImpMasterEditComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirImportRoutingModule { }