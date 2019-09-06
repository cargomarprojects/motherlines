import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarketingRoutingModule } from './marketing-routing.module';

import { QtnRateHeaderComponent } from './qtnrate/qtnrate-header.component';
import { QtnRateComponent } from './qtnrate/qtnrate.component';
import { QtnRateEditComponent } from './qtnrate/edit/qtnrate-edit.component';
import { SalesJournalsHeaderComponent } from './salesjournals/salesjournals-header.component';
import { SalesJournalsComponent } from './salesjournals/salesjournals.component';
import { SalesJournalsEditComponent } from './salesjournals/edit/salesjournals-edit.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { QtnLclHeaderComponent } from './qtnlcl/qtnlcl-header.component';
import { QtnLclComponent } from './qtnlcl/qtnlcl.component';

@NgModule({
  declarations: [
    QtnRateComponent,
    QtnRateHeaderComponent,
    QtnRateEditComponent,
    SalesJournalsHeaderComponent,
    SalesJournalsComponent,
    SalesJournalsEditComponent,
    QtnLclHeaderComponent,
    QtnLclComponent
  ],
  imports: [
    SharedModule,    
    MarketingRoutingModule
  ]
})
export class MarketingModule { }
