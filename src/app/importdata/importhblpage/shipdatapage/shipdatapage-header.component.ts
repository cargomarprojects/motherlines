import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { SearchQuery } from '../../models/tbl_edi_master';
import { SearchTable } from '../../../shared/models/searchtable';
import { ShipDataPageService } from '../../services/shipdatapage.service';

@Component({
  selector: 'app-shipdatapage-header',
  templateUrl: './shipdatapage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipDataPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery: SearchQuery;

  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }

  @Output() searchEvents = new EventEmitter<any>();

  constructor(public gs: GlobalService,
    public mainservice: ShipDataPageService
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChange) {
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }

  FindMissingData() {
    let IDs: string = "";

    this.mainservice.record.records.forEach(Rec => {
      if (Rec.selected == 'Y') {
        if (IDs != '')
          IDs += ',';
        IDs += "'" + Rec.masterid + "'";
      }
    })
    if (IDs == "") {
      alert('No Record Selected');
      return;
    }

    let prm = {
      menuid: this.gs.MENU_IMPORT_EXCEL,
      mbl_pkid: IDs,
      origin: 'airimp-master-page',
    };
    this.gs.Naviagete('Silver.ImportData/MissingDataPage', JSON.stringify(prm));
  }
}
