import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_invoicem';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/pay-due-report.actions';
import * as myReducer from './store/pay-due-report.reducer';
import { ReportState } from './store/pay-due-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-pay-due-report',
  templateUrl: './pay-due-report.component.html'
})
export class PayDueReportComponent implements OnInit {

  title = 'Payment Due Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab = '';

  report_category: string;
  sdate: string;
  edate: string;
  mode = '';
  
  comp_type: string = '';
  report_type: string = '';
  report_shptype: string = '';

  sort: string ='inv_mbl_refno';
  sdata = '';
  cust_id: string;
  cust_name: string;


  reportformat = '';

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;

  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};

  Reportstate1: Observable<ReportState>;

  MainList: Tbl_cargo_invoicem[];

  CUSTRECORD: SearchTable = new SearchTable();


  constructor(
    public gs: GlobalService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private location: Location,
    private store: Store<myReducer.AppState>,
    private mainservice: ReportService
  ) {

    this.sub = this.activatedroute.queryParams.subscribe(params => {
      this.urlid = params.id;
      this.menuid = params.menuid;
      this.InitPage();
    });

  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.initLov();
      if (rec) {

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;

        this.report_category = rec.report_category;
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.mode = rec.mode;

        this.sdata = rec.sdata;
        this.sort = rec.sort;

        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;

        this.CUSTRECORD.id = this.cust_id;
        this.CUSTRECORD.name = this.cust_name;

        this.comp_type = rec.comp_type;
        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;




        this.SearchData = this.gs.UserInfo;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.MODE = this.mode;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type === 'ALL') {
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        } else {
          this.SearchData.COMP_CODE = this.comp_type;
        }


      } else {
        this.MainList = Array<Tbl_cargo_invoicem>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';



        this.report_category = 'CONSIGNEE SHIPMENT REPORT';
        this.sdate = this.gs.defaultValues.today;
        this.edate = this.gs.defaultValues.today;
        this.mode = "'SEA IMPORT'";
        this.comp_type = this.gs.branch_code;

        this.sdata = '';
        this.sort = 'inv_mbl_refno';
        this.cust_id = '';
        this.cust_name = '';

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
    this.page_current = actions.page_current;
    this.List(actions.outputformat, actions.action);
  }

  List(_outputformat: string, _action: string = 'NEW') {

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat === 'SCREEN' && _action === 'NEW') {

      this.SearchData.page_current = -1;

      this.SearchData.JV_YEAR = this.gs.globalVariables.year_code;
      this.SearchData.REPORT_CATEGORY = this.report_category;
      this.SearchData.FDATE = this.sdate;
      this.SearchData.TDATE = this.edate;
      
      this.SearchData.STYPE = this.mode;
      
      this.SearchData.SHOWSMODE = this.mode;

      this.SearchData.SORT = this.sort;
      
      this.SearchData.ISADMIN = 'N';

      this.SearchData.SDATA = this.sdata;
      this.SearchData.SORT= this.sort;
      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.user_id = this.cust_id;
      this.SearchData.user_name = this.cust_name;


    }

    this.loading = true;

    this.mainservice.PayDueReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat === 'SCREEN') {
          const state: ReportState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            report_category: this.SearchData.REPORT_CATEGORY,
            sdate: this.SearchData.FDATE,
            edate: this.SearchData.TDATE,
            mode: this.SearchData.STYPE,
            comp_type: this.SearchData.COMP_TYPE,

            sdata: this.SearchData.SDATA,
            sort: this.SearchData.SORT,
            cust_id: this.SearchData.cust_id,
            cust_name: this.SearchData.cust_name,

            page_rows: response.page_rows,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list
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
    this.CUSTRECORD = new SearchTable();
    this.CUSTRECORD.controlname = "CUSTOMER";
    this.CUSTRECORD.displaycolumn = "NAME";
    this.CUSTRECORD.type = "CUSTOMER";
    this.CUSTRECORD.subtype = "";
    this.CUSTRECORD.id = "";
    this.CUSTRECORD.code = "";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "CUSTOMER") {
      this.cust_id = _Record.id;
      this.cust_name = _Record.name;
    }
  }

}
