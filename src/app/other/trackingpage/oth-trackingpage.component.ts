import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { OthTrackingPageService } from '../services/oth-trackingpage.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Cargo_Tracking_Status, vm_Tbl_Cargo_Tracking_Status } from '../models/tbl_cargo_tracking_status';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-oth-trackingpage',
  templateUrl: './oth-trackingpage.component.html'
})
export class OthTrackingPageComponent implements OnInit {

  //@ViewChild('mbl_no') mbl_no_field: ElementRef;
  trackrecords: Tbl_Cargo_Tracking_Status[] = [];
  trackmemorecord: Tbl_Cargo_Tracking_Status = <Tbl_Cargo_Tracking_Status>{};
  trackmemorecords: Tbl_Cargo_Tracking_Status[] = [];
  // 15-07-2019 Created By Ajith  

  private pkid: string;
  private parentType: string;
  private paramType: string;
  private menuid: string;
  private refno: string;
  private hideTracking: string = 'N';
  private oprgrp: string = '';
  private mode: string;
  private title: string = '';
  private isAdmin: boolean;
  private errorMessage: string;
  private selectedRowIndex: number = -1;
  IsLocked: boolean = false;
  private Memo_Mode: string = "ADD";
  private Memo_Id: string = "";
  private lblSaveMemo: string = "Save";
  private cmbNotes:string="";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: OthTrackingPageService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.parentType = options.parentType;
    this.paramType = options.paramType;
    this.hideTracking = options.hideTracking;
    this.oprgrp = options.oprgrp;
    this.refno = options.refno;
    // this.mode = 'ADD';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Tracking';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {

  }

  // NewRecord() {
  //   this.mode = 'ADD'
  //   this.actionHandler();
  // }

  actionHandler() {
    // this.errorMessage = '';
    // if (this.mode == 'ADD') {
    //   this.record = <Tbl_cargo_imp_desc>{};
    //   this.init();
    // }
    // if (this.mode == 'EDIT') {
    //   this.GetRecord();
    // }

    this.GetRecord();
  }

  init() {

    // this.record.parentid = this.pkid;
    // this.record.cargo_description = '';
    // this.record.cargo_marks = '';
    // this.record.cargo_packages = '';
    // this.record.cargo_ctr = 1;
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.parentType = this.parentType;
    SearchData.paramType = this.paramType;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.trackrecords = <Tbl_Cargo_Tracking_Status[]>response.records;
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

    const saveRecord = <vm_Tbl_Cargo_Tracking_Status>{};
    saveRecord.record = this.trackrecords;
    saveRecord.pkid = this.pkid;
    // saveRecord.source = this.source;
    //  saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
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
    if (this.pkid == "") {
      bRet = false;
      this.errorMessage = "Invalid ID";
      alert(this.errorMessage);
      return bRet;
    }

    return bRet;
  }


  Close() {
    this.location.back();
  }
  OnChange(field: string) {
    if (field == 'cmbNotes') {
      this.trackmemorecord.remarks=this.cmbNotes;
    }
  }

  onBlur(field: string, _rec: Tbl_Cargo_Tracking_Status = null) {
    switch (field) {
      //   case 'cargo_marks': {
      //     _rec.cargo_marks = _rec.cargo_marks.toUpperCase();
      //     break;
      //   }
      //   case 'cargo_description': {
      //     _rec.cargo_description = _rec.cargo_description.toUpperCase();
      //     break;
      //   }
    }
  }

  AddRow() {
    var rec = <Tbl_Cargo_Tracking_Status>{};
    // rec.parentid = this.pkid;
    // rec.cargo_marks = "",
    //   rec.cargo_description = "",
    //   rec.cargo_ctr = this.findNextCtr();

    // this.descrecords.push(rec);
  }

  //   findNextCtr() {
  //     let max: number = 16;
  //     this.trackrecords.forEach(Rec => {
  //       max = Rec.cargo_ctr > max ? Rec.cargo_ctr : max;
  //     })
  //     return max + 1;
  //   }


  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }

  AttachRow(_rec: Tbl_Cargo_Tracking_Status) {

  }
  RemoveRow(_rec: Tbl_Cargo_Tracking_Status) {

  }
  //   RemoveRow(_rec: Tbl_cargo_imp_desc) {
  //     this.descrecords.splice(this.descrecords.findIndex(rec => rec.cargo_ctr == _rec.cargo_ctr), 1);
  //   }

  private NewRecord() {
    this.Memo_Mode = "ADD";
    this.Memo_Id = this.gs.getGuid();
    this.trackmemorecord = <Tbl_Cargo_Tracking_Status>{};
    this.trackmemorecord.date = this.gs.defaultValues.today;
    this.trackmemorecord.remarks = ''
    this.lblSaveMemo = "Save";
    //Txtmemo.Focus();
  }
  private EditRow(_rec: Tbl_Cargo_Tracking_Status) {
    //Dt_Date.IsEnabled = false;
    this.Memo_Id = _rec.param_id.toString();
    this.Memo_Mode = "EDIT";
    this.trackmemorecord.date = _rec.date;
    this.trackmemorecord.remarks = _rec.remarks.toString();
  }

  SaveMemo(){
    const saveRecord = <vm_Tbl_Cargo_Tracking_Status>{};
    saveRecord.memorecord = this.trackmemorecord;
    saveRecord.pkid = this.pkid;
    // saveRecord.source = this.source;
    //  saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.SaveMemo(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {

          if (this.Memo_Mode == "ADD")
          {
             this.trackmemorecord.rec_created_by = this.gs.user_code; 
            this.trackmemorecords.push(this.trackmemorecord);
             // Grid_Memo.ScrollIntoView(memo_Record, Grid_Memo.Columns[0]);
              //Grid_Memo.Focus();
          }
         this.NewRecord();

          // this.errorMessage = 'Save Complete';
          // alert(this.errorMessage);


        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }
}
