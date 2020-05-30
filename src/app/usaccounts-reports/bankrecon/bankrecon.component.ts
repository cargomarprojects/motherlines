import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, BankReconModel, Tbl_acc_ledger } from '../models/Tbl_acc_ledger';
import { PageQuery } from '../../shared/models/pageQuery';
import { BankReconService } from '../services/bankrecon.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bankrecon',
  templateUrl: './bankrecon.component.html'
})
export class BankReconComponent implements OnInit {

  /*
   Joy
 */
  modal: any;


  errorMessage$: Observable<string>;
  records$: Observable<Tbl_acc_ledger[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: BankReconService
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

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
      type: this.mainservice.param_type,
      origin: 'mblusage-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_acc_ledger) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.acc_name,
      type: '',
      origin: 'mblusage-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

  Reconcile(_rec: Tbl_acc_ledger, datemodal: any = null) {

    this.mainservice.ReconcileRecord(_rec);
    this.modal = this.modalservice.open(datemodal, { centered: true });
  }

  CloseModal() {
    this.modal.close();
  }
  
  SaveReconDate() {
    this.mainservice.SaveDate();
    this.CloseModal();
  }

}
