import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
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

  @Input() public cp_ref_no: string = '';
  @Input() public cp_master_id: string = '';
  @Input() public cp_source: string = '';
  @Input() public cp_mode: string = '';

  payrecord: Table_Cargo_Payrequest = <Table_Cargo_Payrequest>{};
  payrecords: Table_Cargo_Payrequest[] = [];
  invrecords: Table_Cargo_Payrequest[] = [];

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
    this.List('LOAD');
  }

  LoadCombo() {

  }


  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  EditRecord(_rec: Table_Cargo_Payrequest) {
    this.mode = 'EDIT'
    this.pkid = _rec.cp_pkid;
    this.payrecord.cp_paytype_needed = _rec.cp_paytype_needed;
    this.payrecord.cp_spl_notes = _rec.cp_spl_notes;
    this.payrecord.cp_payment_date = _rec.cp_payment_date;
    this.payrecord.cp_cust_name = _rec.cp_cust_name;
    this.payrecord.cp_cust_id = _rec.cp_cust_id;
    this.payrecord.cp_inv_no = _rec.cp_inv_no
    this.payrecord.cp_inv_id = _rec.cp_inv_id;
    this.invrecords.forEach(Rec => {
      if (_rec.cp_inv_no.includes(Rec.cp_inv_no))
        Rec.cp_selected = true;
      else
        Rec.cp_selected = false;
    })
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.payrecord = <Table_Cargo_Payrequest>{};
      this.pkid = this.gs.getGuid();
      this.init();
    }
     
  }

  init() {
    this.payrecord.cp_paytype_needed = 'PAYMENT NEEDED ONLY';
    this.payrecord.cp_spl_notes = '';
    this.payrecord.cp_payment_date = '';
    this.payrecord.cp_cust_name = '';
    this.payrecord.cp_cust_id = '';
    this.payrecord.cp_inv_no = '';
    this.payrecord.cp_inv_id = '';
    this.invrecords.forEach(Rec => {
      Rec.cp_selected = false;
    })

  }
   

  List(_type: string) {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.cp_master_id;
    SearchData.source = this.cp_source;


    this.mainService.List(SearchData)
      .subscribe(response => {
        this.payrecords = <Table_Cargo_Payrequest[]>response.records;
        this.invrecords = <Table_Cargo_Payrequest[]>response.invrecords;

      },
        error => {
          this.errorMessage = this.gs.getError(error);
        });
  }

   
  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "PAYEE") {
      this.payrecord.cp_cust_id = _Record.id;
      this.payrecord.cp_cust_name = _Record.name;
    }

  }

  Save() {

    if (!this.Allvalid())
      return;

    const saveRecord = <vm_Table_Cargo_Payrequest>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.payrecord;
    saveRecord.mode = this.mode;

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
    if (this.cp_master_id == "") {
      bRet = false;
      this.errorMessage = "Invalid ID";
      alert(this.errorMessage);
      return bRet;
    }


    let selectCount: number = 0;
    this.invrecords.forEach(Rec => {
      if (Rec.cp_selected) {
        selectCount++;
        this.payrecord.cp_inv_no = Rec.cp_inv_no;
        this.payrecord.cp_inv_id = Rec.cp_inv_id;
        this.payrecord.cp_cust_id = Rec.cp_cust_id;
        this.payrecord.cp_cust_name = Rec.cp_cust_name;
      }
    })

    if (selectCount > 1) {
      bRet = false;
      this.errorMessage = "Multiple invoice selection not allowed";
      alert(this.errorMessage);
      return bRet;
    }

    return bRet;
  }


  Close() {
    this.location.back();
  }

  SelectInvoice(_rec: Table_Cargo_Payrequest) {
    this.payrecord.cp_inv_no = _rec.cp_inv_no;
    this.payrecord.cp_inv_id = _rec.cp_inv_id;
    this.payrecord.cp_cust_id = _rec.cp_cust_id;
    this.payrecord.cp_cust_name = _rec.cp_cust_name;
  }


}
