import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
  providedIn : 'root'
})
export class UsAccountReportService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    BankEnquiry(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBankEnquiryRpt/BankEnquiry", SearchData, this.gs.headerparam2('authorized'));
    }

    BankStmt(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBankStmtRpt/BankStmt", SearchData, this.gs.headerparam2('authorized'));
    }
    BankBalance(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBankBalRpt/BankBalance", SearchData, this.gs.headerparam2('authorized'));
    }

}


