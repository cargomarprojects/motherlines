import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { QtnLclService } from '../../../marketing/services/qtnlcl.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_Cargo_Qtnm, vm_Tbl_Cargo_Qtnd_Lcl, Tbl_Cargo_Qtnd_Lcl } from '../../../marketing/models/tbl_cargo_qtnm';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-qtnlcl-edit',
    templateUrl: './qtnlcl-edit.component.html'
})
export class QtnLclEditComponent implements OnInit {

    record: Tbl_Cargo_Qtnm = <Tbl_Cargo_Qtnm>{};
    records: Tbl_Cargo_Qtnd_Lcl[] = [];

    tab: string = 'main';

    attach_title: string = '';
    attach_parentid: string = '';
    attach_subid: string = '';
    attach_type: string = '';
    attach_typelist: any = {};
    attach_tablename: string = '';
    attach_tablepkcolumn: string = '';
    attach_refno: string = '';
    attach_customername: string = '';
    attach_updatecolumn: string = '';
    attach_viewonlysource: string = '';
    attach_viewonlyid: string = '';
    attach_filespath: string = '';
    attach_filespath2: string = '';

    mbl_pkid: string;
    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string[] = [];
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: QtnLclService,
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
        this.errorMessage = [];
        this.LoadCombo();
    }

    LoadCombo() {

    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = [];
        if (this.mode == 'ADD') {
            this.record = <Tbl_Cargo_Qtnm>{};
            this.records = <Tbl_Cargo_Qtnd_Lcl[]>[];
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.qtnm_pkid = this.pkid;
        this.record.qtnm_no = '';
        this.record.qtnm_to_id = '';
        this.record.qtnm_to_code = '';
        this.record.qtnm_to_name = '';
        this.record.qtnm_to_addr1 = '';
        this.record.qtnm_to_addr2 = '';
        this.record.qtnm_to_addr3 = '';
        this.record.qtnm_to_addr4 = '';
        this.record.qtnm_date = this.gs.defaultValues.today;
        this.record.qtnm_quot_by = this.gs.user_code;
        this.record.qtnm_valid_date = '';
        this.record.qtnm_salesman_id = '';
        this.record.qtnm_salesman_name = '';
        this.record.qtnm_move_type = '';
        this.record.qtnm_por_id = '';
        this.record.qtnm_por_code = '';
        this.record.qtnm_por_name = '';
        this.record.qtnm_pol_id = '';
        this.record.qtnm_pol_code = '';
        this.record.qtnm_pol_name = '';
        this.record.qtnm_pod_id = '';
        this.record.qtnm_pod_code = '';
        this.record.qtnm_pod_name = '';
        this.record.qtnm_pld_name = '';
        this.record.qtnm_plfd_name = '';
        this.record.qtnm_commodity = '';
        this.record.qtnm_package = '';
        this.record.qtnm_kgs = 0;
        this.record.qtnm_lbs = 0;
        this.record.qtnm_cbm = 0;
        this.record.qtnm_cft = 0;
        this.record.qtnm_tot_amt = 0;
        this.record.qtnm_subjects = '';
        this.record.qtnm_remarks = '';
        this.record.qtnm_office_use = '';
        this.record.qtnm_transtime = '';
        this.record.qtnm_routing = '';
        this.record.qtnm_curr_code = '';
        this.record.rec_files_attached = 'N';
        if (this.gs.BRANCH_REGION != "USA") {
            this.record.qtnm_curr_code = this.gs.base_cur_code;
            // this.record.qtnm_curr_id = this.gs.base_cur_pkid;
        }
    }

    GetRecord() {
        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.PATH = filepath;

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Cargo_Qtnm>response.record;
                this.records = <Tbl_Cargo_Qtnd_Lcl[]>response.records;
                this.mode = 'EDIT';

                // if (this.record.rec_attached == "Y")
                //     this.Foregroundcolor = "red";
                // else
                //     this.Foregroundcolor = "white";

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_Cargo_Qtnd_Lcl>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage.push(response.error);
                    alert(this.errorMessage);
                }
                else {
                    if (this.mode == "ADD" && response.code != '')
                        this.record.qtnm_no = response.code;
                    this.mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    this.errorMessage.push('Save Complete');
                    alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
                alert(this.errorMessage);
            });
    }

    private SaveParent() {

    }
    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = [];

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage.push("Invalid ID");
        }

        // if (this.gs.isBlank(this.record.qtnr_agent_id) || this.gs.isBlank(this.record.qtnr_agent_name)) {
        //     bRet = false;
        //     this.errorMessage = "Agent Cannot be blank";
        //     alert(this.errorMessage);
        //     return bRet;
        // }
        // if (this.gs.isBlank(this.record.qtnr_validity)) {
        //     bRet = false;
        //     this.errorMessage = "Validity cannot be blank";
        //     alert(this.errorMessage);
        //     return bRet;
        // }

        if (!bRet)
            alert('Error While Saving');

        return bRet;
    }


    Close() {
        this.location.back();
    }

    AddRow() {

        var rec = <Tbl_Cargo_Qtnd_Lcl>{};
        // rec.cntr_pkid = this.gs.getGuid();
        // rec.cntr_no = "",
        //     rec.cntr_type = "",
        //     rec.cntr_sealno = '';
        // rec.cntr_packages_uom = '';
        // rec.cntr_movement = "",
        //     rec.cntr_weight = 0;
        // rec.cntr_pieces = 0;
        // rec.cntr_cbm = 0;
        this.records.push(rec);
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "QUOTE-TO") {

            this.record.qtnm_to_id = _Record.id;
            this.record.qtnm_to_code = _Record.code;
            this.record.qtnm_to_name = _Record.name;
            if (_Record.col8.toString() != "")
                this.record.qtnm_to_name = _Record.col8.toString();
            this.record.qtnm_to_addr1 = _Record.col1.toString();
            this.record.qtnm_to_addr2 = _Record.col2.toString();
            this.record.qtnm_to_addr3 = _Record.col3.toString();
            this.record.qtnm_to_addr4 = this.gs.GetAttention(_Record.col5.toString());
            // Dispatcher.BeginInvoke(() => { Txt_QuoteTo_Name.Focus(); });
            // GetContactMemo(this.record.qtnm_to_id);
        }
        if (_Record.controlname == "SALESMAN") {
            this.record.qtnm_salesman_id = _Record.id;
            this.record.qtnm_salesman_name = _Record.name;
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
            case 'ATTACHMENT': {
                this.attach_title = 'Documents';
                this.attach_parentid = this.pkid;
                this.attach_subid = '';
                this.attach_type = 'QUOTATION RATES';
                this.attach_typelist = [];
                this.attach_tablename = 'cargo_qtn_rates';
                this.attach_tablepkcolumn = 'qtnr_pkid';
                this.attach_refno = '';
                this.attach_customername = '';
                this.attach_updatecolumn = 'REC_FILES_ATTACHED';
                this.attach_viewonlysource = '';
                this.attach_viewonlyid = '';
                this.attach_filespath = '';
                this.attach_filespath2 = '';
                this.tab = 'attachment';
                break;
            }
        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }
}
