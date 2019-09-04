import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QtnRateComponent } from './qtnrate/qtnrate.component';
import { QtnRateEditComponent } from './qtnrate/edit/qtnrate-edit.component';
import { SalesJournalsComponent } from './salesjournals/salesjournals.component';

const routes: Routes = [
  { path : 'QuotationRatePage', component : QtnRateComponent },
  { path : 'QuotationRateEditPage', component : QtnRateEditComponent },
  { path : 'MarkContactsPage', component : SalesJournalsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }