import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_MBL_REPORT } from '../models/tbl_mbl_report';
import { SearchTable } from '../../shared/models/searchtable';


import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/top-customer-report.actions';
import *  as myReducer from './store/top-customer-report.reducer';
import { ReportState } from './store/top-customer-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-top-customer-report',
  templateUrl: './top-customer-report.component.html',
})
export class TopCustomerReportComponent implements OnInit {

  title: string = 'Sea Volume Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab: string = '';
  
  report_category: string;
  sdate: string;
  edate: string;
  mode : string  ='';
  comp_type: string = '';
  report_type: string = '';
  report_shptype : string = '';

  agent_id: string;
  agent_name: string;
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

  MainList: TBL_MBL_REPORT[];

  AGENTRECORD: SearchTable = new SearchTable();

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
        
        this.report_category = rec.report_category
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.mode  = rec.mode ;
        this.comp_type = rec.comp_type;
        this.report_type = rec.report_type;
        this.report_shptype = rec.report_shptype;
        this.agent_id = rec.agent_id;
        this.agent_name = rec.agent_name;
        this.reportformat = rec.reportformat;


        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;

        
        this.SearchData = this.gs.UserInfo;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.MODE = this.mode;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type == 'ALL')
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        else
          this.SearchData.COMP_CODE = this.comp_type;

        this.SearchData.REPORT_TYPE = this.report_type;
        this.SearchData.REPORT_SHPTYPE = this.report_shptype;

        this.SearchData.AGENT_ID = this.agent_id;
        this.SearchData.AGENT_NAME = this.agent_name;

        this.AGENTRECORD.id = this.agent_id;
        this.AGENTRECORD.name = this.agent_name;

      }
      else {
        this.MainList = Array<TBL_MBL_REPORT>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        
        this.report_category = "AGENT";
        this.sdate = this.gs.defaultValues.today;
        this.edate = this.gs.defaultValues.today;
        this.mode = 'OCEAN IMPORT';
        this.comp_type = this.gs.branch_code;
        this.report_type = "DETAIL";
        this.report_shptype = "ALL";
        this.agent_id = "";
        this.agent_name = "";
        this.reportformat = 'DETAIL';


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

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat == "SCREEN" && _action == 'NEW') {
      
      this.SearchData.REPORT_CATEGORY = this.report_category;
      this.SearchData.SDATE = this.sdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.MODE = this.mode;
      this.SearchData.COMP_TYPE = this.comp_type;
      
      if (this.comp_type == 'ALL')
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      else
        this.SearchData.COMP_CODE = this.comp_type;

      this.SearchData.REPORT_TYPE = this.report_type;
      this.SearchData.REPORT_SHPTYPE = this.report_shptype;
      this.SearchData.CUST_ID = this.agent_id;
      this.SearchData.AGENT_ID = this.agent_id;
      this.SearchData.AGENT_NAME = this.agent_name;

      this.reportformat = this.report_type;
    }


    this.loading = true;

    this.mainservice.TeuReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat == "SCREEN") {
          const state: ReportState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            report_category: this.SearchData.REPORT_CATEGORY,
            sdate: this.SearchData.SDATE,
            edate: this.SearchData.EDATE,
            mode: this.SearchData.MODE,
            comp_type: this.SearchData.COMP_TYPE,
            report_type: this.SearchData.REPORT_TYPE,
            report_shptype: this.SearchData.REPORT_SHPTYPE,
            agent_id: this.SearchData.AGENT_ID,
            agent_name: this.SearchData.AGENT_NAME,
            reportformat : this.reportformat,
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
    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.displaycolumn = "NAME";
    this.AGENTRECORD.type = "MASTER";
    this.AGENTRECORD.subtype = "";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "AGENT") {
      this.agent_id = _Record.id;
      this.agent_name = _Record.name;
    }
  }


}
