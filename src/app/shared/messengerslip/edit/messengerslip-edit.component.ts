import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { MessengerSlipService } from '../../services/messengerslip.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_slip,Tbl_cargo_slip } from '../../models/tbl_cargo_slip';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
 
@Component({
  selector: 'app-messengerslip-edit',
  templateUrl: './messengerslip-edit.component.html'
})
export class MessengerSlipEditComponent implements OnInit {

  @ViewChild('hbl_houseno') hbl_houseno_field: ElementRef;
  @ViewChild('hbl_shipment_stage') hbl_shipment_stage_field: ElementRef;
  @ViewChild('hbl_shipper_code') hbl_shipper_code_field: AutoComplete2Component;
  
  record: Tbl_cargo_slip = <Tbl_cargo_slip>{};
 
  private mblid: string;
  private pkid: string;
  private menuid: string;
  private mode: string;
  private errorMessage: string;
  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  
  private IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: MessengerSlipService,
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.mode = options.mode;
    this.mblid = options.mblid;
    
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
      this.record = <Tbl_cargo_slip>{};
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.cs_mbl_id = this.pkid;
    this.record.cs_mbl_id = this.mblid;
    
      this.hbl_houseno_field.nativeElement.focus();
    
  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_slip>response.record;
        this.mode = 'EDIT';
       this.hbl_houseno_field.nativeElement.focus();
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
   
    const saveRecord = <vm_tbl_cargo_slip>{};
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
        //     this.record.mbl_refno = response.code;
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

    // if (this.gs.isBlank(this.record.hbl_houseno)) {
    //   bRet = false;
    //   this.errorMessage = "House BL# cannot be blank";
    //   alert(this.errorMessage);
    //   this.hbl_houseno_field.nativeElement.focus();
    //   return bRet;
    // }


    return bRet;
  }


  Close() {
    this.location.back();
  }


  LovSelected(_Record: SearchTable) {

    // if (_Record.controlname == "SHIPPER") {
    //   this.record.hbl_shipper_id = _Record.id;
    //   this.record.hbl_shipper_code = _Record.code;
    //   this.record.hbl_shipper_name = _Record.name;
    //   if (_Record.col8 != "")
    //     this.record.hbl_shipper_name = _Record.col8;

    //   this.record.hbl_shipper_add1 = _Record.col1;
    //   this.record.hbl_shipper_add2 = _Record.col2;
    //   this.record.hbl_shipper_add3 = _Record.col3;
    //   this.record.hbl_shipper_add4 = this.gs.GetAttention(_Record.col5.toString());
    //   this.record.hbl_shipper_add5 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
    //   if (_Record.col9 == "Y") {
    //     this.SearchRecord("MsgAlertBox", this.record.hbl_shipper_id);
    //   }
    // }
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
      case 'mbl_refno': {
        // this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      
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
