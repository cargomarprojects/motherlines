import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { ApprovedPageService } from '../../../other/services/approvedpage.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_approved , Tbl_Cargo_Approved } from '../../../other/models/tbl_cargo_approved';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
//import { DateComponent } from '../../../shared/Date/date.component';

@Component({
  selector: 'app-approvedpage-edit',
  templateUrl: './approvedpage-edit.component.html'
})
export class ApprovedPageEditComponent implements OnInit {

  @ViewChild('is_drop') is_drop_field: ElementRef;
 // @ViewChild(' csdate') csdate_field: DateComponent;
  @ViewChild('to_name') to_name_field: InputBoxComponent;
  @ViewChild('deliver_to_name') deliver_to_name_field: InputBoxComponent;
  
  // @ViewChild('hbl_shipment_stage') hbl_shipment_stage_field: ElementRef;
  //@ViewChild('hbl_shipper_code') hbl_shipper_code_field: AutoComplete2Component;

  record: Tbl_Cargo_Approved = <Tbl_Cargo_Approved>{};

  private mbl_pkid: string;
  private pkid: string;
  private menuid: string;
  private mode: string;
  private errorMessage: string;
  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;
  private oprgrp: string = "GENERAL";
  private refno: string = "";

  private IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: ApprovedPageService,
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);

    this.menuid = options.menuid;
    this.pkid = options.pkid;
    this.mbl_pkid = options.mbl_pkid;
    this.oprgrp = options.mbl_mode;
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
      this.record = <Tbl_Cargo_Approved>{};
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    var curr_date = new Date();
    var curr_hh = curr_date.getHours();

    // this.record.cs_refno = this.refno;
    // this.record.cs_mbl_id = this.mbl_pkid;
    // this.record.cs_date = this.gs.defaultValues.today;
    // if (curr_hh >= 12)
    //   this.record.cs_ampm = "PM";
    // else
    //   this.record.cs_ampm = "AM";
    // this.record.cs_to_id = '';
    // this.record.cs_to_code = '';
    // this.record.cs_to_name = '';
    // this.record.cs_to_tel = '';
    // this.record.cs_to_fax = '';
    // this.record.cs_from_id = '';
    // this.record.cs_from_name = '';
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

    // this.record.rec_created_by = this.gs.user_code;
    // this.record.rec_created_date = this.gs.defaultValues.today;

    // this.record.cs_is_drop_bool = false;
    // this.record.cs_is_pick_bool = false;
    // this.record.cs_is_receipt_bool = false;
    // this.record.cs_is_check_bool = false;
    // this.record.cs_is_bl_bool = false;
    // this.record.cs_is_oth_bool = false;

   // this.csdate_field.Focus();

  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.MBL_ID = this.mbl_pkid;
    SearchData.DEFAULT_MESSENGER_ID = this.gs.MESSENGER_PKID;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_Cargo_Approved>response.record;
        this.mode = 'EDIT';
        // this.record.cs_is_drop_bool = this.record.cs_is_drop == "Y" ? true : false;
        // this.record.cs_is_pick_bool = this.record.cs_is_pick == "Y" ? true : false;
        // this.record.cs_is_receipt_bool = this.record.cs_is_receipt == "Y" ? true : false;
        // this.record.cs_is_check_bool = this.record.cs_is_check == "Y" ? true : false;
        // this.record.cs_is_bl_bool = this.record.cs_is_bl == "Y" ? true : false;
        // this.record.cs_is_oth_bool = this.record.cs_is_oth == "Y" ? true : false;

        //this.hbl_houseno_field.nativeElement.focus();

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  ChkBLClick() {
    // if (this.mode == "ADD" && this.record.cs_mbl_no != null) {
    //   if (this.record.cs_is_bl_bool == true)
    //     this.record.cs_bl_det = this.record.cs_mbl_no;
    //   else
    //     this.record.cs_bl_det = "";
    // }
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
    this.SaveParent();
    const saveRecord = <vm_tbl_cargo_approved>{};
    saveRecord.record = this.record;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
        //   if (this.mode == "ADD" && response.code != '')
        //     this.record.cs_refno = response.code;
          this.mode = 'EDIT';
          this.errorMessage = 'Save Complete';
          alert(this.errorMessage);
        }
      //  this.csdate_field.Focus();
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

    // if (this.gs.isBlank(this.record.cs_date)) {
    //   bRet = false;
    //   this.errorMessage = "Date cannot be blank";
    //   alert(this.errorMessage);
    //  // this.csdate_field.Focus();
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

    // if (_Record.controlname == "TO-CODE") {
    //   this.record.cs_to_id = _Record.id;
    //   this.record.cs_to_code = _Record.code;
    //   this.record.cs_to_name = _Record.name;
    //   if (_Record.col8 != "")
    //     this.record.cs_to_name = _Record.col8;

    //   this.record.cs_to_tel = _Record.col6;
    //   this.record.cs_to_fax = _Record.col7;
    //   this.to_name_field.focus();
    // }

    // if (_Record.controlname == "FROM-CODE") {
    //   this.record.cs_from_id = _Record.id;
    //   this.record.cs_from_name = _Record.name;
    //   if (_Record.col8 != "")
    //     this.record.cs_from_name = _Record.col8;
    //   this.is_drop_field.nativeElement.focus();
    // }
    // if (_Record.controlname == "DELIVER-TO") {
    //   this.record.cs_deliver_to_id = _Record.id;
    //   this.record.cs_deliver_to_name = _Record.name;
    //   if (_Record.col8 != "")
    //     this.record.cs_deliver_to_name = _Record.col8;
    //   this.LoadDeliveryAddress();
    // }

  }

  LoadDeliveryAddress() {
    // if (this.gs.isBlank(this.record.cs_deliver_to_id))
    //   return;

    // this.errorMessage = '';
    // var SearchData = this.gs.UserInfo;
    // SearchData.pkid = this.record.cs_deliver_to_id;
    // this.mainService.LoadDeliveryAddress(SearchData)
    //   .subscribe(response => {
    //     let dRec: Tbl_cargo_slip = <Tbl_cargo_slip>{};
    //     dRec = <Tbl_cargo_slip>response.record;

    //     if (dRec != null) {
    //       this.record.cs_deliver_to_add1 = dRec.cs_deliver_to_add1;
    //       this.record.cs_deliver_to_add2 = dRec.cs_deliver_to_add2;
    //       this.record.cs_deliver_to_add3 = dRec.cs_deliver_to_add3;
    //       this.record.cs_deliver_to_attn = dRec.cs_deliver_to_attn;
    //       this.record.cs_deliver_to_tel = dRec.cs_deliver_to_tel;
    //     }

    //     this.deliver_to_name_field.focus();

    //   }, error => {
    //     this.errorMessage = this.gs.getError(error);
    //   });

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
