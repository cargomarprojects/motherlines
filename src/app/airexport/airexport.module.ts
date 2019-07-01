import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AirExportRoutingModule } from './airexport-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AirExpMasterComponent } from './master/airexp-master.component';
import { AirExpMasterHeaderComponent } from './master/airexp-master-header.component';
import { AirExpMasterEditComponent } from './master/edit/airexp-master-edit.component';

@NgModule({
  declarations: [
    AirExpMasterComponent,
    AirExpMasterHeaderComponent,
    AirExpMasterEditComponent,
  ],
  imports: [
    SharedModule,    
    AirExportRoutingModule
  ]
})
export class AirExportModule { }
