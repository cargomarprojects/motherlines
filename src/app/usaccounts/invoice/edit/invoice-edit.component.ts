
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../../models/Tbl_cargo_Invoicem';
import { Tbl_Cargo_Invoiced } from '../../models/Tbl_cargo_Invoicem';
import { Tbl_PayHistory } from '../../models/Tbl_cargo_Invoicem';

import { invoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

  private errorMessage: string;

  private mode: string;
  private mbl_refno: string;
  private mbl_type: string;
  private showdeleted: boolean;
  private paid_amt: number;

  private pkid: string;
  private menuid: string;

  private title: string;
  private isAdmin: boolean;
  private canAdd: boolean;
  private canEdit: boolean;
  private canSave: boolean;

  record: Tbl_cargo_invoicem;
  records: Tbl_Cargo_Invoiced[];
  history: Tbl_PayHistory[];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: invoiceService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.pkid = options.mbl_pkid;
    this.mbl_type = options.mbl_type;
    this.mode = options.mode;
    this.mbl_refno = options.mbl_refno;
    this.initpage();
    this.actionHandler();
  }


  public initpage() {
    this.showdeleted = false;
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;
  }



  NewRecord() {
    this.mode = 'ADD';
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_invoicem>{};
      this.records = <Tbl_Cargo_Invoiced[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }

    if (this.mode == 'EDIT') {
      this.GetRecord();
    }

  }

  init() {

  }


  GetRecord() {

    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.INV_TYPE = this.mbl_type;
    SearchData.ISADMIN = (this.isAdmin) ? 'Y' : 'N';

    this.mainservice.GetRecord(SearchData).subscribe(response => {
      this.record = response.record;
      this.records = response.records;
      this.history = response.history;
      this.paid_amt = response.paid;
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }


  Close() {
    this.location.back();
  }



}
