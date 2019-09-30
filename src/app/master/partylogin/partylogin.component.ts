import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import {PartyLoginService } from '../services/partylogin.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Party_Login, vm_Tbl_Party_Login } from '../models/Tbl_Party_Login';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-partylogin',
  templateUrl: './partylogin.component.html'
})
export class PartyLoginComponent implements OnInit {

  //@ViewChild('mbl_no') mbl_no_field: ElementRef;
  records: Tbl_Party_Login[] = [];
  record: Tbl_Party_Login = <Tbl_Party_Login>{};
  // 15-07-2019 Created By Ajith  

  menuid: string;
  parentid: string;
  partyCode: string;
  partyName: string;
  pkid: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  selectedRowIndex: number = -1;
  IsLocked: boolean = false;
  lblSave: string = "Save";
  cmbNotes: string = "";
  FollowupList: any[] = [];
  UserList: any[] = [];
  UsrDeleteId = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: PartyLoginService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.parentid = options.parentid;
    this.partyCode = options.party_code;
    this.partyName = options.party_name;
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Login Details';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {
  }

  actionHandler() {
    this.GetRecord();
  }

  init() {
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.parentid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.records = <Tbl_Party_Login[]>response.records;
        this.NewRecord();
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

   

  OnChange(field: string) {
    // if (field == 'cmbNotes') {
    //   this.record.cf_remarks = this.cmbNotes;
    // }
    // if (field == 'cf_assigned_id') {
    //   var REC = this.UserList.find(rec => rec.id == this.record.cf_assigned_id);
    //   if (REC != null) {
    //     this.record.cf_assigned_code = REC.code;
    //     this.record.cf_assigned_name = REC.name;
    //   }
    // }
  }

  onBlur(field: string, _rec: Tbl_Party_Login = null) {
    switch (field) {
    //   case 'remarks': {
    //     _rec.cf_remarks = _rec.cf_remarks.toUpperCase();
    //     break;
    //   }

    }
  }

  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }


  NewRecord() {
     
    if (this.UserList != null && this.UsrDeleteId != '') {
      this.UserList.splice(this.UserList.findIndex(rec => rec.id == this.UsrDeleteId), 1);
      this.UsrDeleteId = '';
    }

    this.mode = "ADD";
    this.pkid = this.gs.getGuid();
    this.record = <Tbl_Party_Login>{};
    this.record.plogin_pkid = this.pkid;
    // this.record.cf_master_id = this.cf_masterid;
    // this.record.cf_user_id = this.gs.user_pkid;
    // this.record.rec_created_by = this.gs.user_code;
    // this.record.cf_followup_date = this.gs.defaultValues.today;
    // this.record.cf_assigned_id = this.gs.user_pkid;
    // this.record.cf_assigned_code = this.gs.user_code;
    // this.record.cf_assigned_name = this.gs.user_name;
    // this.record.cf_remarks = '';
    this.lblSave = "Save";
    //Txtmemo.Focus();
  }

  EditRow(_rec: Tbl_Party_Login) {

    // if (this.UserList != null) {
    //   let bFind: boolean = false;
    //   this.UserList.forEach(Rec => {
    //     if (Rec.id == _rec.cf_assigned_id)
    //       bFind = true;
    //   })

    //   if (bFind == false) {

    //     this.UsrDeleteId = _rec.cf_assigned_id;

    //     var UsrDeleteRec = <SearchTable>{};
    //     UsrDeleteRec.id = _rec.cf_assigned_id;
    //     UsrDeleteRec.code = _rec.cf_assigned_code;
    //     UsrDeleteRec.name = "";
    //     this.UserList.push(UsrDeleteRec);
    //   }
    // }

    this.mode = "EDIT";
    // this.pkid = _rec.cf_pkid.toString();
    // this.record.cf_pkid = this.pkid;
    // this.record.cf_followup_date = _rec.cf_followup_date;
    // this.record.cf_remarks = _rec.cf_remarks.toString();
    // this.record.cf_assigned_id = _rec.cf_assigned_id;
    // this.record.cf_assigned_code = _rec.cf_assigned_code;
    this.lblSave = "Update";
    this.cmbNotes = '';
  }

  Save() {

    if (!this.Allvalid())
      return;

    const saveRecord = <vm_Tbl_Party_Login>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.record;
    saveRecord.pkid = this.pkid;
    saveRecord.mode = this.mode;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD") {
            this.records.push(this.record);
            // Grid_Memo.ScrollIntoView(memo_Record, Grid_Memo.Columns[0]);
            //Grid_Memo.Focus();
          } else {
            if (this.records != null) {
            //   var REC = this.records.find(rec => rec.cf_pkid == this.pkid);
            //   if (REC != null) {
            //     REC.cf_followup_date = this.record.cf_followup_date;
            //     REC.cf_remarks = this.record.cf_remarks;
            //   }
            }
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

  Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    // if (this.gs.isBlank(this.record.cf_master_id)) {
    //   bRet = false;
    //   this.errorMessage = "Invalid ID";
    //   alert(this.errorMessage);
    //   return bRet;
    // }

    // if (this.gs.isBlank(this.record.cf_assigned_id)) {
    //   bRet = false;
    //   this.errorMessage = "Assigned To has to be selected";
    //   alert(this.errorMessage);
    //   return bRet;
    // }
    return bRet;
  }


  Close() {
    this.location.back();
  }

  RemoveRow(_rec: Tbl_Party_Login) {

    this.errorMessage = '';
    // if (!confirm("DELETE " + _rec.cf_remarks)) {
    //   return;
    // }

    var SearchData = this.gs.UserInfo;
    // SearchData.pkid = _rec.cf_pkid;
    // SearchData.remarks = _rec.cf_remarks;

    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
        //   this.records.splice(this.records.findIndex(rec => rec.cf_pkid == _rec.cf_pkid), 1);
          this.NewRecord();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


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
        this.FollowupList = response.followuplist;
        this.UserList = response.userlist;
      },
        error => {
          this.errorMessage = this.gs.getError(error);
          alert(this.errorMessage);
        });
  }

}
