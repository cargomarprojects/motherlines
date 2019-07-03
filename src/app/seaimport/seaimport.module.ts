
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SeaImportRoutingModule } from './seaimport-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SeaImpMasterComponent } from './master/seaimp-master.component';
import { SeaImpMasterHeaderComponent } from './master/seaimp-master-header.component';

import { SeaImpMasterEditComponent } from './master/edit/seaimp-master-edit.component';


@NgModule({
  declarations: [
    SeaImpMasterComponent,
    SeaImpMasterHeaderComponent,
    SeaImpMasterEditComponent,
  ],
  imports: [
    SharedModule,    
    SeaImportRoutingModule
  ]
})
export class SeaImportModule { }
