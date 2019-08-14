
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OtherRoutingModule } from './other-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { OthGeneralComponent } from './general/oth-general.component';
import { OthGeneralHeaderComponent } from './general/oth-general-header.component';

import { OthGeneralEditComponent } from './general/edit/oth-general-edit.component';
import { OthTrackingPageComponent } from './trackingpage/oth-trackingpage.component';

import { MessengerSlipEditComponent } from './messengerslip/edit/messengerslip-edit.component';

import { MessengerSlipListComponent } from '../other/messengerslip/messengerslip-list.component';
import { MessengerSlipHeaderComponent } from '../other/messengerslip/messengerslip-header.component';
import { MessengerSlipComponent } from '../other/messengerslip/messengerslip.component';

import {ApprovedPageEditComponent } from './approvedpage/edit/approvedpage-edit.component';
import {ApprovedPageListComponent } from './approvedpage/approvedpage-list.component';
import { ApprovedPageHeaderComponent } from '../other/approvedpage/approvedpage-header.component';
import { ApprovedPageComponent } from '../other/approvedpage/approvedpage.component';

import { DeliveryOrderHeaderComponent } from '../other/deliveryorder/deliveryorder-header.component';
import { DeliveryOrderComponent } from '../other/deliveryorder/deliveryorder.component';
import { DeliveryOrderListComponent } from '../other/deliveryorder/deliveryorder-list.component';
import { DeliveryOrderEditComponent } from './deliveryorder/edit/deliveryorder-edit.component';

@NgModule({
  declarations: [
    OthGeneralComponent,
    OthGeneralHeaderComponent,
    OthGeneralEditComponent,
    OthTrackingPageComponent,
    MessengerSlipEditComponent,
    MessengerSlipListComponent,
    MessengerSlipHeaderComponent,
    MessengerSlipComponent,
    ApprovedPageEditComponent,
    ApprovedPageListComponent,
    ApprovedPageHeaderComponent,
    ApprovedPageComponent,
    DeliveryOrderHeaderComponent,
    DeliveryOrderComponent,
    DeliveryOrderListComponent,
    DeliveryOrderEditComponent
  ],
  imports: [
    SharedModule,    
    OtherRoutingModule
  ]
})
export class OtherModule { }
