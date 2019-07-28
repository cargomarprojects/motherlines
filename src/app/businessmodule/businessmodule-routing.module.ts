import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { FollowupComponent } from './followup/followup.component';

const routes: Routes = [
  { path : 'PaymentRequestPage', component : PaymentReqComponent },
  { path : 'FollowUpPage', component : FollowupComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class businessmoduleRoutingModule { }