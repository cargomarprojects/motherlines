
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SeaImpMasterService } from '../../seaimport/services/seaimp-master.service';
import { SeaImpHouseService } from '../../seaimport/services/seaimp-house.service';

@Injectable({
    providedIn: 'root'
})
export class ClearService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService,
        private sim: SeaImpMasterService,
        private sih: SeaImpHouseService
    ) {
    }

    ClearInit() {
      this.sim.ClearInit();
      this.sih.ClearInit();
    }
}


