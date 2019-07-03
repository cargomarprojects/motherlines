import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeaImpMasterComponent } from './master/seaimp-master.component';
import { SeaImpMasterEditComponent } from './master/edit/seaimp-master-edit.component';


const routes: Routes = [
  { path : 'SeaImpMasterPage', component : SeaImpMasterComponent },
  { path : 'SeaIMpMasterEditPage', component : SeaImpMasterEditComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeaImportRoutingModule { }