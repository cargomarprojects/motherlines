import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { businessmoduleRoutingModule } from './businessmodule-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { MessengerSlipEditComponent } from './messengerslip/edit/messengerslip-edit.component';
import { MessengerSlipListComponent } from './messengerslip/messengerslip-list.component';

@NgModule({
  declarations: [
    PaymentReqComponent,
    MessengerSlipEditComponent,
    MessengerSlipListComponent,
  ],
  imports: [
    SharedModule,    
    businessmoduleRoutingModule
  ]
})
export class BusinessmoduleModule { }
