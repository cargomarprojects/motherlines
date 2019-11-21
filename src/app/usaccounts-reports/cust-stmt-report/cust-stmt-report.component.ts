import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_OS_REPORT } from '../models/Tbl_OS_Report';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/cust-stmt-report.actions';
import * as myReducer from './store/cust-stmt-report.reducer';
import { ReportState } from './store/cust-stmt-report.models'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-cust-stmt-report',
  templateUrl: './cust-stmt-report.component.html'
})
export class CustStmtReportComponent implements OnInit {

  title = 'Customer Statement';
  pkid: string;
  urlid: string;
  url: string;
  menuid: string;
  currentTab = '';
  chk_profitvisible: boolean = false;

  report_title: string;
  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  adate: string;
  ddate: string;
  cust_id: string;
  cust_name: string;
  comp_name: string = '';
  comp_code: string = '';

  comp_type: string = 'ALL';
  bank_id: string = '';
  bank_name: string = '';
  radio_cust: string = 'MASTER';
  showall: boolean = false;
  showprofit: boolean = false;
  sortname: string = 'inv_date';
  hide_payroll: string = 'N';
  currency: string = '';
  GT_UNIQUE_ID: string = this.gs.getGuid();

  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';

  lov_where: string = " ACC_TYPE in ('BANK') ";

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;
  tab: string = 'main';

  loading: boolean = false;
  errorMessage: string = '';
  SearchData: any = {};
  Reportstate1: Observable<ReportState>;
  MainList: Tbl_OS_REPORT[];
  CompList: any[];

  constructor(
    public gs: GlobalService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private location: Location,
    private store: Store<myReducer.AppState>,
    private mainservice: UsAccountReportService
  ) {

    this.sub = this.activatedroute.queryParams.subscribe(params => {
      this.urlid = params.id;
      this.menuid = params.menuid;
      this.InitPage();

      if (this.gs.BRANCH_REGION == "USA" && this.gs.company_code == "100") {
        if (this.gs.IsAdmin(this.menuid))
          this.chk_profitvisible = true;
        else
          this.chk_profitvisible = false;
      }
      this.GT_UNIQUE_ID = this.gs.getGuid();
    });

  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.initLov();
      if (rec) {

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;
        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;
        this.adate = rec.adate;
        this.ddate = rec.ddate;
        this.comp_name = rec.comp_name;
        this.comp_code = rec.comp_code;
        this.comp_type = rec.comp_type;
        this.bank_id = rec.bank_id;
        this.bank_name = rec.bank_name;
        this.radio_cust = rec.radio_cust;
        this.showall = rec.showall;
        this.showprofit = rec.showprofit;
        this.sortname = rec.sortname;
        this.hide_payroll = rec.hide_payroll;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;

        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;

        this.SearchData = this.gs.UserInfo;
        this.SearchData.CUST_ID = this.cust_id;
        this.SearchData.BANK_ID = this.bank_id;
        this.SearchData.BANK_NAME = this.bank_name;
        this.SearchData.RADIO_CUST = this.radio_cust;
        this.SearchData.JV_YEAR = this.gs.year_code;
        this.SearchData.EDATE = this.adate;
        this.SearchData.DUEDATE = this.ddate;
        this.SearchData.ARAP = 'BOTH';
        this.SearchData.SHOWALL = this.showall == true ? 'Y' : 'N';
        this.SearchData.ISCUSTOMER = this.radio_cust == 'MASTER' ? 'Y' : 'N';
        this.SearchData.GT_UNIQUE_ID = this.gs.getGuid();

        if (this.currency == undefined || this.currency === '')
          this.currency = this.gs.base_cur_code;
        if (this.gs.IS_SINGLE_CURRENCY == true || this.currency.trim().length <= 0 || this.currency == this.gs.base_cur_code) {
          this.SearchData.CURRENCY = '';
          this.SearchData.ISBASECURRENCY = 'Y';
        }
        else {
          this.SearchData.CURRENCY = this.currency;
          this.SearchData.ISBASECURRENCY = 'N';
        }
        this.SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;

        this.SearchData.SORT = this.sortname;
        this.SearchData.COMP_NAME = this.comp_name;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type == 'ALL')
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        else
          this.SearchData.COMP_CODE = this.comp_type;

      } else {

        this.MainList = Array<Tbl_OS_REPORT>();
        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        this.cust_id = '';
        this.cust_name = '';
        this.adate = this.gs.defaultValues.today;
        this.ddate = '';
        this.comp_code = this.gs.branch_code;
        this.comp_name = this.gs.branch_name;
        this.comp_type = 'ALL';
        this.sortname = 'inv_date';
        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';

        this.SearchData = this.gs.UserInfo;

      }
    });

  }

  ngOnInit() {  
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.storesub.unsubscribe();
  }

  PageEvents(actions) {
    this.List(actions.outputformat, actions.action);
  }

  List(_outputformat: string, _action: string = 'NEW') {

    this.errorMessage = "";
    if (this.gs.isBlank(this.cust_id.trim())) {
      this.errorMessage = "Customer Cannot be Blank";
      alert(this.errorMessage);
      return;
    }

    if (this.gs.isBlank(this.adate)) {
      this.adate = this.gs.defaultValues.today;
    }

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat === 'SCREEN' && _action === 'NEW') {

      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.CUST_NAME = this.cust_name;
      this.SearchData.BANK_ID = this.bank_id;
      this.SearchData.BANK_NAME = this.bank_name;
      this.SearchData.RADIO_CUST = this.radio_cust;
      this.SearchData.JV_YEAR = this.gs.year_code;
      this.SearchData.EDATE = this.adate;
      this.SearchData.DUEDATE = this.ddate;
      this.SearchData.ARAP = 'BOTH';
      this.SearchData.SHOWALL = this.showall == true ? 'Y' : 'N';
      this.SearchData.ISCUSTOMER = this.radio_cust == 'MASTER' ? 'Y' : 'N';
      this.SearchData.GT_UNIQUE_ID = this.gs.getGuid();

      if (this.currency == undefined || this.currency === '')
        this.currency = this.gs.base_cur_code;
      if (this.gs.IS_SINGLE_CURRENCY == true || this.currency.trim().length <= 0 || this.currency == this.gs.base_cur_code) {
        this.SearchData.CURRENCY = '';
        this.SearchData.ISBASECURRENCY = 'Y';
      }
      else {
        this.SearchData.CURRENCY = this.currency;
        this.SearchData.ISBASECURRENCY = 'N';
      }
      this.SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;

      this.SearchData.SORT = this.sortname;
      this.SearchData.COMP_NAME = this.comp_name;
      this.SearchData.COMP_TYPE = this.comp_type;
      if (this.comp_type == 'ALL')
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      else
        this.SearchData.COMP_CODE = this.comp_type;

      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";

    }


    this.loading = true;

    this.mainservice.CustStmt(this.SearchData)
      .subscribe(response => {

        if (_outputformat === 'SCREEN') {
          if (_action == "NEW") {
            this.SearchData.filename = response.filename;
            this.SearchData.filedisplayname = response.filedisplayname;
            this.SearchData.filetype = response.filetype;
          }

          const state: ReportState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            cust_id: this.SearchData.CUST_ID,
            cust_name: this.SearchData.CUST_NAME,
            adate: this.SearchData.EDATE,
            ddate: this.SearchData.DUEDATE,
            comp_name: this.SearchData.COMP_NAME,
            comp_code: this.SearchData.COMP_CODE,
            comp_type: this.SearchData.COMP_TYPE,
            bank_id: this.SearchData.BANK_ID,
            bank_name: this.SearchData.BANK_NAME,
            radio_cust: this.SearchData.RADIO_CUST,
            showall: this.showall,
            showprofit: this.showprofit,
            sortname: this.sortname,
            hide_payroll: this.hide_payroll,
            page_rows: response.page_rows,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list,
            filename: this.SearchData.filename,
            filetype: this.SearchData.filetype,
            filedisplayname: this.SearchData.filedisplayname
          };
          this.store.dispatch(new myActions.Update({ id: this.urlid, changes: state }));
        }

        this.loading = false;
      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
        alert(this.errorMessage);
      });
  }

  Close() {
    this.store.dispatch(new myActions.Delete({ id: this.urlid }));
    this.location.back();
  }

  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname === 'CUST-AGENT') {
      this.cust_id = _Record.id;
      this.cust_name = _Record.name;
    }
    if (_Record.controlname === 'BANK') {
      this.bank_id = _Record.id;
      this.bank_name = _Record.name;
    }
  }

  Print() {
    this.errorMessage = "";
    if (this.MainList.length <= 0) {
      this.errorMessage = "List Not Found";
      alert(this.errorMessage);
      return;
    }

    this.tab = 'osreport';

     
    // this.report_title = 'Customer Stmt Report';
    // this.report_url = undefined;
    // this.report_searchdata = this.gs.UserInfo;
    // this.report_menuid = this.menuid;
    // this.tab = 'report';
  }

  PrintPayment(_rec: Tbl_OS_REPORT) {

    // if (_rec.pay_pkid == null)
    //   return;
    // if (_rec.pay_pkid === "OP")
    //   return;
    // if (_rec.pay_pkid === "CL")
    //   return;


    // this.report_title = 'Bank Payment Details';
    // this.report_url = '/api/UsAccBankStmtRpt/PaymentDetails';
    // this.report_searchdata = this.gs.UserInfo;
    // this.report_searchdata.PKID = _rec.pay_pkid;
    // this.report_searchdata.TYPE = _rec.pay_type;
    // this.report_menuid = this.menuid;
    // this.tab = 'report';

  }

  callbackevent() {
    this.tab = 'main';
  }

  rdbclick() {
    this.cust_id = '';
    this.cust_name = '';
  }

}
