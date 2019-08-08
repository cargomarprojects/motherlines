import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { SearchQuery } from '../models/tbl_cargo_exp_housem';

@Component({
  selector: 'app-airexp-house-header',
  templateUrl: './airexp-house-header.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class AirExpHouseHeaderComponent implements OnInit {
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
