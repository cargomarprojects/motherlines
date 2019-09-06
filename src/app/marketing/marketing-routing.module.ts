import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QtnRateComponent } from './qtnrate/qtnrate.component';
import { QtnRateEditComponent } from './qtnrate/edit/qtnrate-edit.component';
import { SalesJournalsComponent } from './salesjournals/salesjournals.component';
import { SalesJournalsEditComponent } from './salesjournals/edit/salesjournals-edit.component';
import { QtnLclComponent } from './qtnlcl/qtnlcl.component';

const routes: Routes = [
  { path : 'QuotationRatePage', component : QtnRateComponent },
  { path : 'QuotationRateEditPage', component : QtnRateEditComponent },
  { path : 'MarkContactsPage', component : SalesJournalsComponent },
  { path : 'SalesJournalsEditPage', component : SalesJournalsEditComponent },
  { path : 'QuotationLCLPage', component : QtnLclComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }