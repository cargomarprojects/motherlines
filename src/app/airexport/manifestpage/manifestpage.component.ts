import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-manifestpage',
    templateUrl: './manifestpage.component.html'
})
export class ManifestPageComponent implements OnInit {

    // @ViewChild('mbl_no') mbl_no_field: ElementRef;

    // 15-07-2019 Created By Ajith  

    private pkid: string;
    private menuid: string;
    private mode: string;
    private title: string = '';
    private isAdmin: boolean;
    private mbl_no: string = '';
    private mbl_refno: string = '';

    IsMaster: boolean = false;
    
    FM_ID:string='';
    FM_CODE:string='';
    FM_NAME:string='';
    FM_ADDR1:string='';
    FM_ADDR2:string='';
    FM_ADDR3:string='';
    FM_ADDR4:string='';

    TO_ID:string='';
    TO_CODE:string='';
    TO_NAME:string='';
    TO_ADDR1:string='';
    TO_ADDR2:string='';
    TO_ADDR3:string='';
    TO_ADDR4:string='';


    private errorMessage: string[] = [];


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
    ) { }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);
        this.pkid = options.pkid;
        this.menuid = options.menuid;
        this.mbl_no = options.mbl_no;
        this.mbl_refno = options.mbl_refno;
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = [];
        this.LoadCombo();
    }

    LoadCombo() {

    }


    actionHandler() {

    }



    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        // if (_Record.controlname == "AGENT") {
        //   this.record.mbl_agent_id = _Record.id;
        //   this.record.mbl_agent_name = _Record.name;
        // }
    }

    onFocusout(field: string) {

        switch (field) {
            //   case 'mbl_no': {
            //     this.IsBLDupliation('MBL', this.record.mbl_no);
            //     break;
            //   }
        }
    }


    onBlur(field: string) {
        switch (field) {
            //   case 'cust_title': {
            //     this.record.cust_title = this.record.cust_title.toUpperCase();
            //     break;
            //   }

        }
    }

    Save() {

    }

}
