import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

import { User_Menu } from '../models/menum';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    public isNavbarCollapsed = true;
    
    title = "Pls Login";
    id: string = "";
    constructor(
        private router: Router,
        private location : Location,
        public gs: GlobalService,
        private loginservice: LoginService) {
    }

    LoadPage(rec: User_Menu) {
        this.getUrlID();
        this.id =  rec.menu_pkid;
        var menu_route = rec.menu_xap_dll + "/" + rec.menu_xap_class;
        rec.menu_route2 ='';
        this.router.navigate([menu_route], { queryParams: { id: this.id, menuid : rec.menu_pkid, menu_param : rec.menu_param }});
    }

    Logout() {
        this.loginservice.Logout();
        this.title = 'Pls Login';
        this.router.navigate(['login'], { replaceUrl: true }); 
    }

    getUrlID() {
        this.id = this.gs.getGuid();
    }

    getTEST(){
        return 'TEST1';
    }

}
