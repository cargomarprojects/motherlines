
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
import { QtnAirService } from '../../marketing/services/qtnair.service';
import { QtnFclService } from '../../marketing/services/qtnfcl.service';
import { QtnLclService } from '../../marketing/services/qtnlcl.service';
import { QtnRateService } from '../../marketing/services/qtnrate.service';
import { SalesJournalService } from '../../marketing/services/salesjournals.service';

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
        private impdatahbl: ImportHblPageService,
        private impdataship: ShipDataPageService,
        private impdataset: SettingPageService,
        private qtnair: QtnAirService,
        private qtnfcl: QtnFclService,
        private qtnlcl: QtnLclService,
        private qtnrate: QtnRateService,
        private salesjournal: SalesJournalService

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
      this.impdatahbl.ClearInit();
      this.impdataship.ClearInit();
      this.impdataset.ClearInit();
      this.qtnair.ClearInit();
      this.qtnfcl.ClearInit();
      this.qtnlcl.ClearInit();
      this.qtnrate.ClearInit();
      this.salesjournal.ClearInit();
      
    }
}


