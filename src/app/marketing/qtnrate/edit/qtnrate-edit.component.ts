import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { QtnRateService } from '../../../marketing/services/qtnrate.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_qtn_rates, Tbl_Cargo_Qtn_Rates } from '../../../marketing/models/tbl_cargo_qtn_rates';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-qtnrate-edit',
    templateUrl: './qtnrate-edit.component.html'
})
export class QtnRateEditComponent implements OnInit {

    record: Tbl_Cargo_Qtn_Rates = <Tbl_Cargo_Qtn_Rates>{};

    mbl_pkid: string;
    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: QtnRateService,
    ) { }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);

        this.menuid = options.menuid;
        this.pkid = options.pkid;
        this.refno = options.mbl_refno;
        this.mode = options.mode;

        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
        this.LoadCombo();
    }

    LoadCombo() {

    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';
        if (this.mode == 'ADD') {
            this.record = <Tbl_Cargo_Qtn_Rates>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.pkid = this.gs.getGuid();

        this.record.qtnr_pkid = this.pkid;
        // this.record.cs_refno = this.refno;
        // this.record.cs_mode = this.oprgrp;
        // this.record.cs_mbl_id = this.mbl_pkid;
        // this.record.cs_date = this.gs.defaultValues.today;
        // if (curr_hh >= 12)
        //   this.record.cs_ampm = "PM";
        // else
        //   this.record.cs_ampm = "AM";

        // if (this.gs.MESSENGER_PKID == null || this.gs.MESSENGER_PKID == '') {
        //   this.record.cs_to_id = '';
        //   this.record.cs_to_code = '';
        //   this.record.cs_to_name = '';
        //   this.record.cs_to_tel = '';
        //   this.record.cs_to_fax = '';
        // }

        // if (this.record.cs_mbl_id == undefined || this.record.cs_mbl_id == '' || this.record.cs_mbl_id == null) {
        //   this.record.cs_from_id = '';
        //   this.record.cs_from_name = '';
        //   this.record.cs_mbl_no = '';
        // }
        // this.record.cs_is_drop = 'N';
        // this.record.cs_is_pick = 'N';
        // this.record.cs_is_receipt = 'N';
        // this.record.cs_is_check = 'N';
        // this.record.cs_check_det = '';
        // this.record.cs_is_bl = 'N';
        // this.record.cs_bl_det = '';
        // this.record.cs_is_oth = 'N';
        // this.record.cs_oth_det = '';
        // this.record.cs_deliver_to_id = '';
        // this.record.cs_deliver_to_code = '';
        // this.record.cs_deliver_to_name = '';
        // this.record.cs_deliver_to_add1 = '';
        // this.record.cs_deliver_to_add2 = '';
        // this.record.cs_deliver_to_add3 = '';
        // this.record.cs_deliver_to_tel = '';
        // this.record.cs_deliver_to_attn = '';
        // this.record.cs_remark = '';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;



        // if (this.record.cs_mbl_id) {
        //   this.record.cs_from_id = _rec.cs_from_id;
        //   this.record.cs_from_name = _rec.cs_from_name;
        //   this.record.cs_mbl_no = _rec.cs_mbl_no;
        // }

        // if (this.gs.MESSENGER_PKID) {
        //   this.record.cs_to_id = _rec.cs_to_id;
        //   this.record.cs_to_code = _rec.cs_to_code;
        //   this.record.cs_to_name = _rec.cs_to_name;
        //   this.record.cs_to_tel = _rec.cs_to_tel;
        //   this.record.cs_to_fax = _rec.cs_to_fax;
        // }


        // this.csdate_field.Focus();

    }

    GetRecord() {

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Cargo_Qtn_Rates>response.record;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_tbl_cargo_qtn_rates>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    if (this.mode == "ADD" && response.code != '')
                        this.record.qtnr_slno = response.code;
                    this.mode = 'EDIT';
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {
        // if (this.oprgrp == "GENERAL")
        //   this.record.cs_mbl_id = this.pkid;
        // else
        //   this.record.cs_mbl_id = this.mbl_pkid;
        // this.record.cs_mode = this.oprgrp;
        // this.record.cs_pkid = this.pkid;
        // this.record.cs_is_drop = this.record.cs_is_drop_bool == true ? "Y" : "N";
        // this.record.cs_is_pick = this.record.cs_is_pick_bool == true ? "Y" : "N";
        // this.record.cs_is_receipt = this.record.cs_is_receipt_bool == true ? "Y" : "N";
        // this.record.cs_is_check = this.record.cs_is_check_bool == true ? "Y" : "N";
        // this.record.cs_is_bl = this.record.cs_is_bl_bool == true ? "Y" : "N";
        // this.record.cs_is_oth = this.record.cs_is_oth_bool == true ? "Y" : "N";
    }
    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            // this.csdate_field.Focus();
            return bRet;
        }

        // if (this.gs.isBlank(this.record.cs_date)) {
        //   bRet = false;
        //   this.errorMessage = "Date cannot be blank";
        //   alert(this.errorMessage);
        //   // this.csdate_field.Focus();
        //   return bRet;
        // }

        // if (this.record.cs_is_drop_bool == false && this.record.cs_is_pick_bool == false && this.record.cs_is_receipt_bool == false) {
        //   bRet = false;
        //   this.errorMessage = "Please Select Drop/ Pick Up/ Get Receipt";
        //   alert(this.errorMessage);
        //   this.is_drop_field.nativeElement.focus();
        //   return bRet;
        // }

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "AGENT") {
            this.record.qtnr_agent_id = _Record.id;
            this.record.qtnr_agent_code = _Record.code;
            this.record.qtnr_agent_name = _Record.name;
        }

        if (_Record.controlname == "POL-COUNTRY") {
            this.record.qtnr_pol_cntry_id = _Record.id;
            this.record.qtnr_pol_cntry_name = _Record.name;
        }
        if (_Record.controlname == "POD-COUNTRY") {
            this.record.qtnr_pod_cntry_id = _Record.id;
            this.record.qtnr_pod_cntry_name = _Record.name;
        }
    }

    OnChange(field: string) {
        if (field == 'hbl_frt_status') {
        }
    }

    onFocusout(field: string) {
        switch (field) {
            case 'mbl_liner_bookingno': {
                // this.IsBLDupliation('BOOKING', this.record.mbl_liner_bookingno);
                // break;
            }
        }
    }

    onBlur(field: string) {
        switch (field) {
            //   case 'cs_remark': {
            //     this.record.cs_remark = this.record.cs_remark.toUpperCase();
            //     break;
            //   }

        }
    }


    BtnNavigation(action: string) {
        switch (action) {
            //   case 'CUSTOMSHOLD': {
            //     let prm = {
            //       menuid: this.gs.MENU_SI_HOUSE_US_CUSTOM_HOLD,
            //       pkid: this.pkid,
            //       origin: 'seaimp-House-page',
            //     };
            //     this.gs.Naviagete('Silver.SeaImport/USCustomsHoldPage', JSON.stringify(prm));
            //     break;
            //   }

        }
    }

}
