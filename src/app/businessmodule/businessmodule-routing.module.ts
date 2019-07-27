import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';

const routes: Routes = [
  { path : 'PaymentRequestPage', component : PaymentReqComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class businessmoduleRoutingModule { }