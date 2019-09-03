import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Qtn_Rates } from '../models/tbl_cargo_qtn_rates';
import { SearchQuery } from '../models/tbl_cargo_qtn_rates';
import { PageQuery } from '../../shared/models/pageQuery';

import { QtnRateService } from '../services/qtnrate.service';

@Component({
  selector: 'app-qtnrate',
  templateUrl: './qtnrate.component.html'
})
export class QtnRateComponent implements OnInit {

  // 02-07-2019 Created By Ajith  

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Qtn_Rates[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: QtnRateService
  ) { }

  ngOnInit() {
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {
    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
  }

  searchEvents(actions: any) {
    this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  NewRecord() {

    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: '',
      origin: 'qtnrate-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Marketing.Quotation/QuotationRateEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_Cargo_Qtn_Rates) {

    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.qtnr_pkid,
      origin: 'qtnrate-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Marketing.Quotation/QuotationRateEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

 
}
