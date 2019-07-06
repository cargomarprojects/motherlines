import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice/invoice.component';


const routes: Routes = [
  { path : 'InvoicePage', component : InvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class USAccountsRoutingModule { }
