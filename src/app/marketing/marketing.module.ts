import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarketingRoutingModule } from './marketing-routing.module';

import { QtnRateHeaderComponent } from './qtnrate/qtnrate-header.component';
import { QtnRateComponent } from './qtnrate/qtnrate.component';
import { QtnRateEditComponent } from './qtnrate/edit/qtnrate-edit.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  declarations: [
    QtnRateComponent,
    QtnRateHeaderComponent,
    QtnRateEditComponent
  ],
  imports: [
    SharedModule,    
    MarketingRoutingModule
  ]
})
export class MarketingModule { }
