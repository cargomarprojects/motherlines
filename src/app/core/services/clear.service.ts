
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SeaImpMasterService } from '../../seaimport/services/seaimp-master.service';
import { SeaImpHouseService } from '../../seaimport/services/seaimp-house.service';
import { HouseService } from '../../seaexport/services/house.service';
import { seaexpMasterService } from '../../seaexport/services/seaexp-master.service';
import { AirExpHouseService } from '../../airexport/services/airexp-house.service';
import { AirExpMasterService } from '../../airexport/services/airexp-master.service';
import { AirImpMasterService } from '../../airimport/services/airimp-master.service';
import { AirImpHouseService } from '../../airimport/services/airimp-house.service';
import { ImportHblPageService } from '../../importdata/services/importhblpage.service';
import { ShipDataPageService } from '../../importdata/services/shipdatapage.service';
import { SettingPageService } from '../../importdata/services/settingpage.service';

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
        private aeh: AirExpHouseService,
        private aim: AirImpMasterService,
        private aih: AirImpHouseService,
        private impdhbl: ImportHblPageService,
        private impdship: ShipDataPageService,
        private impdset: SettingPageService
    ) {
    }

    ClearInit() {
      this.sim.ClearInit();
      this.sih.ClearInit();
      this.sem.ClearInit();
      this.seh.ClearInit();
      this.aem.ClearInit();
      this.aeh.ClearInit();
      this.aim.ClearInit();
      this.aih.ClearInit();
      this.impdhbl.ClearInit();
      this.impdship.ClearInit();
      this.impdset.ClearInit();
      
    }
}


