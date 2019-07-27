import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { businessmoduleRoutingModule } from './businessmodule-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { MessengerSlipEditComponent } from './messengerslip/edit/messengerslip-edit.component';
import { MessengerSlipListComponent } from './messengerslip/messengerslip-list.component';
import { MessengerSlipHeaderComponent } from './messengerslip/messengerslip-header.component';
import { MessengerSlipComponent } from './messengerslip/messengerslip.component';


@NgModule({
  declarations: [
    PaymentReqComponent,
    MessengerSlipEditComponent,
    MessengerSlipListComponent,
    MessengerSlipHeaderComponent,
    MessengerSlipComponent
  ],
  imports: [
    SharedModule,    
    businessmoduleRoutingModule
  ]
})
export class BusinessmoduleModule { }
