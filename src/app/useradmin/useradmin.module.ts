import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserAdminRoutingModule } from './useradmin-routing.module';
import { ModulemComponent } from './module/modulem.component';
import { ModulemHeaderComponent } from './module/modulem-header.component';
import { ModulemEditComponent } from './module/modulem-edit.component';

@NgModule({
  declarations: [
    ModulemComponent,
    ModulemHeaderComponent,
    ModulemEditComponent
  ],
  imports: [
    SharedModule,
    UserAdminRoutingModule,
  ]
})
export class UserAdminModule { }
