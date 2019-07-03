import { Component } from '@angular/core';
import { environment } from '../environments/environment';


import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myApp';

  constructor(
    public gs: GlobalService,
    public loadingservice: LoadingScreenService
  ) {

  }


  ngOnInit() {
    console.log('Application Started');
    if (environment.production)
      console.log('Production');
    else {
      console.log('Development');

      if (localStorage.length > 0) {


        this.gs.Access_Token = localStorage.getItem('access_token');
        this.gs.Company_Name = localStorage.getItem('company_name');
        this.gs.IsLoginSuccess = JSON.parse(localStorage.getItem('isloginsuccess'));
        this.gs.IsAuthenticated = JSON.parse(localStorage.getItem('isauthenticated'));
        this.gs.globalData = JSON.parse(localStorage.getItem('globaldata'));
        this.gs.globalVariables = JSON.parse(localStorage.getItem('globalvariables'));
        this.gs.defaultValues = JSON.parse(localStorage.getItem('defaultvalues'));
        this.gs.UserInfo = JSON.parse(localStorage.getItem('userinfo'));
        this.gs.Modules = JSON.parse(localStorage.getItem('modules'));
        this.gs.MenuList = JSON.parse(localStorage.getItem('menulist'));
        this.gs.CompanyList = JSON.parse(localStorage.getItem('companylist'));
        this.gs.YearList = JSON.parse(localStorage.getItem('yearlist'));

      }

    }

  }

  ngOnDestroy(){
    
  }


}
