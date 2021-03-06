import { Component } from '@angular/core';
import { environment } from '../environments/environment';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';

import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';
import { ConditionalExpr } from '@angular/compiler';



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
    private route : ActivatedRoute
  ) {

    console.log('app constructor');
    this.gs.InitdefaultValues();

    let itot  =  +this.gs.getLocalStorageSize() ;
    console.log('LocalStorage Size ', itot);
    if ( itot > 8)
      localStorage.clear();
    
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


  async ngOnInit() {
    console.log('Application Started');
    console.log('Production ' ,environment.production);

    this.gs.reload_url =  window.location.pathname + window.location.search;

    console.log(this.gs.reload_url);

    const appid = this.gs.getURLParam('appid');
    console.log('appid ', appid);
    if ( appid == null || appid == '' || appid == undefined )
      this.router.navigate(['login'], { replaceUrl: true }); 
    else {
      if (localStorage.getItem(appid)) {
        this.gs.ReadLocalStorage(appid);
        this.router.navigate(['/reload']);
        //await this.gs.LoadSettings();
        //await this.gs.LoadMenu();    
      }
      else 
        this.router.navigate(['login'], { replaceUrl: true }); 
    }
    console.log('ngOnInit App completed');
  }
 

  ngOnDestroy() {
    this.sub.unsusbscribe();
  }


}
