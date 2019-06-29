import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { tap, share } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';

import { TBL_MAST_PARAM } from '../models/Tbl_Mast_Param';
import { SearchQuery } from '../store/param/param-page.models';
import { PageQuery } from '../../shared/models/pageQuery';

import * as fromparamactions from '../store/param/param-page.actions';
import * as fromparamreducer from '../store/param/param-page.reducer';


@Component({
  selector: 'app-param-page',
  templateUrl: './param-page.component.html'

})
export class ParamPageComponent implements OnInit, OnDestroy {

  // 24-05-2019 Created By Joy  

  private id: string;
  private menuid: string;
  private menu_param: string;
  private sub: any;

  private title: string;
  private isAdmin: boolean;


  private loading: boolean;


  private SearchData: any;

  private data$: Observable<TBL_MAST_PARAM[]>;
  private pageQuery$: Observable<PageQuery>;
  private searchQuery$: Observable<SearchQuery>;
  private errorMessage$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<fromparamreducer.ParamState>,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.menuid = params.id;
      this.menu_param = params.menu_param;
      this.initPage();
      

      
    });
  }

  private initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);

    this.SearchData = this.gs.UserInfo;

    this.data$ = this.store.select(fromparamreducer.SelectRecords);
    this.pageQuery$ = this.store.pipe(select(fromparamreducer.SelectPageData));
    this.searchQuery$ = this.store.pipe(select(fromparamreducer.SelectSearchData));
    this.errorMessage$ = this.store.pipe(select(fromparamreducer.getErrorMessage));

  }

  searchEvents(actions: any) {
    this.store.dispatch(new fromparamactions.LoadParamRequest({ type: "SEARCH", Query: actions.searchQuery }))
  }

  pageEvents(actions: any) {
    this.store.dispatch(new fromparamactions.LoadParamRequest({ type: "PAGE", Query: actions.pageQuery }))
  }


  NewRecord() {
    if (!this.gs.canAdd(this.menuid)) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: '',
      type: this.menu_param,
      origin:'param-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Master/ParamEdit', JSON.stringify(parameter));

  }
  edit(_record: TBL_MAST_PARAM) {

    if (!this.gs.canEdit(this.menuid)) {
      alert('Insufficient User Rights')
      return;
    }


    let parameter = {
      menuid: this.menuid,
      pkid: _record.param_pkid,
      type: _record.param_type,
      origin:'param-page',      
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Master/ParamEdit', JSON.stringify(parameter));
  }


  Close() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sub.unsubscribe;
  }

}
