import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_MBL_REPORT } from '../models/tbl_mbl_report';
import { SearchTable } from '../../shared/models/searchtable';
import { User_Menu } from '../../core/models/menum';

import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/profit-report-house.actions';
import *  as myReducer from './store/profit-report-house.reducer';
import { ReportState } from './store/proft-report-house.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-profit-report-house',
  templateUrl: './profit-report-house.component.html'
})
export class ProfitReportHouseComponent implements OnInit {

  title: string = 'Profit Report - House';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab: string = '';
  report_category: string;
  sdate: string;
  edate: string;
  mode: string = '';
  comp_type: string = '';
  report_type: string = '';

  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';

  cust_id: string;
  cust_name: string;

  sales_id: string;
  sales_name: string;

  _report_category: string;
  _report_type: string = '';

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;


  // Local Variables;

  isAdmin: boolean = false;
  showStages: boolean = false;

  storesub: any;
  sub: any;
  tab: string = 'main';

  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};

  Reportstate1: Observable<ReportState>;

  MainList: TBL_MBL_REPORT[];

  menu_current: User_Menu = null;;

  CUSTRECORD: SearchTable = new SearchTable();
  SMANRECORD: SearchTable = new SearchTable();

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

  init() {

    if (this.menu_current = this.gs.getMenuById(this.menuid)) {
      if (this.menu_current.rights_admin == 'Y')
        this.isAdmin = true;

      this.title = this.menu_current.menu_name;
    }

    this.isAdmin = false;
    if (this.gs.user_isadmin == 'Y')
      this.isAdmin = true;

    this.showStages = false;
    if (this.gs.GENERAL_BRANCH_CODE == "MFDR")// MFORWARDER USA
      this.showStages = true;

    this.initLov();

  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.init();
      if (rec) {

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;

        this.report_category = rec.report_category
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.mode = rec.mode;
        this.comp_type = rec.comp_type;
        this.report_type = rec.report_type;

        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;

        this.sales_id = rec.sales_id;
        this.sales_name = rec.sales_name;

        this._report_category = rec._report_category;
        this._report_type = rec._report_type;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;

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
          this.SearchData.COMP_NAME = this.gs.branch_name;
        this.SearchData.REPORT_TYPE = this.report_type;

        this.SearchData.CUST_ID = this.cust_id;
        this.SearchData.CUST_NAME = this.cust_name;

        this.CUSTRECORD.id = this.cust_id;
        this.CUSTRECORD.name = this.cust_name;

        this.SearchData.SALES_ID = this.sales_id;
        this.SearchData.SALES_NAME = this.sales_name;

        this.SMANRECORD.id = this.sales_id;
        this.SMANRECORD.name = this.sales_name;


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
        this.mode = 'AIR IMPORT';
        this.comp_type = this.gs.branch_code;
        this.report_type = "DETAIL";

        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';

        this.cust_id = "";
        this.cust_name = "";

        this.sales_id = "";
        this.sales_name = "";


        this._report_category = 'AGENT';
        this._report_type = 'DETAIL';

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
        this.SearchData.COMP_NAME = this.gs.branch_name;

      this.SearchData.REPORT_TYPE = this.report_type;


      this.SearchData.BASEDON = '';
      this.SearchData.REPORT_COLUMN = 'REF.DATE';

      this.SearchData.ISADMIN = (this.isAdmin) ? 'Y' : 'N';
      this.SearchData.SHOWSTAGES = (this.showStages) ? 'Y' : 'N';


      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.CUST_NAME = this.cust_name;

      this.SearchData.SALES_ID = this.sales_id;
      this.SearchData.SALES_NAME = this.sales_name;

    }

    this.loading = true;

    this.mainservice.ProfitReportHouse(this.SearchData)
      .subscribe(response => {

        if (_outputformat == "SCREEN") {

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
            report_category: this.SearchData.REPORT_CATEGORY,
            sdate: this.SearchData.SDATE,
            edate: this.SearchData.EDATE,
            mode: this.SearchData.MODE,
            comp_type: this.SearchData.COMP_TYPE,
            report_type: this.SearchData.REPORT_TYPE,

            cust_id: this.SearchData.CUST_ID,
            cust_name: this.SearchData.CUST_NAME,

            sales_id: this.SearchData.SALES_ID,
            sales_name: this.SearchData.SALES_NAME,

            _report_category: this.SearchData.REPORT_CATEGORY,
            _report_type: this.SearchData.REPORT_TYPE,

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

    this.CUSTRECORD = new SearchTable();
    this.CUSTRECORD.controlname = "AGENT";
    this.CUSTRECORD.displaycolumn = "NAME";
    this.CUSTRECORD.type = "MASTER";
    this.CUSTRECORD.subtype = "";
    this.CUSTRECORD.id = "";
    this.CUSTRECORD.code = "";

    this.SMANRECORD = new SearchTable();
    this.SMANRECORD.controlname = "SALESMAN";
    this.SMANRECORD.displaycolumn = "NAME";
    this.SMANRECORD.type = "PARAM";
    this.SMANRECORD.subtype = "SALESMAN";
    this.SMANRECORD.id = "";
    this.SMANRECORD.code = "";
    if (!this.isAdmin)
      this.SMANRECORD.where = " param_lookup_id = '" + this.gs.user_pkid + "'";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "AGENT") {
      this.cust_id = _Record.id;
      this.cust_name = _Record.name;
    }
    if (_Record.controlname == "SALESMAN") {
      this.sales_id = _Record.id;
      this.sales_name = _Record.name;
    }
  }

  Print() {
    this.errorMessage = "";
    if (this.MainList.length <= 0) {
      this.errorMessage = "List Not Found";
      alert(this.errorMessage);
      return;
    }
    this.report_url = '';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = '';
    this.report_menuid = this.menuid;
    this.tab = 'report';
  }

  callbackevent() {
    this.tab = 'main';
  }


}
