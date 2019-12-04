import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserAdminRoutingModule } from './useradmin-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    UserAdminRoutingModule,
  ]
})
export class UserAdminModule { }
