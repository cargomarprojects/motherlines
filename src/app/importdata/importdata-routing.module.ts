import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportHblPageComponent } from './importhblpage/importhblpage.component';

const routes: Routes = [
  { path : 'ImportHBLPage', component : ImportHblPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportDataRoutingModule { }
