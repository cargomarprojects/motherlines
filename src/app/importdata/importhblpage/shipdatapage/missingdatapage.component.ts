import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_edi_link } from '../../models/tbl_edi_link';
import { ShipDataPageService } from '../../services/shipdatapage.service';

@Component({
    selector: 'app-missingdatapage',
    templateUrl: './missingdatapage.component.html'
})
export class MissingDataPageComponent implements OnInit {

    errorMessage: string;
    mbl_pkid: string;
    mbl_refno: string;
    mbl_mode: string;
    searchString: string;

    menuid: string;
    title: string;
    isAdmin: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canSave: boolean;


    records: Tbl_edi_link[]
    is_locked: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: ShipDataPageService
    ) { }

    ngOnInit() {

        const options = JSON.parse(this.route.snapshot.queryParams.parameter);
        this.menuid = options.menuid;
        this.mbl_pkid = options.mbl_pkid;
        // this.mbl_refno = options.mbl_refno;
        // this.mbl_mode = options.mbl_mode;
        // this.is_locked = options.is_locked;

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.title = "Missing Data";
        this.List('DEFAULT');
    }


    List(action: string = '') {
        var SearchData = this.gs.UserInfo;
        if (this.gs.isBlank(this.searchString))
            SearchData.SENDER = '';
        else
            SearchData.SENDER = this.searchString;
        if (this.gs.isBlank(this.mbl_pkid) || action == "VALIDATE")
            SearchData.MASTERID = '';
        else
            SearchData.MASTERID = this.mbl_pkid;
        this.mainservice.MissingList(SearchData).subscribe(response => {
            this.records = response.list;

        }, error => {
            this.errorMessage = this.gs.getError(error)
        });
    }




    Close() {
        this.location.back();
    }
}
