import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeaImpMasterComponent } from './master/seaimp-master.component';
import { SeaImpMasterEditComponent } from './master/edit/seaimp-master-edit.component';
import { SeaImpHouseComponent } from './house/seaimp-house.component';
import { SeaImpHouseEditComponent } from './house/edit/seaimp-house-edit.component';
import { SeaImpUsCustomsHoldComponent } from './uscustomshold/seaimp-uscustomshold.component';
import { SeaImpCargoPickupComponent } from './cargopickup/seaimp-cargopickup.component';
const routes: Routes = [
  { path : 'SeaImpMasterPage', component : SeaImpMasterComponent },
  { path : 'SeaImpMasterEditPage', component : SeaImpMasterEditComponent },
  { path : 'SeaImpHousePage', component : SeaImpHouseComponent },
  { path : 'SeaImpHouseEditPage', component : SeaImpHouseEditComponent } ,
  { path : 'USCustomsHoldPage', component : SeaImpUsCustomsHoldComponent },
  { path : 'CargoPickupPage', component : SeaImpCargoPickupComponent }  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeaImportRoutingModule { }