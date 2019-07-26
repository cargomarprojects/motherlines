import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { MessengerSlipEditComponent } from './messengerslip/edit/messengerslip-edit.component';
import { MessengerSlipListComponent } from './messengerslip/messengerslip-list.component';

const routes: Routes = [
  { path : 'PaymentRequestPage', component : PaymentReqComponent },
  { path : 'MessengerSlip', component : MessengerSlipEditComponent },
  { path : 'MessengerSlipList', component : MessengerSlipListComponent }
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }