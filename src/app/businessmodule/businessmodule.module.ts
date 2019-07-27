import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { businessmoduleRoutingModule } from './businessmodule-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';


@NgModule({
  declarations: [
    PaymentReqComponent
  ],
  imports: [
    SharedModule,    
    businessmoduleRoutingModule
  ]
})
export class BusinessmoduleModule { }
