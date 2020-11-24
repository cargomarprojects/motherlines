import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportHblPageComponent } from './importhblpage/importhblpage.component';
import { ShipDataPageComponent } from './importhblpage/shipdatapage/shipdatapage.component';
import { MissingDataPageComponent } from './importhblpage/shipdatapage/missingdatapage.component';

const routes: Routes = [
  { path : 'ImportHBLPage', component : ImportHblPageComponent },
  { path : 'ShipDataPage', component : ShipDataPageComponent },
  { path : 'MissingDataPage', component : MissingDataPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportDataRoutingModule { }
