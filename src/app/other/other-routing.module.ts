import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OthGeneralComponent } from './general/oth-general.component';
import { OthGeneralEditComponent } from './general/edit/oth-general-edit.component';

const routes: Routes = [
  { path : 'GeneralPage', component : OthGeneralComponent },
  { path : 'OthGeneralEditPage', component : OthGeneralEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
