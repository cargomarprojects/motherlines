import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_edi_master } from '../../models/tbl_edi_master';
import { SearchQuery } from '../../models/tbl_edi_master';
import { PageQuery } from '../../../shared/models/pageQuery';
import { ShipDataPageService } from '../../services/shipdatapage.service';

@Component({
    selector: 'app-shipdatapage',
    templateUrl: './shipdatapage.component.html'
})
export class ShipDataPageComponent implements OnInit {

    // @Input() routeparams: any = null;
    
    errorMessage$: Observable<string>;
    records$: Observable<Tbl_edi_master[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: ShipDataPageService
    ) { }

    ngOnInit() {
        this.mainservice.init(this.route.snapshot.queryParams);
        this.initPage();
    }
    
    initPage() {
        this.records$ = this.mainservice.data$.pipe(map(res => res.records));
        this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
        this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
        this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
    }

    searchEvents(actions: any) {
        this.mainservice.Search(actions, 'SEARCH');
    }

    pageEvents(actions: any) {
        this.mainservice.Search(actions, 'PAGE');
    }

    Close() {
        this.location.back();
    }

    XmlImportData_Click(_record: Tbl_edi_master) {
        // let sID: string = (_record.cf_master_id != null) ? _record.cf_master_id.toString() : "";
        // let REFNO: string = _record.cf_refno != null ? _record.cf_refno.toString() : "";
        // let sMode: string = _record.cf_mbl_mode != null ? _record.cf_mbl_mode.toString() : "";
        // let branch_code: string = _record.cf_branch_code != null ? _record.cf_branch_code.toString() : "";
        // if (sID == "") {
        //     alert('Invalid Record Selected');
        //     return;
        // }
        // if (branch_code == this.gs.branch_code) {
        //     this.gs.LinkPage("REFNO", sMode, REFNO, sID);
        // }
        // else {
        //     alert("Cannot Show Details from another Branch");
        // }
    }

    CheckMaster(_record: Tbl_edi_master){

        if (_record.rec_updated == "Y") {
            alert('Record is already Transfered')
            return;
        }
        if (_record.rec_updated == "D") {
            alert('Deleted Record')
            return;
        }
         
        this.mainservice.CheckMaster(_record.masterid);
    }
    
}
