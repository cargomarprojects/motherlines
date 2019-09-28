import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MasterRoutingModule } from './master-routing.module';

import { ParamReducer } from './store/param/param-page.reducer';
import { ParamEffects } from './store/param/param-page.effects';

import { ParamDetReducer } from './store/paramdet/paramdet-page.reducer';
import { ParamDetEffects } from './store/paramdet/paramdet-page.effects';

import { ParamPageComponent } from './param/param-page.component';
import { ParamHeaderComponent } from './param/param-header.component';
import { ParamEditComponent } from './param/param-edit.component';

import { ParamDetPageComponent } from './paramdet/paramdet-page.component';
import { ParamDetHeaderComponent } from './paramdet/paramdet-header.component';
import { ParamDetEditComponent } from './paramdet/paramdet-edit.component';
import { PartyHeaderComponent } from './party/party-header.component';
import { PartyComponent } from './party/party.component';
import { PartyEditComponent } from './party/edit/party-edit.component';
import { DeliveryAddrComponent } from './deliveryaddr/deliveryaddr.component';

@NgModule({
  declarations: [
    ParamPageComponent,
    ParamHeaderComponent,
    ParamEditComponent,
    ParamDetPageComponent,
    ParamDetHeaderComponent,
    ParamDetEditComponent,   
    PartyHeaderComponent,
    PartyComponent,
    PartyEditComponent,
    DeliveryAddrComponent
  ],
  imports: [
    SharedModule,
    MasterRoutingModule,
    StoreModule.forFeature('param', ParamReducer ),
    StoreModule.forFeature('paramdet', ParamDetReducer ),

    EffectsModule.forFeature([ParamEffects, ParamDetEffects])
    
  ]
})
export class MasterModule { }
