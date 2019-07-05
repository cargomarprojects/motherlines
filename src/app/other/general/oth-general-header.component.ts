import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';

import { SearchQuery } from '../models/tbl_cargo_general';

@Component({
  selector: 'app-oth-general-header',
  templateUrl: './oth-general-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class OthGeneralHeaderComponent implements OnInit {
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
