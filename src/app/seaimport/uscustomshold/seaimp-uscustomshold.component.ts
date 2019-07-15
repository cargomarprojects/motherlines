import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { SeaImpUsCustholdService } from '../services/seaimp-uscustomshold.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_imp_custhold, vm_tbl_cargo_imp_custhold } from '../models/tbl_cargo_imp_custhold';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-seaimp-uscustomshold',
  templateUrl: './seaimp-uscustomshold.component.html'
})
export class SeaImpUsCustomsHoldComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  record: Tbl_cargo_imp_custhold = <Tbl_cargo_imp_custhold>{};
   

  // 15-07-2019 Created By Ajith  

  private pkid: string;
  private menuid: string;
  private mode: string;
  private title: string;
  private isAdmin: boolean;

  private errorMessage: string;

  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SeaImpUsCustholdService,
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    // this.mode = options.mode;
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
      this.record = <Tbl_cargo_imp_custhold>{};
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.cust_parentid = this.pkid;
  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_imp_custhold>response.record;
        this.mode = response.mode;
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


  
  Save() {

    if (!this.Allvalid())
      return;
    const saveRecord = <vm_tbl_cargo_imp_custhold>{};
    saveRecord.record = this.record;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
          this.mode=response.mode;
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
    // if (this.record.mbl_no == "") {
    //   bRet = false;
    //   this.errorMessage = "Master BL# cannot be blank";
    //   return bRet;
    // }
    return bRet;
  }


  Close() {
    this.location.back();
  }


  LovSelected(_Record: SearchTable) {

    // if (_Record.controlname == "AGENT") {
    //   this.record.mbl_agent_id = _Record.id;
    //   this.record.mbl_agent_name = _Record.name;
    // }
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
    //   case 'mbl_refno': {
    //     this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
    //     break;
    //   }
    //   case 'cntr_pieces': {
    //     rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
    //     break;
    //   }
    }
  }

}
