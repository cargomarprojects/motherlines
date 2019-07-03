import { Component } from '@angular/core';
import { environment } from '../environments/environment';

import { LoadingScreenService } from './core/services/loadingscreen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myApp';

  constructor(public loadingservice: LoadingScreenService) {

  }


  ngOnInit() {
    console.log('Application Started');
    if (environment.production)
      console.log('Production');
    else
      console.log('Development');

  }


}
