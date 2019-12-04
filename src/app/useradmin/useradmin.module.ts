import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserAdminRoutingModule } from './useradmin-routing.module';
import { ModulemComponent } from './module/modulem.component';
import { ModulemHeaderComponent } from './module/modulem-header.component';
import { ModulemEditComponent } from './module/modulem-edit.component';
import { MenuEditComponent } from './menu/menu-edit.component';
import { MenuComponent } from './menu/menu.component';
import { MenuHeaderComponent } from './menu/menu-header.component';

@NgModule({
  declarations: [
    ModulemComponent,
    ModulemHeaderComponent,
    ModulemEditComponent,
    MenuComponent,
    MenuHeaderComponent,
    MenuEditComponent,

  ],
  imports: [
    SharedModule,
    UserAdminRoutingModule,
  ]
})
export class UserAdminModule { }
