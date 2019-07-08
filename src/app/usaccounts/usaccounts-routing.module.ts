import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/edit/invoice-edit.component';


const routes: Routes = [
  { path : 'InvoicePage', component : InvoiceComponent },
  { path : 'InvoiceEditPage', component : InvoiceEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class USAccountsRoutingModule { }
