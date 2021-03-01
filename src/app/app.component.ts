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

    this.gs.InitdefaultValues();

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
    console.log(environment.production);
    this.gs.ReadLocalStorage();
  }

  ngOnDestroy() {
    this.sub.unsusbscribe();
  }


}
