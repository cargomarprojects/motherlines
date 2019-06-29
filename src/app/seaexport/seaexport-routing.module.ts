import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeaexpMasterComponent } from './master/seaexp-master.component';
import { SeaexpMasterEditComponent } from './master/edit/seaexp-master-edit.component';


const routes: Routes = [
  { path : 'SeaExpMasterPage', component : SeaexpMasterComponent },
  { path : 'SeaExpMasterEditPage', component : SeaexpMasterEditComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeaExportRoutingModule { }
