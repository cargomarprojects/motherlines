import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { businessmoduleRoutingModule } from './businessmodule-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { FollowupComponent } from './followup/followup.component';

@NgModule({
  declarations: [
    PaymentReqComponent,
    FollowupComponent
  ],
  imports: [
    SharedModule,    
    businessmoduleRoutingModule
  ]
})
export class BusinessmoduleModule { }
