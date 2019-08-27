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

  title: string = 'Top Customer Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab: string = '';

  sdate: string;
  edate: string;
  comp_type: string = '';
  report_category: string;
  topnum: number = 0;
  toporder: string = '';
  report_type: string = '';
  radio_exp: string = 'EXP'
  report_amt_caption: string;
  reportformat: string = '';
  group_by_parent: boolean = false;

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
        this.comp_type = rec.comp_type;
        this.report_type = rec.report_type;
        this.reportformat = rec.reportformat;
        this.topnum = rec.topnum;
        this.toporder = rec.toporder;
        this.radio_exp = rec.radio_exp;
        this.report_amt_caption = rec.report_amt_caption;
        this.group_by_parent = rec.group_by_parent;

        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;


        this.SearchData = this.gs.UserInfo;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type == 'ALL')
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        else
          this.SearchData.COMP_CODE = this.comp_type;

        this.SearchData.REPORT_TYPE = this.report_type;

      }
      else {
        this.MainList = Array<TBL_MBL_REPORT>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';

        this.report_category = "OVERSEAS AGENT";
        this.sdate = this.gs.defaultValues.today;
        this.edate = this.gs.defaultValues.today;
        this.comp_type = this.gs.branch_code;
        this.report_type = "DETAIL";
        this.reportformat = 'DETAIL';
        this.topnum = 10;
        this.toporder = 'ASC';
        this.radio_exp = 'REVENUE';
        this.report_amt_caption = '';
        this.group_by_parent = false;

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
      this.SearchData.COMP_TYPE = this.comp_type;

      if (this.comp_type == 'ALL')
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      else
        this.SearchData.COMP_CODE = this.comp_type;

      this.SearchData.REPORT_TYPE = this.report_type;

      this.SearchData.ISPARENT = this.group_by_parent == true ? "Y" : "N";
      this.SearchData.ISADMIN = (this.gs.user_isadmin == "Y" || this.gs.IsAdmin(this.menuid) )? "Y" : "N";

      this.reportformat = this.report_type;

      this.SearchData.TOP_VAL = this.topnum;
      this.SearchData.SORT_ORDER = this.toporder;
      this.SearchData.TOP_BY = "EXPENSE";
/*
      
     
     
      

      Filter.Add("TOP_VAL", Txt_Top.Text);
      Filter.Add("SORT_ORDER", Cmb_Orderby.SelectedItem.ToString().Trim());
      if (OPT_EXP.IsChecked == true)
          Filter.Add("TOP_BY", "EXPENSE");
      else if (OPT_REVENUE.IsChecked == true)
          Filter.Add("TOP_BY", "REVENUE");
      else if (OPT_PROFIT.IsChecked == true)
          Filter.Add("TOP_BY", "PROFIT");
      else if (OPT_TEU.IsChecked == true)
          Filter.Add("TOP_BY", "TEU");
      else if (OPT_TON.IsChecked == true)
          Filter.Add("TOP_BY", "TON");
      else if (OPT_HBL_TOT.IsChecked == true)
          Filter.Add("TOP_BY", "TOT_HBL");


*/




    }

    this.loading = true;

    this.mainservice.TopCustomerReport(this.SearchData)
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
            comp_type: this.SearchData.COMP_TYPE,
            report_type: this.SearchData.REPORT_TYPE,
            reportformat: this.reportformat,
            topnum: this.topnum,
            toporder: this.toporder,
            radio_exp: this.radio_exp,
            report_amt_caption: this.report_amt_caption,
            group_by_parent: this.group_by_parent,
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


  }

  LovSelected(_Record: SearchTable) {

  }


}
