
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../../models/Tbl_cargo_Invoicem';
import { Tbl_Cargo_Invoiced } from '../../models/Tbl_cargo_Invoicem';

import { invoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

  private errormessage: string;
  
  private mbl_pkid: string;
  private mbl_refno: string;
  private mbl_type: string;
  private showdeleted: boolean;

  private id: string;
  private menuid: string;

  private title: string;
  private isAdmin: boolean;
  private canAdd: boolean;
  private canEdit: boolean;
  private canSave: boolean;


  record: Tbl_cargo_invoicem[]
  records: Tbl_Cargo_Invoiced[]

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: invoiceService
  ) { }

  ngOnInit() {
    this.init(this.route.snapshot.queryParams.parameter);
    this.List('SCREEN');
  }


  public init(params: any) {
    const options = JSON.parse(params);

    this.menuid = options.menuid;
    this.mbl_type = options.mbl_type;
    this.mbl_pkid = options.mbl_pkid;
    this.id = this.mbl_pkid;
    this.mbl_refno = options.mbl_refno;
    this.showdeleted = false;


    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;

  }


  ActionHandler(){
      
  }


  List(action: string = '') {

    var SearchData = this.gs.UserInfo;
    SearchData.outputformat = 'SCREEN';
    SearchData.action = 'NEW';
    SearchData.MBL_PKID = this.mbl_pkid;
    SearchData.INV_TYPE = this.mbl_type;
    SearchData.ISADMIN = (this.isAdmin) ? 'Y' : 'N';
    SearchData.SHOWDELETED = (this.showdeleted) ? 'Y' : 'N';
    SearchData.BR_REGION = this.gs.BRANCH_REGION;

    SearchData.page_count = 0;
    SearchData.page_rows = 0;
    SearchData.page_current = -1;
    SearchData.page_rowcount = 0;

    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;

    }, error => {
      this.errormessage = this.gs.getError(error)
    });
  }




  Close() {
    this.location.back();
  }



}
