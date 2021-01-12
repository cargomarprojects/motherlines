
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SeaImpMasterService } from '../../seaimport/services/seaimp-master.service';

@Injectable({
    providedIn: 'root'
})
export class ClearService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService,
        private si: SeaImpMasterService
    ) {
    }

    ClearInit() {
      this.si.ClearInit();
    }

}


