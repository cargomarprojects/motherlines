import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { SeaImpRiderPageService } from '../services/seaimp-riderpage.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_imp_desc, vm_tbl_cargo_imp_desc } from '../models/tbl_cargo_imp_desc';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-seaimp-riderpage',
  templateUrl: './seaimp-riderpage.component.html'
})
export class SeaImpRiderPageComponent implements OnInit {

  descrecords: Tbl_cargo_imp_desc[] = [];

  // 15-07-2019 Created By Ajith  

  private pkid: string;
  private source: string;
  private menuid: string;
  private mode: string;
  private title: string = '';
  private isAdmin: boolean;
  private errorMessage: string;
  private selectedRowIndex: number = -1;
  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SeaImpRiderPageService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.source = options.source;
    this.menuid = options.menuid;
<<<<<<< HEAD
    this.mode = 'EDIT';
=======
    this.source = options.source;
    this.mode = 'ADD';
>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Rider Page';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {

  }


  actionHandler() {
<<<<<<< HEAD
=======
    // this.errorMessage = '';
    // if (this.mode == 'ADD') {
    //   this.record = <Tbl_cargo_imp_desc>{};
    //   this.init();
    // }
    // if (this.mode == 'EDIT') {
    //   this.GetRecord();
    // }

>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
    this.GetRecord();
  }


  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.source = this.source;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
<<<<<<< HEAD

        this.descrecords = response.records;
=======
        this.descrecords = response.records
>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
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

    const saveRecord = <vm_tbl_cargo_imp_desc>{};
    saveRecord.records = this.descrecords;
    saveRecord.pkid = this.pkid;
    saveRecord.source = this.source;
    saveRecord.userinfo = this.gs.UserInfo;

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
<<<<<<< HEAD
    // if (this.record.cust_title == "") {
    //   bRet = false;
    //   this.errorMessage = "Title cannot be blank";
    //   alert(this.errorMessage);
    //   return bRet;
    // }
=======

>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
    return bRet;
  }


  Close() {
    this.location.back();
  }


<<<<<<< HEAD
=======


>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
  onBlur(field: string, _rec: Tbl_cargo_imp_desc = null) {
    switch (field) {
      case 'cargo_marks': {
        _rec.cargo_marks = _rec.cargo_marks.toUpperCase();
        break;
      }
      case 'cargo_description': {
        _rec.cargo_description = _rec.cargo_description.toUpperCase();
        break;
      }
    }
  }

  AddRow() {
    var rec = <Tbl_cargo_imp_desc>{};
    rec.parentid = this.pkid;
    rec.cargo_marks = "",
      rec.cargo_description = "",
      rec.cargo_ctr = this.findNextCtr();
<<<<<<< HEAD
=======

>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
    this.descrecords.push(rec);
  }

  findNextCtr() {
    let max: number = 16;
    this.descrecords.forEach(Rec => {
      max = Rec.cargo_ctr > max ? Rec.cargo_ctr : max;
    })
    return max + 1;
  }


  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }

  private ChangePosition(thistype: string) {
    if (this.selectedRowIndex == -1)
      return;
    let _newindx: number = this.selectedRowIndex;

    if (thistype == 'UP')
      _newindx--;
    if (thistype == 'DOWN')
      _newindx++;

    if (_newindx >= 0 && _newindx < this.descrecords.length) {
      this.swaparritem(this.selectedRowIndex, _newindx);
      this.selectedRowIndex = _newindx;
    }
<<<<<<< HEAD

=======
>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
  }


  swaparritem(slot1: number, slot2: number) {
    var tempVal = this.descrecords[slot2];
    this.descrecords[slot2] = this.descrecords[slot1];
    this.descrecords[slot1] = tempVal;
  }

<<<<<<< HEAD

  RemoveRow(_rec: Tbl_cargo_imp_desc) {
    this.selectedRowIndex = -1;
    this.descrecords.splice(this.descrecords.findIndex(rec => rec.cargo_ctr == _rec.cargo_ctr), 1);
  }

  findNextCtr() {
    let max = 16;
    for (let i = 0; i < this.descrecords.length; i++) {
      max = (this.descrecords[i].cargo_ctr > max) ? this.descrecords[i].cargo_ctr : max;
    }
    return max + 1;
=======
  RemoveRow(_rec: Tbl_cargo_imp_desc) {
    this.descrecords.splice(this.descrecords.findIndex(rec => rec.cargo_ctr == _rec.cargo_ctr), 1);
>>>>>>> f8c861de35421f87c4199198d5d787a00fcd8787
  }

}
