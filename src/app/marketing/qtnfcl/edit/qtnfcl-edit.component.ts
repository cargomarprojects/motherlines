import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { QtnFclService } from '../../../marketing/services/qtnfcl.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_Cargo_Qtnm, vm_Tbl_Cargo_Qtnd_Fcl, Tbl_Cargo_Qtnd_Fcl } from '../../../marketing/models/tbl_cargo_qtnm';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-qtnfcl-edit',
    templateUrl: './qtnfcl-edit.component.html'
})
export class QtnFclEditComponent implements OnInit {

    record: Tbl_Cargo_Qtnm = <Tbl_Cargo_Qtnm>{};
    records: Tbl_Cargo_Qtnd_Fcl[] = [];

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

    lblSave = "Add Row";
    qtnd_pkid: string;
    mbl_pkid: string;
    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string[] = [];
    Foregroundcolor: string;

    //details
    polId: string = '';
    polCode: string = '';
    polName: string = '';
    podId: string = '';
    podCode: string = '';
    podName: string = '';
    carrId: string = '';
    carrCode: string = '';
    carrName: string = '';
    transitTime: string = '';
    routing: string = '';
    etd: string = '';
    cutOff: string = '';
    cntrType: string = '';
    arrRtColHdr: string[] = ['OFF', 'PSS', 'BAF', 'ISPS', 'HAULAGE', 'IFS'];
    arrRtColFld: string[] = ['qtnd_of', 'qtnd_pss', 'qtnd_baf', 'qtnd_isps', 'qtnd_haulage', 'qtnd_ifs'];
    arrRtVal: any[] = [{ 'qtnd_of': 0 }, { 'qtnd_pss': 0 }, { 'qtnd_baf': 0 }, { 'qtnd_isps': 0 }, { 'qtnd_haulage': 0 }, { 'qtnd_ifs': 0 }];

    totAmt: number = 0;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: QtnFclService,
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
        this.LoadLabelHeader();

    }

    LoadCombo() {

    }
    LoadLabelHeader() {
        this.errorMessage = [];
        var SearchData = this.gs.UserInfo;
        this.mainService.LoadLabelHeader(SearchData)
            .subscribe(response => {
                let LblList = <any[]>response.records;
                if (LblList != null) {
                    for (let c = 0; c < 6; c++) {
                        this.ArrangeControls(LblList[c], c);
                    }
                }
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }

    ArrangeControls(sItems: string, ColPos: number) {
        var sdata = sItems.split(',');
        switch (sdata[0].trim()) {
            case "GENERAL_FCL_QUOT_LABEL_OF":
                this.arrRtColHdr[ColPos] = sdata[1];
                this.arrRtColFld[ColPos] = "qtnd_of";
                break;
            case "GENERAL_FCL_QUOT_LABEL_PSS":
                this.arrRtColHdr[ColPos] = sdata[1];
                this.arrRtColFld[ColPos] = "qtnd_pss";
                break;
            case "GENERAL_FCL_QUOT_LABEL_BAF":
                this.arrRtColHdr[ColPos] = sdata[1];
                this.arrRtColFld[ColPos] = "qtnd_baf";
                break;
            case "GENERAL_FCL_QUOT_LABEL_ISPS":
                this.arrRtColHdr[ColPos] = sdata[1];
                this.arrRtColFld[ColPos] = "qtnd_isps";
                break;
            case "GENERAL_FCL_QUOT_LABEL_HAULAGE":
                this.arrRtColHdr[ColPos] = sdata[1];
                this.arrRtColFld[ColPos] = "qtnd_haulage";
                break;
            case "GENERAL_FCL_QUOT_LABEL_IFS":
                this.arrRtColHdr[ColPos] = sdata[1];
                this.arrRtColFld[ColPos] = "qtnd_ifs";
                break;
        }
    }




    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = [];
        if (this.mode == 'ADD') {
            this.record = <Tbl_Cargo_Qtnm>{};
            this.records = <Tbl_Cargo_Qtnd_Fcl[]>[];
            this.pkid = this.gs.getGuid();
            this.init();
            this.NewRow();
        }
        if (this.mode == 'EDIT') {
            this.NewRow();
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
                this.records = <Tbl_Cargo_Qtnd_Fcl[]>response.records;
                this.mode = 'EDIT';
                if (this.record.rec_files_attached == "Y")
                    this.Foregroundcolor = "red";
                else
                    this.Foregroundcolor = "white";

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_Cargo_Qtnd_Fcl>{};
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

        if (this.records == null)
            this.records = <Tbl_Cargo_Qtnd_Fcl[]>[];

        var rec = this.records.find(rec => rec.qtnd_pkid == this.qtnd_pkid);
        if (rec == null) {
            rec = <Tbl_Cargo_Qtnd_Fcl>{};
            rec.qtnd_pkid = this.qtnd_pkid;
            rec.qtnd_parent_id = this.pkid;
            this.records.push(rec);
        }
        rec.qtnd_pol_code = this.polCode;
        rec.qtnd_pol_id = this.polId;
        rec.qtnd_pol_name = this.polName;
        rec.qtnd_pod_code = this.podCode;
        rec.qtnd_pod_id = this.podId;
        rec.qtnd_pod_name = this.podName;
        rec.qtnd_carrier_code = this.carrCode;
        rec.qtnd_carrier_id = this.carrId;
        rec.qtnd_carrier_name = this.carrName;
        rec.qtnd_transtime = this.transitTime;
        rec.qtnd_routing = this.routing
        rec.qtnd_cntr_type = this.cntrType
        rec.qtnd_etd = this.etd;
        rec.qtnd_cutoff = this.cutOff;
        rec[this.arrRtColFld[0]] = this.arrRtVal[this.arrRtColFld[0]];
        rec[this.arrRtColFld[1]] = this.arrRtVal[this.arrRtColFld[1]];
        rec[this.arrRtColFld[2]] = this.arrRtVal[this.arrRtColFld[2]];
        rec[this.arrRtColFld[3]] = this.arrRtVal[this.arrRtColFld[3]];
        rec[this.arrRtColFld[4]] = this.arrRtVal[this.arrRtColFld[4]];
        rec[this.arrRtColFld[5]] = this.arrRtVal[this.arrRtColFld[5]];
        rec.qtnd_tot_amt = this.totAmt;

        this.NewRow();

    }

    NewRow() {
        this.lblSave = "Add Row";
        this.qtnd_pkid = this.gs.getGuid();
        this.InitDetail();
        // Txt_Pol_code.Focus();
    }
    InitDetail() {
        this.polId = "";
        this.polCode = "";
        this.polName = "";
        this.podId = "";
        this.podCode = "";
        this.podName = "";
        this.carrId = "";
        this.carrCode = "";
        this.carrName = "";
        this.transitTime = "";
        this.routing = "";
        this.cntrType = "";
        this.etd = "";
        this.cutOff = "";
        this.arrRtVal[this.arrRtColFld[0]] = 0;
        this.arrRtVal[this.arrRtColFld[1]] = 0;
        this.arrRtVal[this.arrRtColFld[2]] = 0;
        this.arrRtVal[this.arrRtColFld[3]] = 0;
        this.arrRtVal[this.arrRtColFld[4]] = 0;
        this.arrRtVal[this.arrRtColFld[5]] = 0;
        this.totAmt = 0;

    }
    EditRow(_rec: Tbl_Cargo_Qtnd_Fcl) {
        this.qtnd_pkid = _rec.qtnd_pkid;
        this.polId = _rec.qtnd_pol_id;
        this.polCode = _rec.qtnd_pol_code;
        this.polName = _rec.qtnd_pol_name;
        this.podId = _rec.qtnd_pod_id;
        this.podCode = _rec.qtnd_pod_code;
        this.podName = _rec.qtnd_pod_name;
        this.carrId = _rec.qtnd_carrier_id;
        this.carrCode = _rec.qtnd_carrier_code;
        this.carrName = _rec.qtnd_carrier_name;
        this.transitTime = _rec.qtnd_transtime;
        this.routing = _rec.qtnd_routing;
        this.cntrType = _rec.qtnd_cntr_type;
        this.etd = _rec.qtnd_etd;
        this.cutOff = _rec.qtnd_cutoff;
        this.arrRtVal[this.arrRtColFld[0]] = _rec[this.arrRtColFld[0]];
        this.arrRtVal[this.arrRtColFld[1]] = _rec[this.arrRtColFld[1]];
        this.arrRtVal[this.arrRtColFld[2]] = _rec[this.arrRtColFld[2]];
        this.arrRtVal[this.arrRtColFld[3]] = _rec[this.arrRtColFld[3]];
        this.arrRtVal[this.arrRtColFld[4]] = _rec[this.arrRtColFld[4]];
        this.arrRtVal[this.arrRtColFld[5]] = _rec[this.arrRtColFld[5]];
        this.totAmt = _rec.qtnd_tot_amt;
        this.lblSave = "Update Row";
        //Dispatcher.BeginInvoke(() => { Txt_Pol_code.Focus(); });
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
            this.GetContactMemo(this.record.qtnm_to_id);
        }
        if (_Record.controlname == "SALESMAN") {
            this.record.qtnm_salesman_id = _Record.id;
            this.record.qtnm_salesman_name = _Record.name;
        }
        if (_Record.controlname == "POL") {
            this.polId = _Record.id;
            this.polCode = _Record.code;
            this.polName = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.podId = _Record.id;
            this.podCode = _Record.code;
            this.podName = _Record.name;
        }
        if (_Record.controlname == "CARR") {
            this.carrId = _Record.id;
            this.carrCode = _Record.code;
            this.carrName = _Record.name;
        }

        // if (_Record.controlname == "INVOICE-CODE") {
        //     this.records.forEach(rec => {
        //         if (rec.qtnd_desc_id == _Record.uid) {
        //             rec.qtnd_desc_code = _Record.code;
        //             rec.qtnd_desc_name = _Record.name;
        //         }
        //     });
        // }

    }

    OnChange(field: string) {
    }
    onFocusout(field: string) {
    }

    onBlur(fld: any) {
        if (fld.field.toString().toUpperCase().includes('ARRRTVAL'))
            this.FindTotAmt();
    }

    FindTotAmt() {
        let _amt: number = 0;
        for (let i = 0; i < this.arrRtVal.length; i++)
            _amt += this.arrRtVal[this.arrRtColFld[i]];
        this.totAmt = this.gs.roundNumber(_amt, 2);
    }

    BtnNavigation(action: string) {
        switch (action) {
            case 'ATTACHMENT': {
                this.attach_title = 'Documents';
                this.attach_parentid = this.pkid;
                this.attach_subid = '';
                this.attach_type = 'QUOT-LCL';
                this.attach_typelist = [];
                this.attach_tablename = 'cargo_qtnm';
                this.attach_tablepkcolumn = 'qtnm_pkid';
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

    RemoveRow(_rec: Tbl_Cargo_Qtnd_Fcl) {
        this.records.splice(this.records.findIndex(rec => rec.qtnd_pkid == _rec.qtnd_pkid), 1);
    }

    GetMessage(_msgType: string) {
        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";

        var SearchData = this.gs.UserInfo;
        SearchData.msgtype = _msgType;
        SearchData.filepath = filepath;

        this.mainService.GetMessage(SearchData)
            .subscribe(response => {
                this.record.qtnm_subjects = response.message;
                // Txt_Subject.Focus();

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }

    GetContactMemo(_contactId: string) {
        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _contactId;
        SearchData.SPATH = filepath;

        this.mainService.GetContactMemo(SearchData)
            .subscribe(response => {
                this.record.qtnm_subjects = response.message;
                // Txt_Subject.Focus();
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }

}
