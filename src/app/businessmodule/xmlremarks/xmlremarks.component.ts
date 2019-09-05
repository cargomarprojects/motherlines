import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { Table_Cargo_Remarks, vm_Table_Cargo_Remarks } from '../models/table_cargo_remarks';
import { XmlRemarksService } from '../services/xmlremarks.service';
import { User_Menu } from '../../core/models/menum';
 import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { AnyFn } from '@ngrx/store/src/selector';

@Component({
  selector: 'app-xmlremarks',
  templateUrl: './xmlremarks.component.html'
})
export class XmlRemarksComponent implements OnInit {

  //@ViewChild('mbl_no') mbl_no_field: ElementRef;
   
  // 15-07-2019 Created By Ajith  
  record: Table_Cargo_Remarks = <Table_Cargo_Remarks>{};
  menuid: string; 
  pkid: string;
  source: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  IsLocked: boolean = false;
  remarks: string = "";
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: XmlRemarksService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.pkid = options.pkid;
    this.source = options.source;
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Memo';
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
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

       
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

   
  OnChange(field: string) {
   
  }

  onBlur(field: string) {
    switch (field) {
      case 'remarks': {
        this.record.remarks = this.record.remarks.toUpperCase();
        break;
      }
    }
  }


  Save() {

    if (!this.Allvalid())
      return;

    const saveRecord = <vm_Table_Cargo_Remarks>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.pkid = this.pkid;
    saveRecord.record = this.record;
    saveRecord.mode = this.mode;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    if (this.gs.isBlank(this.remarks)) {
      bRet = false;
      this.errorMessage = "Remarks Cannot be empty";
      alert(this.errorMessage);
      return bRet;
    }
    return bRet;
}


  Close() {
    this.location.back();
  }

}
