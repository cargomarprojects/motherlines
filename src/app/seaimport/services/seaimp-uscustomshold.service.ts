
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_imp_custhold, vm_tbl_cargo_imp_custhold } from '../models/tbl_cargo_imp_custhold';

@Injectable({
    providedIn: 'root'
})
export class SeaImpUsCustholdService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/UsCustomshold/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/UsCustomshold/Save', SearchData, this.gs.headerparam2('authorized'));
    }

}
