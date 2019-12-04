import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulemComponent } from './module/modulem.component';
import { ModulemEditComponent } from './module/modulem-edit.component';
import { MenuComponent } from './menu/menu.component';
import { MenuEditComponent } from './menu/menu-edit.component';

const routes: Routes = [
  {path:'ModulePage', component : ModulemComponent},
  {path:'ModulemEditPage', component : ModulemEditComponent}
  {path:'MenuPage', component : MenuComponent },
  {path:'MenuEditPage', component : MenuEditComponent}  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdminRoutingModule { }
