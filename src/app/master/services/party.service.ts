import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Mast_Partym, PartyModel, vm_Tbl_Mast_Partym } from '../models/Tbl_Mast_Partym';
import { SearchQuery } from '../models/Tbl_Mast_Partym';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class PartyService {

    private mdata$ = new BehaviorSubject<PartyModel>(null);
    get data$(): Observable<PartyModel> {
        return this.mdata$.asObservable();
    }
    private record: PartyModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public isCompany: boolean;

    public initlialized: boolean;
    public initlializedBrcode: string = '';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any) {
        // if (this.initlializedBrcode != this.gs.branch_code) {
        //     this.initlializedBrcode = this.gs.branch_code;
        //     this.initlialized = false;
        //     this.record = null;
        //     this.mdata$.next(this.record);
        // }else if (this.param_type != params.menu_param) { 
        //     this.initlialized = false;
        //     this.record = null;
        //     this.mdata$.next(this.record);
        // }

        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.menu_param;

        this.record = <PartyModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', searchSort: 'gen_short_name', searchState: '', searchCity: '', searchTel: '', searchFax: '', searchZip: '', searchBlackAc: false,menuType:this.param_type },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isCompany = this.gs.IsCompany(this.menuid);
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

        this.initlialized = false;

        
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
        // SearchData.TYPE = 'PARTYS';
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.ISADMIN = this.isAdmin == true ? 'Y' : 'N';
        SearchData.ISCOMPANY =  this.isCompany == true ? 'Y' : 'N';
        SearchData.SORT = this.record.searchQuery.searchSort;
        SearchData.STATE = this.record.searchQuery.searchState;
        SearchData.CITY = this.record.searchQuery.searchCity;
        SearchData.ZIP = this.record.searchQuery.searchZip;
        SearchData.TEL = this.record.searchQuery.searchTel;
        SearchData.FAX = this.record.searchQuery.searchFax;
        SearchData.BLACK_ACCOUNT = this.record.searchQuery.searchBlackAc == true ? 'Y' : 'N';
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
            this.record = <PartyModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_Mast_Partym) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.gen_pkid == _rec.gen_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            // REC.mbl_refno = _rec.mbl_refno;
            // REC.mbl_no = _rec.mbl_no;
            // REC.mbl_agent_name = _rec.mbl_agent_name;
            // REC.mbl_liner_name = _rec.mbl_liner_name;
            // REC.mbl_pol_name = _rec.mbl_pol_name;;
            // REC.mbl_pol_etd = _rec.mbl_pol_etd;
            // REC.mbl_pod_name = _rec.mbl_pod_name;
            // REC.mbl_pod_eta = _rec.mbl_pod_eta;
            // REC.mbl_handled_name = _rec.mbl_handled_name;
            REC.rec_created_by = _rec.rec_created_by;
        }
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Party/Save', SearchData, this.gs.headerparam2('authorized'));
    }

}
