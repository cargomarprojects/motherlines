import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { SearchQuery } from '../models/Tbl_acc_ledger';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'bankrecon-header',
    templateUrl: './bankrecon-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankReconHeaderComponent implements OnInit {
    // Call By Value using Input Parameters
    searchQuery: SearchQuery;
    unchk: boolean = false;
    
    @Input() set _query(value: SearchQuery) {
        this.searchQuery = Object.assign({}, value);
        this.initData();
    }
    @Output() searchEvents = new EventEmitter<any>();

    constructor(public gs: GlobalService
    ) { }

    ngOnInit() {

    }

    initData() {
    }

    ngOnChanges(changes: SimpleChange) {
    }

    List(outputformat: string) {
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname === 'ACCTM') {
            this.searchQuery.accId = _Record.id;
            this.searchQuery.accCode = _Record.code;
            this.searchQuery.accName = _Record.name;
        }
    }
}
