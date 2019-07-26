import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_slip } from '../models/tbl_cargo_slip';
import { MessengerSlipService } from '../services/messengerslip.service';

@Component({
  selector: 'app-messengerslip-list',
  templateUrl: './messengerslip-list.component.html'
})
export class MessengerSlipListComponent implements OnInit {

  private errormessage: string;
  private mbl_pkid: string;
  private mbl_refno: string;
  private mbl_mode:string; 
  
  private menuid: string;
  private title: string;
  private isAdmin: boolean;
  private canAdd: boolean;
  private canEdit: boolean;
  private canSave: boolean;

 
  records: Tbl_cargo_slip[]

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: MessengerSlipService
  ) { }

  ngOnInit() {
   
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.mbl_pkid = options.mbl_pkid;
    this.mbl_refno = options.mbl_refno;
    this.mbl_mode = options.mbl_mode;

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);

    this.List('SCREEN');
  }
 

  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.mbl_pkid = this.mbl_pkid;
   
    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;
      
    }, error => {
      this.errormessage = this.gs.getError(error)
    });
  }
  

  NewRecord() {
    if (!this.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: '',
      mode: 'ADD',
      mbl_pkid : this.mbl_pkid,
      mbl_refno : this.mbl_refno,
      mbl_mode:this.mbl_mode
       
    };
    this.gs.Naviagete('Silver.Other.Trans/MessengerSlip', JSON.stringify(parameter));

  }

  edit(_record: Tbl_cargo_slip) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: _record.cs_pkid,
      mode: 'EDIT',
      mbl_pkid : this.mbl_pkid,
      mbl_refno : this.mbl_refno,
      mbl_mode:this.mbl_mode
    };
    this.gs.Naviagete('Silver.Other.Trans/MessengerSlip', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }



}
