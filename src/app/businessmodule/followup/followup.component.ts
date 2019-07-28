import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { FollowupService } from '../services/followup.service';
import { User_Menu } from '../../core/models/menum';
import { Table_Cargo_Followup, vm_Table_Cargo_Followup } from '../models/table_cargo_followup';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-followup',
  templateUrl: './followup.component.html'
})
export class FollowupComponent implements OnInit {

  //@ViewChild('mbl_no') mbl_no_field: ElementRef;
  records: Table_Cargo_Followup[] = [];
  record: Table_Cargo_Followup = <Table_Cargo_Followup>{};
 
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
  private cmbNotes: string = "";
  private FollowupList: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: FollowupService
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
  this.SearchRecord('loadcombo');
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
        this.records = <Table_Cargo_Followup[]>response.records;
        this.NewRecord();
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

    const saveRecord = <vm_Table_Cargo_Followup>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.record;
    saveRecord.pkid = this.pkid;
     
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
      this.record.cf_remarks = this.cmbNotes;
    }
  }

  onBlur(field: string, _rec: Table_Cargo_Followup = null) {
    switch (field) {
      case 'remarks': {
        _rec.cf_remarks = _rec.cf_remarks.toUpperCase();
        break;
      }
      
    }
  }

  AddRow() {
    var rec = <Table_Cargo_Followup>{};
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

  
  RemoveRow(_rec: Table_Cargo_Followup) {

  }
  //   RemoveRow(_rec: Tbl_cargo_imp_desc) {
  //     this.descrecords.splice(this.descrecords.findIndex(rec => rec.cargo_ctr == _rec.cargo_ctr), 1);
  //   }

  private NewRecord() {
    this.Memo_Mode = "ADD";
    this.Memo_Id = this.gs.getGuid();
    this.record = <Table_Cargo_Followup>{};
    this.record.rec_created_by = this.gs.user_code;
    // this.trackmemorecord.param_id = this.Memo_Id;
    // this.trackmemorecord.date = this.gs.defaultValues.today;
    // this.trackmemorecord.remarks = ''
    this.lblSaveMemo = "Save";
    //Txtmemo.Focus();
  }
  private EditRow(_rec: Table_Cargo_Followup) {
    //Dt_Date.IsEnabled = false;
    this.Memo_Id = _rec.cf_pkid.toString();
    this.Memo_Mode = "EDIT";
   // this.trackmemorecord.param_id = this.Memo_Id;
    this.record.cf_followup_date   = _rec.cf_followup_date;
    this.record.cf_remarks = _rec.cf_remarks.toString();
    this.lblSaveMemo = "Update";
  }

//   SaveMemo() 
//   {
//     const saveRecord = <vm_Tbl_Cargo_Tracking_Status>{};
//     saveRecord.userinfo = this.gs.UserInfo;
//     saveRecord.memorecord = this.trackmemorecord;
//     saveRecord.pkid = this.pkid;
//     saveRecord.memoPkid = this.Memo_Id;
//     saveRecord.memoMode = this.Memo_Mode;
//     saveRecord.parentType = this.parentType;
  
//     this.mainService.SaveMemo(saveRecord)
//       .subscribe(response => {
//         if (response.retvalue == false) {
//           this.errorMessage = response.error;
//           alert(this.errorMessage);
//         }
//         else {

//           if (this.Memo_Mode == "ADD") {
//             this.trackmemorecords.push(this.trackmemorecord);
//             // Grid_Memo.ScrollIntoView(memo_Record, Grid_Memo.Columns[0]);
//             //Grid_Memo.Focus();
//           } else {
//             if (this.trackmemorecords != null) {
//               var REC = this.trackmemorecords.find(rec => rec.param_id == this.Memo_Id);
//               if (REC != null)
//                 REC.remarks = this.trackmemorecord.remarks;
//             }
//           }

//           this.NewRecord();
//           // this.errorMessage = 'Save Complete';
//           // alert(this.errorMessage);
//         }
//       }, error => {
//         this.errorMessage = this.gs.getError(error);
//         alert(this.errorMessage);
//       });
//   }


  SearchRecord(controlname: string) {
    this.errorMessage = '';
    let SearchData = {
      table: '',
      pkid: '',
    };

    if (controlname == "loadcombo") {
      SearchData.table = 'LOAD_COMBO_FOLLOWUP_PAGE';
      SearchData.pkid = '';
    }
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.FollowupList = response.memolist;
      },
        error => {
          this.errorMessage = this.gs.getError(error);
          alert(this.errorMessage);
        });
  }

}
