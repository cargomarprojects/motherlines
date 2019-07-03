import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';

import { SearchQuery } from '../models/tbl_cargo_imp_masterm';

@Component({
  selector: 'app-seaimp-master-header',
  templateUrl: './seaimp-master-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class SeaImpMasterHeaderComponent implements OnInit {
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
}
