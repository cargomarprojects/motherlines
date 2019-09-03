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

        this.record.qtnr_pkid = this.pkid;
        this.record.qtnr_agent_id = '';
        this.record.qtnr_agent_code = '';
        this.record.qtnr_agent_name = '';
        this.record.qtnr_pol_cntry_id = '';
        this.record.qtnr_pol_cntry_code = '';
        this.record.qtnr_pol_cntry_name = '';
        this.record.qtnr_pod_cntry_id = '';
        this.record.qtnr_pod_cntry_code = '';
        this.record.qtnr_pod_cntry_name = '';
        this.record.qtnr_mode = '';
        this.record.qtnr_validity = this.gs.defaultValues.today;
        this.record.rec_files_attached = 'N';;
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
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
                    this.mainService.RefreshList(this.record);
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                    
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {
       
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

        if (this.gs.isBlank(this.record.qtnr_agent_id) || this.gs.isBlank(this.record.qtnr_agent_name)) {
            bRet = false;
            this.errorMessage = "Agent Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        if (this.gs.isBlank(this.record.qtnr_validity)) {
            bRet = false;
            this.errorMessage = "Validity cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

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
    }
    onFocusout(field: string) {
    }

    onBlur(field: string) {
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
