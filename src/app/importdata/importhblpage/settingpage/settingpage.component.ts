import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_edi_link } from '../../models/tbl_edi_link';
import { SearchQuery } from '../../models/tbl_edi_link';
import { PageQuery } from '../../../shared/models/pageQuery';
import { SettingPageService } from '../../services/settingpage.service';

@Component({
    selector: 'app-settingpage',
    templateUrl: './settingpage.component.html'
})
export class SettingPageComponent implements OnInit {

    routeparams: any;

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_edi_link[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: SettingPageService
    ) { }

    ngOnInit() {
        this.routeparams=this.route.snapshot.queryParams;
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

    XmlImportData_Click(_record: Tbl_edi_link) {
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

    ShipData(){
        let prm = {
            menuid: this.gs.MENU_IMPORT_EXCEL,
            id: '',
            param_type: '',
            origin: 'airimp-master-page',
          };
          this.gs.Naviagete('Silver.ImportData/ShipDataPage', JSON.stringify(prm)); 
    }
}
