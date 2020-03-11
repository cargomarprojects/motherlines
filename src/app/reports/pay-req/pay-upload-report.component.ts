import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_invoicem';
import { Tbl_cargo_general } from '../../other/models/tbl_cargo_general'
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-pay-upload-report',
  templateUrl: './pay-upload-report.component.html'
})
export class PayUploadReportComponent implements OnInit {

  // 15-07-2019 Created By Ajith  
  @Input() public pkid: string;
  @Input() public menuid: string;
  @Input() public type: string;
  @Input() public HouseList: Tbl_cargo_general[];
  @Input() public InvoiceList: Tbl_cargo_invoicem[];
 
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
    
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: ReportService
  ) { }

  ngOnInit() {
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {

  }

  actionHandler() {
    
  }

  init() {
  }

   

  OnChange(field: string) {

  }

  onBlur(field: string) {
    switch (field) {
      // case 'remarks': {
      //   this.record.remarks = this.record.remarks.toUpperCase();
      //   break;
      // }
    }
  }


  Save() {

    if (!this.Allvalid())
      return;
 
  }

  Allvalid(): boolean {

    var bRet = true;
    return bRet;
  }


  AttachRowHouse(_rec: Tbl_cargo_general) {
    let TypeList: any[] = [];
    // TypeList = [{ "code": "APPROVAL REQUEST", "name": "APPROVAL REQUEST" }];
    // this.attach_pkid = _rec.ca_pkid;
    // this.attach_typelist = TypeList;
    // this.attach_type = 'APPROVAL REQUEST'
    // this.tab = 'attachment';
  }

  AttachRowInvoice(_rec: Tbl_cargo_invoicem) {
    let TypeList: any[] = [];
    // TypeList = [{ "code": "APPROVAL REQUEST", "name": "APPROVAL REQUEST" }];
    // this.attach_pkid = _rec.ca_pkid;
    // this.attach_typelist = TypeList;
    // this.attach_type = 'APPROVAL REQUEST'
    // this.tab = 'attachment';
  }


  BtnNavigation(action: string) {
    switch (action) {
        // case 'HISTORY': {
        //     let prm = {
        //         menuid: this.menuid,
        //         pkid: this.pkid,
        //         source: this.source,
        //         title: "History [" + this.source + "]",
        //         origin: 'Xml-remark-page'
        //     };
        //     this.gs.Naviagete('Silver.BusinessModule/LogBookPage', JSON.stringify(prm));
        //     break;
        // }
    }
}

  Close() {
    this.location.back();
  }

}
