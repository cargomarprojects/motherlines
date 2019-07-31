import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
//import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { DevanService } from '../services/devan.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Cargo_Imp_Devan_Instruction, vm_Tbl_Cargo_Imp_Devan_Instruction } from '../models/tbl_cargo_Imp_devan_instruction';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-devan',
    templateUrl: './devan.component.html'
})
export class DevanComponent implements OnInit {

   // @ViewChild('request_to_code') request_to_code_ctrl: AutoComplete2Component;
    @ViewChild('request_to_name') request_to_name_ctrl: InputBoxComponent;
    @ViewChild('cargo_loc_name') cargo_loc_name_ctrl: InputBoxComponent;
    record: Tbl_Cargo_Imp_Devan_Instruction = <Tbl_Cargo_Imp_Devan_Instruction>{};

    // 15-07-2019 Created By Ajith  

    private pkid: string;
    private menuid: string;
    private mode: string;
    private title: string = '';
    private isAdmin: boolean;
    
    private errorMessage: string;

    IsLocked: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: DevanService,
    ) { }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);
        this.pkid = options.pkid;
        this.menuid = options.menuid;
        //this.mode = 'EDIT';
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.title = '';
        this.isAdmin = this.gs.IsAdmin(this.menuid);
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
        // if (this.mode == 'ADD') {
        //     this.record = <Tbl_Cargo_Imp_Devan_Instruction>{};
        //     this.init();
        // }
        // if (this.mode == 'EDIT') {
        //     this.GetRecord();
        // }

        this.GetRecord();
    }

    init() {
        this.record.di_parent_id = this.pkid;
        this.record.di_request_to_id = '';
        this.record.di_cargo_loc_id = '';
        this.record.di_remark1 = '';
        this.record.di_remark2 = '';
        this.record.di_remark3 = '';
        this.record.di_request_to_code = '';
        this.record.di_request_to_name = '';
        this.record.di_request_to_addr1 = '';
        this.record.di_request_to_addr2 = '';
        this.record.di_request_to_addr3 = '';
        this.record.di_request_to_addr4 = '';
        this.record.di_cargo_loc_code = '';
        this.record.di_cargo_loc_name = '';
        this.record.di_cargo_loc_addr1 = '';
        this.record.di_cargo_loc_addr2 = '';
        this.record.di_cargo_loc_addr3 = '';
        this.record.di_cargo_loc_addr4 = '';
        this.record.di_is_devan_sent = false;
        this.record.di_devan_date = '';
       // this.request_to_code_ctrl.Focus();

    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.mode = response.mode;
                this.record = <Tbl_Cargo_Imp_Devan_Instruction>response.record;
               // this.request_to_code_ctrl.Focus();
                // if (this.mode == 'ADD')
                //     this.actionHandler();
                // else {
                //     this.record = <Tbl_Cargo_Imp_Devan_Instruction>response.record;
                //     this.request_to_code_ctrl.nativeElement.Focus();

                //     this.CheckData();
                // }
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    CheckData() {
        /*
            if (Lib.IsShipmentClosed("SEA EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
            {
                IsLocked = true;
                LBL_LOCK.Content = "LOCKED";
                CmdSave.IsEnabled = false;
                CmdCopyCntr.IsEnabled = false;
            }
            else
                LBL_LOCK.Content = "UNLOCKED";
        
        */
    }



    Save() {

        if (!this.Allvalid())
            return;
 
        const saveRecord = <vm_Tbl_Cargo_Imp_Devan_Instruction>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this.pkid;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                this.mode = response.mode;
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";
        if ( this.gs.isBlank(this.record.di_request_to_id)) {
          bRet = false;
          this.errorMessage = "Request To cannot be empty";
          alert(this.errorMessage);
        //  this.request_to_code_ctrl.Focus();
          return bRet;
        }
        
        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
         
        if (_Record.controlname == "REQUEST-TO") {
            this.record.di_request_to_id = _Record.id;
            this.record.di_request_to_code = _Record.code;
            this.record.di_request_to_name = _Record.name.toString();
            if (_Record.col8.toString() != "")
                this.record.di_request_to_name = _Record.col8.toString();

            this.record.di_request_to_addr1 = _Record.col1.toString();
            this.record.di_request_to_addr2 = _Record.col2.toString();
            this.record.di_request_to_addr3 = this.gs.GetAttention(_Record.col5.toString());
            this.record.di_request_to_addr4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
            this.request_to_name_ctrl.focus();
            //  Dispatcher.BeginInvoke(() => { Txt_Request_To_Name.Focus(); });

        }
        if (_Record.controlname == "CARGO-LOC")  {

            this.record.di_cargo_loc_id = _Record.id;
            this.record.di_cargo_loc_code = _Record.code;
            this.record.di_cargo_loc_name = _Record.name.toString();
            if (_Record.col8.toString() != "")
            this.record.di_cargo_loc_name = _Record.col8.toString();
            this.record.di_cargo_loc_addr1 = _Record.col1.toString();
            this.record.di_cargo_loc_addr2 = _Record.col2.toString();
            this.record.di_cargo_loc_addr3 = this.gs.GetAttention(_Record.col5.toString());
            this.record.di_cargo_loc_addr4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
            this.cargo_loc_name_ctrl.focus();
            // Dispatcher.BeginInvoke(() => { Txt_Cargo_Loc_Name.Focus(); });

        }
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
            //   case 'cust_comm_inv': {
            //     this.record.cust_comm_inv = this.record.cust_comm_inv.toUpperCase();
            //     break;
            //   }
            //   case 'cust_fumi_cert': {
            //     this.record.cust_fumi_cert = this.record.cust_fumi_cert.toUpperCase();
            //     break;
            //   }
            //   case 'cust_insp_chrg': {
            //     this.record.cust_insp_chrg = this.record.cust_insp_chrg.toUpperCase();
            //     break;
            //   }
            //   case 'cust_remarks': {
            //     this.record.cust_remarks = this.record.cust_remarks.toUpperCase();
            //     break;
            //   }
            //   case 'cntr_pieces': {
            //     rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
            //     break;
            //   }
        }
    }

}
