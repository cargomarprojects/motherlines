import { Component } from '@angular/core';
import { environment } from '../environments/environment';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my App';

  sub: any;

  constructor(
    public gs: GlobalService,
    public loadingservice: LoadingScreenService,
    private router: Router,
  ) {

    this.sub = this.router.events.subscribe((event) => {

      if (this.gs.IsAuthenticated) {
        if (event instanceof NavigationStart) {
          this.loadingservice.startLoading();
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.loadingservice.stopLoading();
        }
      }
    });

  }


  ngOnInit() {

    console.log('Application Started');
    
    if (environment.production)
      console.log('Production');
    else {
      console.log('Development');




      /*     if (sessionStorage.length > 0) {
    
            this.gs.Access_Token = sessionStorage.getItem('access_token');
            this.gs.company_name = sessionStorage.getItem('company_name');
            this.gs.BRANCH_REGION = sessionStorage.getItem('BRANCH_REGION');
            this.gs.company_code = sessionStorage.getItem('company_code');
            this.gs.IsLoginSuccess = JSON.parse(sessionStorage.getItem('isloginsuccess'));
            this.gs.IsAuthenticated = JSON.parse(sessionStorage.getItem('isauthenticated'));
            this.gs.globalData = JSON.parse(sessionStorage.getItem('globaldata'));
            this.gs.globalVariables = JSON.parse(sessionStorage.getItem('globalvariables'));
            this.gs.defaultValues = JSON.parse(sessionStorage.getItem('defaultvalues'));
            this.gs.UserInfo = JSON.parse(sessionStorage.getItem('userinfo'));
            this.gs.Modules = JSON.parse(sessionStorage.getItem('modules'));
            this.gs.MenuList = JSON.parse(sessionStorage.getItem('menulist'));
            this.gs.CompanyList = JSON.parse(sessionStorage.getItem('companylist'));
            this.gs.YearList = JSON.parse(sessionStorage.getItem('yearlist'));
            this.gs.year_code = JSON.parse(sessionStorage.getItem('year_code'));
    
            this.gs.year_start_date = JSON.parse(sessionStorage.getItem('year_start_date'));
            this.gs.year_end_date = JSON.parse(sessionStorage.getItem('year_end_date'));
    
          } */

    }

  }

  ngOnDestroy() {
    this.sub.unsusbscribe();
  }


}
