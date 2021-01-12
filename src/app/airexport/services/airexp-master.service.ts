import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_exp_masterm, AirExpMasterModel, vm_tbl_cargo_exp_masterm } from '../models/tbl_cargo_exp_masterm';
import { SearchQuery } from '../models/tbl_cargo_exp_masterm';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class AirExpMasterService {

    private mdata$ = new BehaviorSubject<AirExpMasterModel>(null);
    get data$(): Observable<AirExpMasterModel> {
        return this.mdata$.asObservable();
    }
    private record: AirExpMasterModel;

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
    // public initlializedBrcode: string = '';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit(){
        this.record = <AirExpMasterModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, searchtype: 'REFNO' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }
    public init(params: any) {
        // if (this.initlializedBrcode != this.gs.branch_code) {
        //     this.initlializedBrcode = this.gs.branch_code;
        //     this.initlialized = false;
        //     this.record = null;
        //     this.mdata$.next(this.record);
        // }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <AirExpMasterModel>{
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
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.SEARCH_TYPE = this.record.searchQuery.searchtype;
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
            this.record = <AirExpMasterModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_cargo_exp_masterm) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.mbl_pkid == _rec.mbl_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.mbl_refno = _rec.mbl_refno;
            REC.mbl_no = _rec.mbl_no;
            REC.mbl_agent_name = _rec.mbl_agent_name;
            REC.mbl_liner_name = _rec.mbl_liner_name;
            REC.mbl_pol_name = _rec.mbl_pol_name;;
            REC.mbl_pol_etd = _rec.mbl_pol_etd;
            REC.mbl_pod_name = _rec.mbl_pod_name;
            REC.mbl_pod_eta = _rec.mbl_pod_eta;
            REC.mbl_handled_name = _rec.mbl_handled_name;
            REC.rec_created_by = _rec.rec_created_by;
        }
    }

    DeleteRow(_rec:Tbl_cargo_exp_masterm)
    {
        
        if (!confirm("DELETE " + _rec.mbl_refno)) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.mbl_pkid;
        SearchData.remarks = _rec.mbl_refno;

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.mbl_pkid == _rec.mbl_pkid), 1);
                }
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/Master/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/Master/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Isblnoduplication(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/Master/Isblnoduplication', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/Master/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/Master/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }


}
