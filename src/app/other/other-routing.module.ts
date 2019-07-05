import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OthGeneralComponent } from './general/oth-general.component';
//import { SeaexpMasterEditComponent } from './master/edit/seaexp-master-edit.component';

const routes: Routes = [
  { path : 'GeneralPage', component : OthGeneralComponent }
 // { path : 'SeaExpMasterEditPage', component : SeaexpMasterEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
