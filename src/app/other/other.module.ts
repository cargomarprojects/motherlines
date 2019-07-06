
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OtherRoutingModule } from './other-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { OthGeneralComponent } from './general/oth-general.component';
import { OthGeneralHeaderComponent } from './general/oth-general-header.component';

import { OthGeneralEditComponent } from './general/edit/oth-general-edit.component';

@NgModule({
  declarations: [
    OthGeneralComponent,
    OthGeneralHeaderComponent,
    OthGeneralEditComponent,
  ],
  imports: [
    SharedModule,    
    OtherRoutingModule
  ]
})
export class OtherModule { }
