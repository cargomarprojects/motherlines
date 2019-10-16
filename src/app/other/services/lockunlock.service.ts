
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general, OthGeneralModel } from '../models/tbl_cargo_general';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class LockUnlockService {

    private mdata$ = new BehaviorSubject<OthGeneralModel>(null);
    get data$(): Observable<OthGeneralModel> {
        return this.mdata$.asObservable();
    }
    private record: OthGeneralModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;


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

        this.record = <OthGeneralModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, mode: 'ALL', cust_id: '', cust_name: '', branch: this.gs.branch_code, lock_type: 'ALL' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.MODE = this.record.searchQuery.mode;
        SearchData.CUST_ID = this.record.searchQuery.cust_id;
        SearchData.REF_NO = this.record.searchQuery.searchString;
        SearchData.LOCK_TYPE = this.record.searchQuery.lock_type;
        SearchData.COMP_TYPE = this.record.searchQuery.branch;
        if (this.record.searchQuery.branch === 'ALL') {
            SearchData.COMP_CODE = this.gs.branch_codes;
        } else {
            SearchData.COMP_CODE = this.record.searchQuery.branch;
        }
        SearchData.COMP_NAME = this.gs.branch_name;
        SearchData.LOCK_DAYS_SEA = this.gs.LOCK_DAYS_SEA.toString();
        SearchData.LOCK_DAYS_AIR = this.gs.LOCK_DAYS_AIR.toString();
        SearchData.LOCK_DAYS_OTHERS = this.gs.LOCK_DAYS_OTHERS.toString();
        SearchData.LOCK_DAYS_ADMIN = this.gs.LOCK_DAYS_ADMIN.toString();
        SearchData.TODAYS_DATE = this.gs.defaultValues.today;  //DateTime.Now.ToString("yyyy-MM-dd"));

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
            this.record.records.forEach(Rec => {
                Rec.mbl_lock_yn_b = Rec.mbl_lock_yn == 'Y' ? true : false;
                Rec.mbl_unlock_yn_b = Rec.mbl_unlock_yn == 'Y' ? true : false;
            })
            this.mdata$.next(this.record);
        }, error => {
            this.record = <OthGeneralModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    Lock(_rec: Tbl_cargo_general) {
        this.record.records.forEach(Rec => {
            if (Rec.mbl_pkid == _rec.mbl_pkid) {
                Rec.mbl_lock_yn = 'Y';
                Rec.mbl_lock_yn_b = true;
                Rec.mbl_unlock_yn = 'N';
                Rec.mbl_unlock_yn_b = false;
            }
        })
    }

    Unlock(_rec: Tbl_cargo_general) {
        this.record.records.forEach(Rec => {
            if (Rec.mbl_pkid == _rec.mbl_pkid) {
                Rec.mbl_lock_yn = 'N';
                Rec.mbl_lock_yn_b = false;
                Rec.mbl_unlock_yn = 'Y';
                Rec.mbl_unlock_yn_b = true;
            }
        })
    }

    ng (_type: string) {
        this.record.records.forEach(Rec => {
            if (_type === "LOCK") {
                Rec.mbl_lock_yn = 'Y';
                Rec.mbl_lock_yn_b = true;
                Rec.mbl_unlock_yn = 'N';
                Rec.mbl_unlock_yn_b = false;
            } else if (_type === "UNLOCK") {
                Rec.mbl_lock_yn = 'N';
                Rec.mbl_lock_yn_b = false;
                Rec.mbl_unlock_yn = 'Y';
                Rec.mbl_unlock_yn_b = true;
            }
        })
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/LockUnlock/List', SearchData, this.gs.headerparam2('authorized'));
    }

}

