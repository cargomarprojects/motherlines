
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './core/login/login.component';
import { Login2Component } from './core/login2/login2.component';
import { HomeComponent } from './core/home/home.component';

const routes: Routes = [
  { path: '', redirectTo : 'login', pathMatch : 'full'  },
  { path: 'login', component: LoginComponent },
  { path: 'login2', component: Login2Component },
  { path: 'home', component: HomeComponent },
  { path: 'Silver.Reports.General', loadChildren: './reports/reports.module#ReportsModule' },
  { path: 'Silver.Master', loadChildren: './master/master.module#MasterModule' },  
  { path: 'Silver.SeaExport.Trans', loadChildren: './seaexport/seaexport.module#SeaExportModule' },  
  { path: 'Silver.AirExport.Trans', loadChildren: './airexport/airexport.module#AirExportModule' },  
  { path: 'Silver.SeaImport', loadChildren: './seaimport/seaimport.module#SeaImportModule' }, 
  { path: 'Silver.AirImport.Trans', loadChildren: './airimport/airimport.module#AirImportModule' }, 
  { path: 'Silver.Other.Trans', loadChildren: './other/other.module#OtherModule' }, 
  { path: 'Silver.USAccounts.Trans', loadChildren: './usaccounts/usaccounts.module#USAccountsModule' }, 
  { path: 'Silver.Library', loadChildren: './shared/shared.module#SharedModule' }, 
  { path: 'Silver.BusinessModule', loadChildren: './businessmodule/businessmodule.module#BusinessmoduleModule' }, 
  { path: 'Silver.Marketing.Quotation', loadChildren: './marketing/marketing.module#MarketingModule' }, 

  { path: 'accounts', loadChildren: './accounts/accounts.module#AccountsModule' },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },  
  { path: 'seaexport', loadChildren: './seaexport/seaexport.module#SeaExportModule' },  
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
