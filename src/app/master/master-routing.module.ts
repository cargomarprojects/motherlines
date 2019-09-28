import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamPageComponent } from './param/param-page.component';
import { ParamEditComponent } from './param/param-edit.component';

import { ParamDetPageComponent } from './paramdet/paramdet-page.component';
import { ParamDetEditComponent } from './paramdet/paramdet-edit.component';
import { PartyComponent } from './party/party.component';
import { PartyEditComponent } from './party/edit/party-edit.component';
import { DeliveryAddrComponent } from './deliveryaddr/deliveryaddr.component';

const routes: Routes = [
  {path:'ParamPage', component: ParamPageComponent},
  {path:'ParamEdit', component: ParamEditComponent},
  {path:'ParamPageDet', component: ParamDetPageComponent},
  {path:'ParamPageDetEdit', component: ParamDetEditComponent},  
  {path:'PartyPage', component: PartyComponent},  
  {path:'PartyEditPage', component: PartyEditComponent},  
  {path:'DeliveryAddrPage', component: DeliveryAddrComponent},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
