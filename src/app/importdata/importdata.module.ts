import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ImportDataRoutingModule } from './importdata-routing.module';

import { ImportHblPageComponent } from './importhblpage/importhblpage.component';
import { ImportHblPageHeaderComponent } from './importhblpage/importhblpage-header.component';
import { ShipDataPageComponent } from './importhblpage/shipdatapage/shipdatapage.component';
import { ShipDataPageHeaderComponent } from './importhblpage/shipdatapage/shipdatapage-header.component';
import { MissingDataPageComponent } from './importhblpage/shipdatapage/missingdatapage.component';
import { SettingPageComponent } from './importhblpage/settingpage/settingpage.component';
import { SettingPageHeaderComponent } from './importhblpage/settingpage/settingpage-header.component';

@NgModule({
  declarations: [
    ImportHblPageComponent,
    ImportHblPageHeaderComponent,
    ShipDataPageComponent,
    ShipDataPageHeaderComponent,
    MissingDataPageComponent,
    SettingPageComponent,
    SettingPageHeaderComponent
  ],
  imports: [
    SharedModule,
    ImportDataRoutingModule
  ]
})
export class ImportDataModule { }
