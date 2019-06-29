
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_exp_masterm, seaExpMasterModel, vm_tbl_cargo_exp_masterm } from '../models/tbl_cargo_exp_masterm';
import { SearchQuery } from '../models/tbl_cargo_exp_masterm';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class seaexpMasterService {

    private mdata$ = new BehaviorSubject<seaExpMasterModel>(null);
    get data$(): Observable<seaExpMasterModel> {
        return this.mdata$.asObservable();
    }
    private record: seaExpMasterModel;

    public id : string;
    public menuid : string;
    public param_type : string ;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;


    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) {}

    public init(params: any) {
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <seaExpMasterModel>{
            errormessage : '',
            records : [],
            searchQuery : <SearchQuery>{searchString : ''},
            pageQuery : <PageQuery>{action :'NEW',page_count :0,page_current :-1,page_rowcount:0,page_rows:0}
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        
        this.initlialized = true;

    }

    Search( _searchdata : any, type: string = '') {

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
            this.record.pageQuery = <PageQuery>{ action :'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record = <seaExpMasterModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Master/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Master/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Isblnoduplication(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Master/Isblnoduplication', SearchData, this.gs.headerparam2('authorized'));
    }


    i


    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Master/Save', SearchData, this.gs.headerparam2('authorized'));
    }


}
