import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_Invoicem';
import { invoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {

  private errormessage: string;
  private mbl_pkid: string;
  private mbl_refno: string;
  private mbl_type: string;
  private showdeleted: string;

  private id: string;
  private menuid: string;


  private title: string;
  private isAdmin: boolean;
  private canAdd: boolean;
  private canEdit: boolean;
  private canSave: boolean;

  records: Tbl_cargo_invoicem[]

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
    this.showdeleted = 'N';


    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;

  }

  List(action: string = '') {

    var SearchData = this.gs.UserInfo;
    SearchData.outputformat = 'SCREEN';
    SearchData.action = 'NEW';
    SearchData.MBL_PKID = this.mbl_pkid;
    SearchData.INV_TYPE = this.mbl_type;

    SearchData.page_count = 0;
    SearchData.page_rows = 0;
    SearchData.page_current = -1;



    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;
    }, error => {
      this.errormessage = this.gs.getError(error)
    });
  }


  NewRecord() {
    if (!this.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: '',
      type: this.mbl_type,
      origin: 'seaexp-master-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.SeaExport.Trans/SeaExpMasterEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_cargo_invoicem) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: '',
      type: '',
      origin: 'seaexp-master-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.SeaExport.Trans/SeaExpMasterEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }



}
