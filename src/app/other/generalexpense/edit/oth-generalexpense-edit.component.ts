import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { OthGeneralExpenseService } from '../../services/oth-generalexpense.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_general, Tbl_cargo_container, vm_tbl_cargo_general } from '../../models/tbl_cargo_general';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-oth-generalexpense-edit',
  templateUrl: './oth-generalexpense-edit.component.html'
})
export class OthGeneralExpenseEditComponent implements OnInit {

  //   @ViewChild('mbl_no') mbl_no_field: ElementRef;
  //   @ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;

  record: Tbl_cargo_general = <Tbl_cargo_general>{};
  HblList: Tbl_cargo_general[] = [];

  // 24-05-2019 Created By Joy  

  private pkid: string;
  private menuid: string;

  private mode: string;
  private FALockStatus: string = "";
  private errorMessage: string;

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};
  EXPTYPE: string = "";
  MblStatusList: any[] = [];
  BlStatusList: any[] = [];

  refnoDisabled: boolean = false;
  refnoMaxLength: Number = 8;
  refnoFormat: string = 'Format -  GEYYYYMM'
  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: OthGeneralExpenseService,
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.mode = options.mode;
    this.EXPTYPE = options.exptype;
    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);

    this.refnoFormat = "Format - " + this.EXPTYPE.trim() + "YYYYMM";
    this.refnoMaxLength = 8;
    this.refnoDisabled = false;
    if (this.EXPTYPE.trim() == "PS" || this.EXPTYPE.trim() == "FA") {
      this.refnoFormat = "";
      this.refnoMaxLength = 15;
      if (this.EXPTYPE.trim() == "FA")
        this.refnoDisabled = true;
    }

    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {

    // if (this.gs.company_name == "MOTHERLINES INC USA") {
    //   this.MblStatusList = [{ "name": "NIL" }
    //     , { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }
    //     , { "name": "OMBL WITH LAX OFFICE" }, { "name": "OMBL SENT BY LAX OFFICE" }, { "name": "OMBL WITH NYC OFFICE" }
    //     , { "name": "OMBL SENT BY NYC OFFICE" }];
    // } else {
    //   this.MblStatusList = [{ "name": "NIL" }, { "name": "OMBL WITH OPERATION" },
    //   { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }];
    // }

    // this.BlStatusList = [{ "name": "NIL" }
    //   , { "name": "PENDING SEAWAY" }, { "name": "SEAWAY BILL" }
    //   , { "name": "PENDING TELEX RELEASED" }, { "name": "TELEX RELEASED" }];
  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_general>{};
     // this.records = <Tbl_cargo_container[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.mbl_pkid = this.pkid;
    this.record.mbl_no = '';
    this.record.mbl_cfno = 0;
    this.record.mbl_refno = '';
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_frt_status = '';
    this.record.mbl_handled_name = '';
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_general>response.record;
        this.mode = 'EDIT';
        this.CheckData();
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


  IsBLDupliation(no: string) {

    if (this.gs.isBlank(no))
      return;
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.blno = no;
    SearchData.stype = this.EXPTYPE;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.mode = this.mode;

    this.mainService.Isblnoduplication(SearchData)
      .subscribe(response => {
        if (response.retvalue) {
          this.errorMessage = response.retstring;
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });

  }


  GetFALockDetails(orgrefno: string) {
    this.FALockStatus = "";
    if (this.gs.isBlank(orgrefno) || this.EXPTYPE != 'FA')
      return;
    if (this.mode != "ADD")
      return;

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.orgrefno = orgrefno;
    this.mainService.GetFALockDetails(SearchData)
      .subscribe(response => {
        if (response.retvalue) {

          if (response.RefnoFA.trim().length > 0) {

            this.FALockStatus = response.RefnoFA;
            if (response.IsLockRefnoFA) {
              this.FALockStatus += " (LOCKED)";
              // CmdSave.IsEnabled = true;
            }
            else {
              this.FALockStatus += " (UNLOCKED)";
              // CmdSave.IsEnabled = false;
            }
          }

        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });

  }

  GetHouseDetails(orgrefno: string) {
    this.FALockStatus = "";
    if (this.EXPTYPE != 'FA')
      return;

     if(this.gs.isBlank(orgrefno))
     {
       this.errorMessage="Master Reference# Cannot be blank";
       return;
     }

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.orgrefno = orgrefno;
    this.mainService.GetHouseDetails(SearchData)
      .subscribe(response => {
        if (response.retvalue) {

          if (response.RefnoFA.trim().length > 0) {

            this.FALockStatus = response.RefnoFA;
            if (response.IsLockRefnoFA) {
              this.FALockStatus += " (LOCKED)";
              // CmdSave.IsEnabled = true;
            }
            else {
              this.FALockStatus += " (UNLOCKED)";
              // CmdSave.IsEnabled = false;
            }
          }

        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });

  }




  Save() {

    if (!this.Allvalid())
      return;

    const saveRecord = <vm_tbl_cargo_general>{};
    saveRecord.record = this.record;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.operationmode = this.EXPTYPE
    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD" && response.code != '')
            this.record.mbl_refno = response.code;
          this.mode = 'EDIT';
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
    if (this.record.mbl_ref_date == "") {
      bRet = false;
      this.errorMessage = "Ref Date cannot be blank";
      return bRet;
    }

    return bRet;
  }


  Close() {
    this.location.back();
  }

  LovSelected(_Record: SearchTable) {

    //   if (_Record.controlname == "AGENT") {
    //     this.record.mbl_agent_id = _Record.id;
    //     this.record.mbl_agent_name = _Record.name;
    //   }

    // Container
    // if (_Record.controlname == "CONTAINER TYPE") {
    //   this.records.forEach(rec => {
    //     if (rec.cntr_pkid == _Record.uid) {
    //       rec.cntr_type = _Record.code;
    //     }
    //   });
    // }
  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_cargo_loc_name': {
          this.GetFALockDetails(this.record.mbl_cargo_loc_name);//Mbl_NO
        break;
      }
      case 'mbl_refno': {

        this.IsBLDupliation(this.record.mbl_refno);
        break;
      }
    }
  }


  onBlur(field: string) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'mbl_cargo_loc_name': {
        this.record.mbl_cargo_loc_name = this.record.mbl_cargo_loc_name.toUpperCase();
        break;
      }
    }
  }


  BtnNavigation(action: string) {

    switch (action) {
      // case 'DELIVERY-ORDER': {
      //   let prm = {
      //     menuid: this.gs.MENU_OT_OPERATION_DELIVERY_ORDER,
      //     parentid: this.pkid,
      //     pickCategory:'OTHERS',
      //     islocked: false,
      //     origin: 'other-general-page'
      //   };
      //   this.gs.Naviagete('Silver.Other.Trans/DeliveryOrderList', JSON.stringify(prm));
      //   break;
      // }

      // case 'ARAP': {
      //   let prm = {
      //     menuid: this.gs.MENU_OT_OPERATION_ARAP,
      //     pkid: this.pkid,
      //     refno: this.record.mbl_refno,
      //     type: 'OT',
      //     origin: 'other-general-page',
      //   };
      //   this.gs.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
      //   break;
      // }



    }
  }


}
