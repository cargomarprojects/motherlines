import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_Acc_Payment } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/bank-enquiry-report.actions';
import * as myReducer from './store/bank-enquiry-report.reducer';
import { ReportState } from './store/bank-enquiry-report.models'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-bank-enquiry-report',
  templateUrl: './bank-enquiry-report.component.html'
})
export class BankEnquiryReportComponent implements OnInit {

  title = 'Bank Enquiry';
  pkid: string;
  urlid: string;
  url: string;
  menuid: string;
  currentTab = '';

  report_title: string;
  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  fdate: string;
  edate: string;
  bank_id: string;
  bank_name: string;
  comp_name: string = '';
  comp_code: string = '';

  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';

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
  MainList: Tbl_Acc_Payment[];
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
      this.LoadCompany();
    });

  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.initLov();
      if (rec) {

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;
        this.bank_id = rec.bank_id;
        this.bank_name = rec.bank_name;
        this.fdate = rec.fdate;
        this.edate = rec.edate;
        this.comp_name = rec.comp_name;
        this.comp_code = rec.comp_code;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;

        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;

        this.SearchData = this.gs.UserInfo;

        this.SearchData.BANK_ID = this.bank_id;
        this.SearchData.JV_YEAR = this.gs.year_code;
        this.SearchData.FDATE = this.fdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.OPDATE = this.fdate;
        this.SearchData.COMP_NAME = this.comp_name;
        this.SearchData.BRANCH_CODE = this.comp_code;
      } else {

        this.MainList = Array<Tbl_Acc_Payment>();
        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_rows = 3;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        this.bank_id = '';
        this.bank_name = '';
        this.fdate = this.gs.defaultValues.lastmonthdate;
        this.edate = this.gs.defaultValues.today;
        this.comp_code = this.gs.branch_code;
        this.comp_name = this.gs.branch_name;
        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';

        this.SearchData = this.gs.UserInfo;

      }
    });

  }

  LoadCompany() {
    this.CompList = <any[]>[];
    this.gs.CompanyList.forEach(Rec => {
      if (Rec.comp_code != 'ALL')
        this.CompList.push(Rec);
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
    if (this.gs.isBlank(this.bank_id)) {
      this.errorMessage = "Code Cannot be Blank";
      alert(this.errorMessage);
      return;
    }
    if (this.gs.isBlank(this.fdate)) {
      this.fdate = this.gs.year_start_date;
    }

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat === 'SCREEN' && _action === 'NEW') {

      this.SearchData.JV_YEAR = this.gs.year_code;
      this.SearchData.BANK_ID = this.bank_id;
      this.SearchData.BANK_NAME = this.bank_name;
      this.SearchData.FDATE = this.fdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.OPDATE = this.fdate;
      this.SearchData.BRANCH_CODE = this.comp_code;
      this.SearchData.COMP_NAME = this.comp_name;

      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
    }


    this.loading = true;

    this.mainservice.BankEnquiry(this.SearchData)
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
            bank_id: this.SearchData.BANK_ID,
            bank_name: this.SearchData.BANK_NAME,
            fdate: this.SearchData.FDATE,
            edate: this.SearchData.EDATE,
            comp_name: this.SearchData.COMP_NAME,
            comp_code: this.SearchData.BRANCH_CODE,
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
    if (_Record.controlname === 'ACCTM') {
      this.bank_id = _Record.id;
      this.bank_name = _Record.name;
    }
    // if (_Record.controlname === 'PARENT') {
    //   this.cust_parent_id = _Record.id;
    //   this.cust_parent_name = _Record.name;
    // }
  }

  Print() {
    this.errorMessage = "";
    if (this.MainList.length <= 0) {
      this.errorMessage = "List Not Found";
      alert(this.errorMessage);
      return;
    }

    // this.Downloadfile(this.filename, this.filetype, this.filedisplayname);
    this.report_title = 'Bank Enquiry Report';
    this.report_url = undefined;
    this.report_searchdata = this.gs.UserInfo;
    this.report_menuid = this.menuid;
    this.tab = 'report';
  }

  PrintPayment(_rec: Tbl_Acc_Payment) {

    if (_rec.pay_pkid == null)
      return;
    if (_rec.pay_type === "OP")
      return;
    if (_rec.pay_type === "CL")
      return;

      
    this.report_title = 'Bank Payment Details';
    this.report_url = '/api/UsAccBankRpt/PaymentDetails';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.PKID = _rec.pay_pkid;
    this.report_searchdata.TYPE = _rec.pay_type;
    this.report_menuid = this.menuid;
    this.tab = 'report';

  }


  callbackevent() {
    this.tab = 'main';
  }

}
