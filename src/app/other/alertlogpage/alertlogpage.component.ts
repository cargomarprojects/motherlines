import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general } from '../models/tbl_cargo_general';
import { Tbl_cargo_followup, vm_Tbl_cargo_followup } from '../models/tbl_cargo_followup';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

import { AlertLogPageService } from '../services/alertlogpage.service';

@Component({
    selector: 'app-alertlogpage',
    templateUrl: './alertlogpage.component.html'
})
export class AlertLogPageComponent implements OnInit {

    /*
   01-07-2019 Created By Ajith  
  
  */
    frecords: Tbl_cargo_followup[]
    ErrorMessage: string = "";
    _artab: boolean = true;
    chkallselected: boolean = false;
    selectdeselect: boolean = false;

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_cargo_general[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: AlertLogPageService
    ) { }

    ngOnInit() {
        this.mainservice.init(this.route.snapshot.queryParams);
        this.initPage();
        this.List('SCREEN');
    }

    List(action: string = '') {
        this.ErrorMessage = "";
        this.chkallselected = false;
        this.selectdeselect = false;
        var SearchData = this.gs.UserInfo;
        this.mainservice.FollowupList(SearchData).subscribe(response => {
            this.frecords = response.list;

        }, error => {
            this.ErrorMessage = this.gs.getError(error)
        });
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

    ngOnDestroy() {
    }


    RemoveRecord() {

        if (this.frecords == null)
            return;

        let bChecked: boolean = false;
        this.frecords.forEach(rec => {
            rec.cf_yn = 'N';
            if (rec.cf_yn_b) {
                rec.cf_yn = 'Y';
                bChecked = true;
            }
        });

        if (!bChecked) {
            this.ErrorMessage = "No Records Selected";
            alert(this.ErrorMessage);
            return;
        }

        if (!confirm("Delete Selected Records")) {
            return;
        }

        const saveRecord = <vm_Tbl_cargo_followup>{};
        saveRecord.records = this.frecords;
        saveRecord.userinfo = this.gs.UserInfo;
        this.mainservice.DeleteRecord(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.ErrorMessage = response.error;
                    alert(this.ErrorMessage);
                } else {

                    let flist: Tbl_cargo_followup[];
                    flist = this.frecords;
                    this.frecords = <Tbl_cargo_followup[]>[];
                    flist.forEach(rec => {
                        if (!rec.cf_yn_b)
                            this.frecords.push(rec);
                    });
                }

            }, error => {
                this.ErrorMessage = this.gs.getError(error);
                alert(this.ErrorMessage);
            });
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        for (let rec of this.frecords) {
            rec.cf_yn_b = this.selectdeselect;
        }
        this.chkallselected = this.selectdeselect;
    }


}
