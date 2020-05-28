import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_acc_ledger, BankReconModel } from '../models/Tbl_acc_ledger';
import { SearchQuery } from '../models/Tbl_acc_ledger';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class BankReconService {

    private mdata$ = new BehaviorSubject<BankReconModel>(null);
    get data$(): Observable<BankReconModel> {
        return this.mdata$.asObservable();
    }
    private record: BankReconModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private New_Search: string = 'N';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any) {
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <BankReconModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ sdate: '', edate: '', accId: '', accCode: '', accName: '', sdate2: '', edate2: '', chkreconciled: false, chkunreconciled: false, lbl_balance: '', lbl_op: '', lbl_trans_cr: '', lbl_trans_dr: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canDelete = this.gs.canDelete(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {
        if (SearchData.outputformat === 'SCREEN')
            this.New_Search = "N";
        else if (SearchData.outputformat === 'PASSBOOK-BAL') {
            this.New_Search = "Y";
            this.FindBankBalance();
            return;
        }

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            if (this.New_Search == "Y")
                return;
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;

        SearchData.ACC_ID = this.record.searchQuery.accId;
        SearchData.RECONCILED = this.record.searchQuery.chkreconciled == true ? "Y" : "N";
        SearchData.UNRECONCILED = this.record.searchQuery.chkunreconciled == true ? "Y" : "N";
        SearchData.DATE1 = this.record.searchQuery.sdate2;
        SearchData.DATE2 = this.record.searchQuery.edate2;
        SearchData.BRCODE = this.gs.branch_code;

        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;

        if (type == 'PAGE') {
            SearchData.action = this.record.pageQuery.action;
            SearchData.page_count = this.record.pageQuery.page_count;
            SearchData.page_rows = this.record.pageQuery.page_rows;
            SearchData.page_current = this.record.pageQuery.page_current;;
        }

        this.List(SearchData).subscribe(response => {
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record.errormessage = this.gs.getError(error),
                this.mdata$.next(this.record);
        });
    }

    FindBankBalance() {
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.BRCODE = this.gs.branch_code;
        SearchData.ACCID = this.record.searchQuery.accId;
        SearchData.SDATE = this.record.searchQuery.sdate;
        SearchData.EDATE = this.record.searchQuery.edate
        this.GetPassbookBalance(SearchData)
            .subscribe(response => {
                // if (response.retvalue == false) {
                //     this.record.errormessage = response.error;
                //     alert(this.record.errormessage);
                // }
                // else {
                //     this.record.records.splice(this.record.records.findIndex(rec => rec.mbl_pkid == _rec.mbl_pkid), 1);
                // }

                this.ShowBalance(response.nDebit_op, response.nCredit_op, response.nDr, response.nCr);
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    ShowBalance(nOPDR: number, nOPCR: number, nDR: number, nCR: number) {
        
        let nAmt: number = 0;

        this.record.searchQuery.lbl_op = "";
        this.record.searchQuery.lbl_trans_dr = "";
        this.record.searchQuery.lbl_trans_cr = "";
        this.record.searchQuery.lbl_balance = "";

        nAmt = nOPDR - nOPCR;
        if (nAmt > 0)
            this.record.searchQuery.lbl_op = nAmt.toString() + " DR";
        else if (nAmt < 0)
            this.record.searchQuery.lbl_op = Math.abs(nAmt).toString() + " CR";

        if (nDR != 0)
            this.record.searchQuery.lbl_trans_dr = nDR.toString() + " DR";
        if (nCR != 0)
            this.record.searchQuery.lbl_trans_cr = nCR.toString() + " CR";

        nAmt = (nDR + nOPDR) - (nCR + nOPCR);

        if (nAmt > 0)
            this.record.searchQuery.lbl_balance = nAmt.toString() + " DR";
        else if (nAmt < 0)
            this.record.searchQuery.lbl_balance = Math.abs(nAmt).toString() + " CR";
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/BankReconciled/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetPassbookBalance(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/BankReconciled/GetPassbookBalance', SearchData, this.gs.headerparam2('authorized'));
    }

}
