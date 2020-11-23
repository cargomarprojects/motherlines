import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_mast_files } from '../models/tbl_mast_files';
import { SearchQuery } from '../models/tbl_mast_files';
import { PageQuery } from '../../shared/models/pageQuery';
import { ImportHblPageService } from '../services/importhblpage.service';

@Component({
    selector: 'app-importhblpage',
    templateUrl: './importhblpage.component.html'
})
export class ImportHblPageComponent implements OnInit {

    // radio_process: string = 'PROCESSED';

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_mast_files[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: ImportHblPageService
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

    XmlImportData_Click(_record: Tbl_mast_files) {
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
}
