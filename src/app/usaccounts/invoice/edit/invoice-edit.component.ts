
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '../../../core/services/global.service';

import { SearchTable } from '../../../shared/models/searchtable';

import { Tbl_cargo_invoicem } from '../../models/Tbl_cargo_Invoicem';
import { Tbl_Cargo_Invoiced } from '../../models/Tbl_cargo_Invoicem';
import { Tbl_PayHistory } from '../../models/Tbl_cargo_Invoicem';

import { invoiceService } from '../../services/invoice.service';
import { ReportsRoutingModule } from 'src/app/reports/reports-routing.module';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

  private errorMessage: string;

  private mode: string;
  private mbl_pkid: string;
  private hbl_pkid: string;
  private mbl_refno: string;
  private mbl_type: string; // OE OI AE AI ...etc
  private showdeleted: boolean;
  private paid_amt: number;
  private bal_amt: number;

  private inv_arap: string; // AR OR AP
  private arrival_notice: string = '';

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
    this.inv_arap = options.inv_arap;
    this.mode = options.mode;
    this.mbl_refno = options.mbl_refno;
    this.arrival_notice = options.arrival_notice;
    this.initpage();
    this.initControls();
    this.SetIncomeExpenseCodesForLineItems();
    //this.enableAll();
    this.actionHandler();
  }


  initpage() {
    this.showdeleted = false;
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;

    this.showTitle();

  }

  acc_id: string = '';
  acc_code: string = '';
  acc_name: string = '';


  show_customer_control: boolean = false;
  show_arap_control: boolean = false;
  show_inv_currency: boolean = false;

  show_acc_control: boolean = false;
  show_cc_control: boolean = false;

  showvat: boolean = false;
  showinvstage: boolean = false;
  single_curr: boolean = true;


  showTitle() {
    if (this.inv_arap == 'AR')
      this.title = 'A/R INVOICE'
    if (this.inv_arap == 'AP')
      this.title = 'A/P INVOICE'
  }


  initControls() {
    this.showvat = (this.gs.VAT_PER > 0) ? true : false;
    this.showinvstage = false;
    this.single_curr = this.gs.IS_SINGLE_CURRENCY;
    this.show_inv_currency = this.single_curr;
  }

  enableAll() {
    this.single_curr = false;
    this.show_cc_control = true;
    this.showvat = true;
    this.show_inv_currency = this.single_curr;
  }


  SetIncomeExpenseCodesForLineItems() {
    if (this.inv_arap == "AR") {
      if (this.mbl_type == "AE") {
        this.acc_id = this.gs.INCOME_AE_ID;
        this.acc_code = this.gs.INCOME_AE_NAME;
      }
      if (this.mbl_type == "AI") {
        this.acc_id = this.gs.INCOME_AI_ID;
        this.acc_code = this.gs.INCOME_AI_NAME;
      }
      if (this.mbl_type == "OE") {
        this.acc_id = this.gs.INCOME_SE_ID;
        this.acc_code = this.gs.INCOME_SE_NAME;
      }
      if (this.mbl_type == "OI") {
        this.acc_id = this.gs.INCOME_SI_ID;
        this.acc_code = this.gs.INCOME_SI_NAME;
      }
      if (this.mbl_type == "OT") {
        this.acc_id = this.gs.INCOME_OT_ID;
        this.acc_code = this.gs.INCOME_OT_NAME;
      }
      if (this.mbl_type == "EX") {
        this.acc_id = this.gs.INCOME_EX_ID;
        this.acc_code = this.gs.INCOME_EX_NAME;
      }
    }
    if (this.inv_arap == "AP") {
      if (this.mbl_type == "AE") {
        this.acc_id = this.gs.EXPENSE_AE_ID;
        this.acc_code = this.gs.EXPENSE_AE_NAME;
      }
      if (this.mbl_type == "AI") {
        this.acc_id = this.gs.EXPENSE_AI_ID;
        this.acc_code = this.gs.EXPENSE_AI_NAME;
      }
      if (this.mbl_type == "OE") {
        this.acc_id = this.gs.EXPENSE_SE_ID;
        this.acc_code = this.gs.EXPENSE_SE_NAME;
      }
      if (this.mbl_type == "OI") {
        this.acc_id = this.gs.EXPENSE_SI_ID;
        this.acc_code = this.gs.EXPENSE_SI_NAME;
      }
      if (this.mbl_type == "OT") {
        this.acc_id = this.gs.EXPENSE_OT_ID;
        this.acc_code = this.gs.EXPENSE_OT_NAME;
      }
      if (this.mbl_type == "EX") {
        this.acc_id = this.gs.EXPENSE_EX_ID;
        this.acc_code = this.gs.EXPENSE_EX_NAME;
      }
    }


    if (this.mbl_type == "GE" || this.mbl_type == "PR" || this.mbl_type == "CM" || this.mbl_type == "PS" || this.mbl_type == "FA") {
      this.show_acc_control = true;
      this.show_cc_control = true;
      this.show_arap_control = false;

      if (this.gs.ALLOW_ARAP_CODE_SELECTION == "Y")
        this.show_arap_control = true;
      else
        this.show_arap_control = false;

      if (this.mbl_type == "PS") {
        if (this.inv_arap == "AR") {
          if (this.gs.INTERNAL_PAYMENT_SETTLMENT_AR_ID != "") {
            this.acc_id = this.gs.INTERNAL_PAYMENT_SETTLMENT_AR_ID;
            this.acc_code = this.gs.INTERNAL_PAYMENT_SETTLMENT_AR_NAME;
          }
        }
        if (this.inv_arap == "AP") {
          if (this.gs.INTERNAL_PAYMENT_SETTLMENT_AP_ID != "") {
            this.acc_id = this.gs.INTERNAL_PAYMENT_SETTLMENT_AP_ID;
            this.acc_code = this.gs.INTERNAL_PAYMENT_SETTLMENT_AP_NAME;
          }
        }
      }
    }
    else {
      this.show_acc_control = false;
      this.show_cc_control = false;
      this.show_arap_control = false;
    }

    /*
          if (INV_ARAP == "AR")
          {
              TXT_ARAP_CODE.PKID = GLOBALCONTANTS.SETTINGS_AC_RECEIVABLE;
              TXT_ARAP_CODE.Text = GLOBALCONTANTS.SETTINGS_AC_RECEIVABLE_NAME;
          }
          if (INV_ARAP == "AP")
          {
              TXT_ARAP_CODE.PKID = GLOBALCONTANTS.SETTINGS_AC_PAYABLE;
              TXT_ARAP_CODE.Text = GLOBALCONTANTS.SETTINGS_AC_PAYABLE_NAME;
          }


    if (this.inv_arap == "AR")
        TXT_ARAP_CODE.LOV_TABLE_WHERE = "ACC_IS_ARAP_CODE='R' ";
    else
        TXT_ARAP_CODE.LOV_TABLE_WHERE = "ACC_IS_ARAP_CODE='P' ";      
    */

  }


  AddRow() {

    this.SetIncomeExpenseCodesForLineItems();

    var rec = <Tbl_Cargo_Invoiced>{};
    rec.invd_acc_id = this.acc_id;
    rec.invd_acc_code = this.acc_code;
    rec.invd_acc_name = this.acc_code;
    this.records.push(rec);
  }

  removeRow(_rec: Tbl_Cargo_Invoiced) {

    if (!confirm('Remove Invoice Line Item Y/N'))
      return;

    this.records.forEach((rec, index) => {
      if (rec == _rec) {
        this.records.splice(index, 1);
      }
    });



  }


  NewRecord(arorap: string) {
    this.mode = 'ADD';
    this.inv_arap = arorap;
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_invoicem>{};
      this.records = <Tbl_Cargo_Invoiced[]>[];
      this.history = <Tbl_PayHistory[]>[];
      this.pkid = this.gs.getGuid();
      this.InitHeader();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }


  InitHeader() {

    if (this.inv_arap == "AR") {
      this.record.inv_prefix = this.gs.AR_INVOICE_PREFIX;
      this.record.inv_startingno = this.gs.AR_INVOICE_STARTING_NO;

      this.record.inv_acc_id = this.gs.SETTINGS_AC_RECEIVABLE;
      this.record.inv_acc_code = this.gs.SETTINGS_AC_RECEIVABLE_NAME;
      this.record.inv_acc_name = this.gs.SETTINGS_AC_RECEIVABLE_NAME;

    }
    else {

      this.record.inv_prefix = this.gs.AP_INVOICE_PREFIX;
      this.record.inv_startingno = this.gs.AP_INVOICE_STARTING_NO;

      this.record.inv_acc_id = this.gs.SETTINGS_AC_PAYABLE;
      this.record.inv_acc_code = this.gs.SETTINGS_AC_PAYABLE_NAME;
      this.record.inv_acc_name = this.gs.SETTINGS_AC_PAYABLE_NAME;
    }

    this.paid_amt = 0;

    this.showTitle();

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

      this.mbl_type = this.record.inv_type;
      this.inv_arap = this.record.inv_arap;
      this.mbl_pkid = this.record.inv_mbl_id;
      this.hbl_pkid = this.record.inv_hbl_id;

      this.showTitle();


      this.DisplayBalance();


    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }

  DisplayBalance() {
    this.bal_amt = this.record.inv_total - this.paid_amt;
    this.bal_amt = this.gs.roundNumber(this.bal_amt, 2);
    if (this.paid_amt != 0) {
      this.show_customer_control = false;
      this.show_arap_control = false;
      this.show_inv_currency = false;
    }
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

  onBlur(field: string, rec: Tbl_Cargo_Invoiced) {
    switch (field) {
      case 'inv_no': {
        break;
      }
      case 'mbl_refno': {
        break;
      }

      case 'invoice_code': {
        break;
      }
    }
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "CUSTOMER") {
      this.record.inv_cust_id = _Record.id;
      this.record.inv_cust_name = _Record.name;
    }

    if (_Record.controlname == "ARAP") {
      this.record.inv_acc_id = _Record.id;
      this.record.inv_acc_name = _Record.name;
    }


    if (_Record.controlname == "INVOICED-CODE" || _Record.controlname == "INVOICED-CURR" || _Record.controlname == "INVOICED-ACCTM" || _Record.controlname == "INVOICED-BRANCH") {
      this.records.forEach(rec => {

        if (rec.invd_pkid == _Record.uid) {

          if (_Record.controlname == "INVOICED-CODE") {
            rec.invd_desc_id = _Record.id;
            rec.invd_desc_name = _Record.name;
          }

          if (_Record.controlname == "INVOICED-CURR") {
            rec.invd_curr_id = _Record.id;
            rec.invd_curr_code = _Record.code;
          }

          if (_Record.controlname == "INVOICED-ACCTM") {
            rec.invd_acc_id = _Record.id;
            rec.invd_acc_code = _Record.code;
            rec.invd_acc_name = _Record.name;
          }

          if (_Record.controlname == "INVOICED-BRANCH") {
            rec.invd_cc_id = _Record.id;
            rec.invd_cc_code = _Record.code;
          }

        }
      });
    }



  }


  Close() {
    this.location.back();
  }






}
