import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OthGeneralComponent } from './general/oth-general.component';
import { OthGeneralEditComponent } from './general/edit/oth-general-edit.component';
import { OthTrackingPageComponent } from './trackingpage/oth-trackingpage.component';
import { MessengerSlipComponent } from '../businessmodule/messengerslip/messengerslip.component';

const routes: Routes = [
  { path : 'GeneralPage', component : OthGeneralComponent },
  { path : 'OthGeneralEditPage', component : OthGeneralEditComponent },
  { path : 'TrackingPage', component : OthTrackingPageComponent },
  { path : 'MessengerSlip', component : MessengerSlipComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
