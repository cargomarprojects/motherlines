import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulemComponent } from './module/modulem.component';
import { ModulemEditComponent } from './module/modulem-edit.component';

const routes: Routes = [
  {path:'ModulePage', component : ModulemComponent},
  {path:'ModulemEditPage', component : ModulemEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdminRoutingModule { }
