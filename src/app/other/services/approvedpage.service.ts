import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Approved, ApprovedPageModel, vm_tbl_cargo_approved } from '../models/tbl_cargo_approved';
import { SearchQuery } from '../models/tbl_cargo_slip';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class ApprovedPageService {

    private mdata$ = new BehaviorSubject<ApprovedPageModel>(null);
    get data$(): Observable<ApprovedPageModel> {
        return this.mdata$.asObservable();
    }
    private record: ApprovedPageModel;

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
        this.record = <ApprovedPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.defaultValues.lastmonthdate, todate: this.gs.defaultValues.today, mblid: '' },
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
        SearchData.MBLID = '';
        SearchData.OPERATION_MODE = 'GENERAL';
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;

        if (type == 'PAGE') {
            SearchData.action = this.record.pageQuery.action;
            SearchData.page_count = this.record.pageQuery.page_count;
            SearchData.page_rows = this.record.pageQuery.page_rows;
            SearchData.page_current = this.record.pageQuery.page_current;
        }

        this.List(SearchData).subscribe(response => {
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record = <ApprovedPageModel>{
                records: [],
                errormessage: this.gs.getError(error),
            };
            this.mdata$.next(this.record);
        });
    }

    GeneralList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/GeneralList', SearchData, this.gs.headerparam2('authorized'));
    }
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/ApprovedPage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    

}
