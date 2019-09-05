import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { FollowupComponent } from './followup/followup.component';
import { XmlRemarksComponent } from './xmlremarks/xmlremarks.component';

const routes: Routes = [
  { path : 'PaymentRequestPage', component : PaymentReqComponent },
  { path : 'FollowUpPage', component : FollowupComponent },
  { path : 'XmlRemarksPage', component : XmlRemarksComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class businessmoduleRoutingModule { }