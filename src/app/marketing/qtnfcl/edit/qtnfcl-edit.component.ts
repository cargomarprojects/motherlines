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
    arrRtVal: any[] =  [{'qtnd_of':0}, {'qtnd_pss':0}, {'qtnd_baf':0}, {'qtnd_isps':0}, {'qtnd_haulage':0}, {'qtnd_ifs':0}];  

    totRt: number = 0;
    //List
    tblRtColHdr: string[] = ['OFF', 'PSS', 'BAF', 'ISPS', 'HAULAGE', 'IFS'];
    tblRtColFld: string[] = ['qtnd_of', 'qtnd_pss', 'qtnd_baf', 'qtnd_isps', 'qtnd_haulage', 'qtnd_ifs'];


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
            this.records = <Tbl_Cargo_Qtnd_Fcl[]>[];
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
        var rec = <Tbl_Cargo_Qtnd_Fcl>{};
        rec.qtnd_pkid = this.gs.getGuid();
        rec.qtnd_parent_id = this.pkid,
            rec.qtnd_pol_code = '';
        rec.qtnd_pol_id = '';
        rec.qtnd_pol_name = '';
        rec.qtnd_pod_code = '';
        rec.qtnd_pod_id = '';
        rec.qtnd_pod_name = '';
        rec.qtnd_carrier_code = '';
        rec.qtnd_carrier_id = '';
        rec.qtnd_carrier_name = '';
        rec.qtnd_transtime = '';
        rec.qtnd_routing = '';
        rec.qtnd_cntr_type = '';
        rec.qtnd_etd = '';
        rec.qtnd_cutoff = '';
        rec.qtnd_of = 0;
        rec.qtnd_pss = 0;
        rec.qtnd_baf = 0;
        rec.qtnd_isps = 0;
        rec.qtnd_ifs = 0;
        rec.qtnd_haulage = 0;
        rec.qtnd_tot_amt = 0;

        this.records.push(rec);
    }
    NewRow() {

        // if (CmbList != null && UsrDeleteRec != null)
        // {
        //     CmbList.Remove(UsrDeleteRec);
        //     UsrDeleteRec = null;
        // }

        // if (this.UserList != null && this.UsrDeleteId != '') {
        //     this.UserList.splice(this.UserList.findIndex(rec => rec.id == this.UsrDeleteId), 1);
        //     this.UsrDeleteId = '';
        // }

        // this.mode = "ADD";
        // this.pkid = this.gs.getGuid();
        // this.record = <Table_Cargo_Followup>{};
        // this.record.cf_pkid = this.pkid;
        // this.record.cf_master_id = this.cf_masterid;
        // this.record.cf_user_id = this.gs.user_pkid;
        // this.record.rec_created_by = this.gs.user_code;
        // this.record.cf_followup_date = this.gs.defaultValues.today;
        // this.record.cf_assigned_id = this.gs.user_pkid;
        // this.record.cf_assigned_code = this.gs.user_code;
        // this.record.cf_assigned_name = this.gs.user_name;
        // this.record.cf_remarks = '';
        // this.lblSave = "Save";
        //Txtmemo.Focus();
    }

    AddData()
    {
        this.lblSave = "Add Row";
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
        this.totRt = 0;

    }
    EditRow(_rec:Tbl_Cargo_Qtnd_Fcl)
    {
        this.polId =_rec.qtnd_pol_id;
        this.polCode = _rec.qtnd_pol_code;
        this.polName = _rec.qtnd_pol_name;
        this.podId = _rec.qtnd_pod_id;
        this.podCode = _rec.qtnd_pod_code;
        this.podName =_rec.qtnd_pod_name;
        this.carrId =_rec.qtnd_carrier_id;
        this.carrCode = _rec.qtnd_carrier_code;
        this.carrName = _rec.qtnd_carrier_name;
        this.transitTime = _rec.qtnd_transtime;
        this.routing = _rec.qtnd_routing;
        this.cntrType = _rec.qtnd_cntr_type;
        this.etd = _rec.qtnd_etd;
        this.cutOff = _rec.qtnd_cutoff;
        this.arrRtVal[this.arrRtColFld[0]] =_rec.qtnd_of;
        this.arrRtVal[this.arrRtColFld[1]] =_rec.qtnd_pss;
        this.arrRtVal[this.arrRtColFld[2]] =_rec.qtnd_baf;
        this.arrRtVal[this.arrRtColFld[3]] = _rec.qtnd_isps;
        this.arrRtVal[this.arrRtColFld[4]] =_rec.qtnd_ifs;
        this.arrRtVal[this.arrRtColFld[5]] = _rec.qtnd_haulage;
        this.totRt = _rec.qtnd_tot_amt;
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
        if (_Record.controlname == "POR") {
            this.record.qtnm_por_id = _Record.id;
            this.record.qtnm_por_code = _Record.code;
            this.record.qtnm_por_name = _Record.name;
        }
        if (_Record.controlname == "POL") {
            this.record.qtnm_pol_id = _Record.id;
            this.record.qtnm_pol_code = _Record.code;
            this.record.qtnm_pol_name = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.record.qtnm_pod_id = _Record.id;
            this.record.qtnm_pod_code = _Record.code;
            this.record.qtnm_pod_name = _Record.name;
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

    onBlur(field: string) {
        switch (field) {

            case 'qtnm_kgs': {
                this.record.qtnm_kgs = this.gs.roundNumber(this.record.qtnm_kgs, 3);
                break;
            }
            case 'qtnm_lbs': {
                this.record.qtnm_lbs = this.gs.roundNumber(this.record.qtnm_lbs, 3);
                break;
            }
            case 'qtnm_cbm': {
                this.record.qtnm_cbm = this.gs.roundNumber(this.record.qtnm_cbm, 3);
                break;
            }
            case 'hbl_cft': {
                this.record.qtnm_cft = this.gs.roundNumber(this.record.qtnm_cft, 3);
                break;
            }
        }
    }

    FindWeight(_type: string) {
        if (_type == "Kgs2Lbs")
            this.record.qtnm_lbs = this.gs.Convert_Weight("KG2LBS", this.record.qtnm_kgs, 3);
        else if (_type == "Lbs2Kgs")
            this.record.qtnm_kgs = this.gs.Convert_Weight("LBS2KG", this.record.qtnm_lbs, 3);
        else if (_type == "Cbm2Cft")
            this.record.qtnm_cft = this.gs.Convert_Weight("CBM2CFT", this.record.qtnm_cbm, 3);
        else if (_type == "Cft2Cbm")
            this.record.qtnm_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.qtnm_cft, 3);
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

                if (_msgType == "LCLMSG6") {
                    this.record.qtnm_remarks = response.message;
                    //Txt_Remarks.Focus();
                }
                else {
                    this.record.qtnm_subjects = response.message;
                    // Txt_Subject.Focus();
                }

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
