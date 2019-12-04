import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserAdminRoutingModule } from './useradmin-routing.module';
import { ModulemComponent } from './module/modulem.component';

@NgModule({
  declarations: [
    ModulemComponent
  ],
  imports: [
    SharedModule,
    UserAdminRoutingModule,
  ]
})
export class UserAdminModule { }
