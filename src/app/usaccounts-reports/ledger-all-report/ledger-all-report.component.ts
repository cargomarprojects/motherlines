import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_acc_ledger } from '../models/Tbl_acc_ledger';
import { SearchTable } from '../../shared/models/searchtable';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ledger-all-report',
    templateUrl: './ledger-all-report.component.html'
})
export class LedgerAllReportComponent implements OnInit {

    title = 'Ledger ALL';
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
    tdate: string;
    cust_id: string;
    cust_name: string;
    comp_name: string = '';
    comp_code: string = '';
    radio_cust: string = 'ACC_ACCTM';
    is_ledger: string = 'Y';
    acc_parent_code: string = '';
    fy_start_month: number = 0;


    filename: string = '';
    filetype: string = '';
    filedisplayname: string = '';

    lov_where: string = "";

    sub: any;
    loading: boolean = false;
    errorMessage: string = '';
    SearchData: any = {};
    CompList: any[];


    constructor(
        public gs: GlobalService,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private location: Location,
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
        this.initLov();
        if (this.gs.FY_MONTHS.length > 0)
            this.fy_start_month = +this.gs.FY_MONTHS[0].code;
        else
            this.fy_start_month = +this.gs.FY_START_MONTH;
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
    }

    PageEvents(actions) {
        this.List(actions.outputformat, actions.action);
    }

    List(_outputformat: string, _action: string = 'NEW') {

        if (this.gs.isBlank(this.fdate))
            this.fdate = this.gs.year_start_date;
        if (this.gs.isBlank(this.tdate))
            this.tdate = this.gs.defaultValues.today;

        this.errorMessage = "";
        if (this.gs.isBlank(this.cust_id)) {
            this.errorMessage = "Code Cannot be Blank";
            alert(this.errorMessage);
            return;
        }

        if (this.is_ledger == "") {
            this.errorMessage = "Invalid A/c Selected, pls re-enter the Account";
            alert(this.errorMessage);
            return;
        }

        this.SearchData.outputformat = _outputformat;
        this.SearchData.pkid = this.urlid;
        this.SearchData.action = _action;


        if (_outputformat === 'SCREEN' && _action === 'NEW') {
            this.SearchData.JV_ACC_ID = this.cust_id;
            this.SearchData.JV_ACC_NAME = this.cust_name;
            this.SearchData.JV_YEAR = this.gs.year_code;
            this.SearchData.FDATE = this.fdate;
            this.SearchData.TDATE = this.tdate;
            this.SearchData.OPDATE = this.fdate;
            this.SearchData.BRCODE = this.comp_code;
            this.SearchData.COMP_NAME = this.comp_name;
            this.SearchData.ISLEDGER = this.is_ledger;
            this.SearchData.RETAINED_PROFIT = this.gs.RETAINED_PROFIT_ID;
            this.SearchData.ACC_PARENT_CODE = this.acc_parent_code;
            this.SearchData.FY_START_MONTH = this.fy_start_month;
            this.SearchData.RADIO_CUST = this.radio_cust;

            this.SearchData.filename = "";
            this.SearchData.filedisplayname = "";
            this.SearchData.filetype = "";
        }

        this.loading = true;
        this.mainservice.LedgerReport(this.SearchData)
            .subscribe(response => {



                this.loading = false;
            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }

    Close() {
        this.location.back();
    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname === 'ACCTM-CUST') {
            this.cust_id = _Record.id;
            this.cust_name = _Record.name;

            this.is_ledger = "N";
            if (this.radio_cust === "ACC_ACCTM")
                this.is_ledger = "Y";

            this.acc_parent_code = _Record.col7.toString()

        }
        // if (_Record.controlname === 'PARENT') {
        //   this.cust_parent_id = _Record.id;
        //   this.cust_parent_name = _Record.name;
        // }
    }

    Print() {
        this.errorMessage = "";
        // if (this.MainList.length <= 0) {
        //   this.errorMessage = "List Not Found";
        //   alert(this.errorMessage);
        //   return;
        // }

        // this.Downloadfile(this.filename, this.filetype, this.filedisplayname);
        this.report_title = 'Ledger Report';
        this.report_url = undefined;
        this.report_searchdata = this.gs.UserInfo;
        this.report_menuid = this.menuid;

    }


    callbackevent() {

    }

}
