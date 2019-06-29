
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SeaExportRoutingModule } from './seaexport-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SeaexpMasterComponent } from './master/seaexp-master.component';
import { SeaExpMasterHeaderComponent } from './master/seaexp-master-header.component';

import { SeaexpMasterEditComponent } from './master/edit/seaexp-master-edit.component';


@NgModule({
  declarations: [
    SeaexpMasterComponent,
    SeaExpMasterHeaderComponent,
    SeaexpMasterEditComponent,
  ],
  imports: [
    SharedModule,    
    SeaExportRoutingModule
  ]
})
export class SeaExportModule { }
