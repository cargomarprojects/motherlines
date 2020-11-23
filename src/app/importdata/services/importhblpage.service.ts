import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_mast_files, ImportHblPageModel } from '../models/tbl_mast_files';
import { SearchQuery } from '../models/tbl_mast_files';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class ImportHblPageService {

    private mdata$ = new BehaviorSubject<ImportHblPageModel>(null);
    get data$(): Observable<ImportHblPageModel> {
        return this.mdata$.asObservable();
    }
    private record: ImportHblPageModel;

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
    public initlializedBrcode: string = '';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any) {
        if (this.initlializedBrcode != this.gs.branch_code) {
            this.initlializedBrcode = this.gs.branch_code;
            this.initlialized = false;
            this.record = null;
            this.mdata$.next(this.record);
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <ImportHblPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', rdbprocessed:'NOT-PROCESSED'},
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {
        this.record.errormessage = '';
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
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.FLAG = this.record.searchQuery.rdbprocessed=='PROCESSED'?'Y':'N';
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
            this.record = <ImportHblPageModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }
    RefreshList(_rec: Tbl_mast_files) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.files_id == _rec.files_id);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.files_desc = _rec.files_desc;
            REC.files_processed = _rec.files_processed;
            REC.files_ref_no = _rec.files_ref_no;
            REC.files_uploaded_date = _rec.files_uploaded_date;
            REC.files_created_date = _rec.files_created_date;
        }
    }

    // DeleteRow(_rec: Tbl_cargo_exp_housem) {
        
    //     if (this.gs.isBlank(_rec.hbl_pkid) || this.gs.isBlank(_rec.hbl_mbl_id)) {
    //         this.record.errormessage = "Cannot Delete, Reference Not Found";
    //         alert(this.record.errormessage);
    //         this.mdata$.next(this.record);
    //         return;
    //     }

    //     if (!confirm("DELETE " + _rec.hbl_houseno)) {
    //         return;
    //     }

    //     this.record.errormessage = '';
    //     var SearchData = this.gs.UserInfo;
    //     SearchData.pkid = _rec.hbl_pkid;
    //     SearchData.mblid = _rec.hbl_mbl_id;
    //     SearchData.remarks = _rec.hbl_houseno;

    //     this.DeleteRecord(SearchData)
    //         .subscribe(response => {
    //             if (response.retvalue == false) {
    //                 this.record.errormessage = response.error;
    //                 alert(this.record.errormessage);
    //             }
    //             else {
    //                 this.record.records.splice(this.record.records.findIndex(rec => rec.hbl_pkid == _rec.hbl_pkid), 1);
    //             }
    //             this.mdata$.next(this.record);
    //         }, error => {
    //             this.record.errormessage = this.gs.getError(error);
    //             alert(this.record.errormessage);
    //             this.mdata$.next(this.record);
    //         });
    // }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/importhblpage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    // GetRecord(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    // }

    // Isblnoduplication(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/Isblnoduplication', SearchData, this.gs.headerparam2('authorized'));
    // }

    // Save(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/Save', SearchData, this.gs.headerparam2('authorized'));
    // }

    // LoadMasterData(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/LoadMasterData', SearchData, this.gs.headerparam2('authorized'));
    // }

    // DeleteRecord(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    // }

}
