import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_User_Companym';

@Component({
    selector: 'app-branch-header',
    templateUrl: './branch-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        if (this.gs.isBlank(this.searchQuery.searchString))
            this.searchQuery.searchString = '';
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }
}
