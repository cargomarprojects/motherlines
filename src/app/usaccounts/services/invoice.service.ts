
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';


@Injectable({
    providedIn: 'root'
})
export class invoiceService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) {}


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/Invoice/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/Invoice/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }


    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/USAccounts/Invoice/Save', SearchData, this.gs.headerparam2('authorized'));
    }

}
