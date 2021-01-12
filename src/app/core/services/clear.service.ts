
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SeaImpMasterService } from '../../seaimport/services/seaimp-master.service';
import { SeaImpHouseService } from '../../seaimport/services/seaimp-house.service';
import { HouseService } from '../../seaexport/services/house.service';
import { seaexpMasterService } from '../../seaexport/services/seaexp-master.service';
import { AirExpHouseService } from '../../airexport/services/airexp-house.service';
import { AirExpMasterService } from '../../airexport/services/airexp-master.service';

@Injectable({
    providedIn: 'root'
})
export class ClearService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService,
        private sim: SeaImpMasterService,
        private sih: SeaImpHouseService,
        private sem: seaexpMasterService,
        private seh: HouseService,
        private aem: AirExpMasterService,
        private aeh: AirExpHouseService
    ) {
    }

    ClearInit() {
      this.sim.ClearInit();
      this.sih.ClearInit();
      this.sem.ClearInit();
      this.seh.ClearInit();
      this.aem.ClearInit();
      this.aeh.ClearInit();
    }
}


