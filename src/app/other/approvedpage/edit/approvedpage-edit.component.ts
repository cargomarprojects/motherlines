import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { ApprovedPageService } from '../../../other/services/approvedpage.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_approved, Tbl_Cargo_Approved } from '../../../other/models/tbl_cargo_approved';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { Table_Cargo_Payrequest } from 'src/app/businessmodule/models/table_cargo_payrequest';
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
  hblrecords: Tbl_Cargo_Approved[] = [];
  invrecords: Tbl_Cargo_Approved[] = [];

  private mbl_pkid: string;
  private mbl_refno: string;
  private doc_type: string;
  private req_type: string;

  private pkid: string;
  private menuid: string;
  private mode: string;
  private errorMessage: string;
  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;
  private oprgrp: string = "GENERAL";


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
    this.mbl_refno = options.mbl_refno;
    this.doc_type = options.doc_type;
    this.req_type = options.req_type;
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

    this.record.ca_pkid = this.pkid;
    this.record.ca_date = this.gs.defaultValues.today;
    this.record.ca_user_name = this.gs.user_name;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.rec_created_by = this.gs.user_code;
    this.record.ca_is_approved = "N";
    this.record.ca_is_ar_issued = "N";
    this.record.ca_ref_id = this.mbl_pkid;
    this.record.ca_ref_no = this.mbl_refno;
    this.record.ca_type = "RELEASE WITHOUT OBL";
    this.record.ca_doc_type = this.doc_type;
    this.record.ca_is_ar_issued_bool = false;
    this.record.ca_req_no_str='';
    // this.csdate_field.Focus();
  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_Cargo_Approved>response.record;
        this.mode = 'EDIT';
        this.record.ca_is_ar_issued_bool = this.record.ca_is_ar_issued == "Y" ? true : false;
        this.record.ca_req_no_str = this.record.ca_req_no.toString().padStart(6, '0');

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
          if (this.mode == "ADD" && response.code != '') {
            this.record.ca_req_no = response.code;
            this.record.ca_req_no_str = this.record.ca_req_no.toString().padStart(6, '0');
          }

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

  SelectHouse(_rec: Tbl_Cargo_Approved) {
    this.hblrecords.forEach(Rec => {
      if (Rec.ca_hbl_no != _rec.ca_hbl_no)
        Rec.ca_hbl_selected = false;
    })
    this.record.ca_hbl_no = _rec.ca_hbl_no;
    this.record.ca_hbl_id = _rec.ca_hbl_id;
    this.record.ca_consignee_id = _rec.ca_consignee_id;
    this.record.ca_consignee_name = _rec.ca_consignee_name;
  }

  SelectInvoice(_rec: Tbl_Cargo_Approved) {
    this.invrecords.forEach(Rec => {
      if (Rec.ca_inv_no != _rec.ca_inv_no)
        Rec.ca_inv_selected = false;
    })
    this.record.ca_inv_no = _rec.ca_inv_no;
    this.record.ca_inv_id = _rec.ca_inv_id;
    this.record.ca_customer_name = _rec.ca_customer_name;
  }

}
