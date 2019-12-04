import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulemComponent } from './module/modulem.component';

const routes: Routes = [
  {path:'ModulePage', component : ModulemComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdminRoutingModule { }
