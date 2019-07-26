
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
    providedIn: 'root'
})
export class HouseService {
 
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) {}

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    GetHouseDefaultRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/GetHouseDefaultRecord', SearchData, this.gs.headerparam2('authorized'));
    }
   

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/HousePage/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    GetContainer(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Common/GetContainer', SearchData, this.gs.headerparam2('authorized'));
    }    


    GetDesc(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Common/GetDesc', SearchData, this.gs.headerparam2('authorized'));
    }    


    GetMblWeight(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaExport/Common/GetMblWeight', SearchData, this.gs.headerparam2('authorized'));
    }    

    
}