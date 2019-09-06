import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Qtnd_Lcl, QtnmModel, vm_Tbl_Cargo_Qtnd_Lcl, Tbl_Cargo_Qtnm } from '../models/tbl_cargo_qtnm';
import { SearchQuery } from '../models/tbl_cargo_qtnm';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class QtnLclService {

    private mdata$ = new BehaviorSubject<QtnmModel>(null);
    get data$(): Observable<QtnmModel> {
        return this.mdata$.asObservable();
    }
    private record: QtnmModel;

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

        this.record = <QtnmModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, searchtype: 'REFNO' },
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
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        // SearchData.COLUMN_NAME = this.record.searchQuery.searchtype;
        SearchData.COLUMN_NAME = 'Place Of Delivery';
        SearchData.STYPE = 'LCL';
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
            this.record = <QtnmModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_Cargo_Qtnm) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.qtnm_pkid == _rec.qtnm_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {

            // REC.qtnr_agent_name = _rec.qtnr_agent_name;
            // REC.qtnr_pol_cntry_name = _rec.qtnr_pol_cntry_name;
            // REC.qtnr_pod_cntry_name = _rec.qtnr_pod_cntry_name;
            // REC.qtnr_mode = _rec.qtnr_mode;
            // REC.qtnr_validity = _rec.qtnr_validity;
            // REC.qtnr_file_name = _rec.qtnr_file_name;
            // REC.qtnr_file_name = _rec.qtnr_file_name;
        }
    }

    DeleteRow(_rec: Tbl_Cargo_Qtnm) {

        this.record.errormessage = '';
        if (!confirm("DELETE " + _rec.qtnm_no)) {
            return;
        }

        let fpath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\Files\\";

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.qtnm_pkid;
        SearchData.remarks = _rec.qtnm_no;
        SearchData.fpath = fpath;

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.qtnm_pkid == _rec.qtnm_pkid), 1);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnLcl/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnLcl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnLcl/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnLcl/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}
