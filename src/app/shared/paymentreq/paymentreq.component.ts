import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Table_Cargo_Payrequest, vm_Table_Cargo_Payrequest } from '../../shared/models/table_cargo_payrequest';
import { PaymentReqService } from '../services/paymentreq.service';

@Component({
  selector: 'app-paymentreq',
  templateUrl: './paymentreq.component.html',
})
export class PaymentReqComponent implements OnInit {
  // Local Variables 

  @Input() public cp_ref_no: string = 'TEST';
  @Input() public cp_master_id: string = '';
  @Input() public cp_source: string = '';
  @Input() public cp_mode: string = '';

  payrecord: Table_Cargo_Payrequest = <Table_Cargo_Payrequest>{};
  payrecords: Table_Cargo_Payrequest[] = [];

  // 15-07-2019 Created By Ajith  
  private pkid: string;
  private menuid: string;
  private mode: string;
  private title: string = '';
  private isAdmin: boolean;
  private errorMessage: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: PaymentReqService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.cp_master_id = options.cp_master_id;
    this.cp_source = options.cp_source;
    this.cp_mode = options.cp_mode;
    this.cp_ref_no = options.cp_ref_no;
    this.mode = 'ADD';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Payment Request';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  //  this.List('LOAD');
  }

  LoadCombo() {

  }


  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  EditRecord(_rec: Table_Cargo_Payrequest) {
    this.pkid = _rec.cp_pkid;
    this.mode = 'EDIT'
    this.GetRecord();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.payrecord = <Table_Cargo_Payrequest>{};
      this.payrecords = <Table_Cargo_Payrequest[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {

    // this.record.parentid = this.pkid;
    // this.record.cargo_description = '';
    // this.record.cargo_marks = '';
    // this.record.cargo_packages = '';
    // this.record.cargo_ctr = 1;
  }

  List(_type: string) {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.parentid = this.cp_master_id;

    this.mainService.List(SearchData)
      .subscribe(response => {
        this.payrecords = <Table_Cargo_Payrequest[]>response.records;
      },
        error => {
          this.errorMessage = this.gs.getError(error);
        });
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.payrecord = <Table_Cargo_Payrequest>response.record;
        this.mode = 'EDIT';
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  Save() {

    if (!this.Allvalid())
      return;
    const saveRecord = <vm_Table_Cargo_Payrequest>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.payrecord;
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
    // this.errorMessage = "";
    // if (this.pkid == "") {
    //   bRet = false;
    //   this.errorMessage = "Invalid ID";
    //   alert(this.errorMessage);
    //   return bRet;
    // }

    return bRet;
  }


  Close() {
    this.location.back();
  }



}
