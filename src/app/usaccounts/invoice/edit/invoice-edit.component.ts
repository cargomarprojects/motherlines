
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


  private inv_type : string ;
  private inv_arap : string ;

  private pkid: string;
  private menuid: string;

  private title: string;
  private isAdmin: boolean;
  private canAdd: boolean;
  private canEdit: boolean;
  private canSave: boolean;

  record: Tbl_cargo_invoicem = <Tbl_cargo_invoicem>{};
  records: Tbl_Cargo_Invoiced[] = [];
  history: Tbl_PayHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: invoiceService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.pkid = options.pkid;
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
      this.history = <Tbl_PayHistory[]>[];
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
      this.record = <Tbl_cargo_invoicem>response.record;
      this.records = <Tbl_Cargo_Invoiced[]>response.records;
      this.history = <Tbl_PayHistory[]>response.history;
      this.paid_amt = response.paid;

      this.inv_type = this.record.inv_type ;
      this.inv_arap = this.record.inv_arap;


    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }
  
  FindWeight(_type: string) {
    if (_type == "Kgs2Lbs")
      this.record.inv_hbl_lbs = this.gs.Convert_Weight("KG2LBS", this.record.inv_hbl_weight, 3);
    else if (_type == "Lbs2Kgs")
      this.record.inv_hbl_weight = this.gs.Convert_Weight("LBS2KG", this.record.inv_hbl_lbs, 3);
    else if (_type == "Cbm2Cft")
      this.record.inv_hbl_cft = this.gs.Convert_Weight("CBM2CFT", this.record.inv_hbl_cbm, 3);
    else if (_type == "Cft2Cbm")
      this.record.inv_hbl_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.inv_hbl_cft, 3);
  }

  onBlur(field: string) {
    switch (field) {
      case 'inv_no': {
        break;
      }
      case 'mbl_refno': {
        break;
      }
    }
  }


  Close() {
    this.location.back();
  }






}
