import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { SearchQuery } from '../models/tbl_cargo_approved';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-approvedpage-header',
  templateUrl: './approvedpage-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ApprovedPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery : SearchQuery;
  @Input() set _query( value : SearchQuery){
    this.searchQuery  = Object.assign({}, value);
  }
  
  @Output() searchEvents = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes:  SimpleChange ) {
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "USER") {
      this.searchQuery.userId = _Record.id;
      this.searchQuery.userName = _Record.name;
    }
  }
}
