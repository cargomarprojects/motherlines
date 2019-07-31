
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Approved } from '../models/tbl_cargo_approved';
import { SearchQuery } from '../models/tbl_cargo_approved';
import { PageQuery } from '../../shared/models/pageQuery';

import { ApprovedPageService } from '../services/approvedpage.service';


@Component({
  selector: 'app-approvedpage',
  templateUrl: './approvedpage.component.html'
})
export class ApprovedPageComponent implements OnInit {

  // 02-07-2019 Created By Ajith  

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Approved[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: ApprovedPageService
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
      mode: 'ADD',
      mbl_pkid: '',
      mbl_refno: '',
      mbl_mode: 'GENERAL',
      origin: 'approved-page'
    };
    this.gs.Naviagete('Silver.Other.Trans/ApprovedPageEdit', JSON.stringify(parameter));

  }

  edit(_record: Tbl_Cargo_Approved) {

    if (this.mainservice.param_type == "APPROVED REPORT" || this.mainservice.param_type == "REQUEST REPORT")
      return;

    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.ca_pkid,
      mode: 'EDIT',
      mbl_pkid: '',
      mbl_refno: '',
      mbl_mode: 'GENERAL',
      origin: 'approvedpage',
    };
    this.gs.Naviagete('Silver.Other.Trans/ApprovedPageEdit', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


}
