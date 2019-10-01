import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
 
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Mast_Addressm } from '../models/Tbl_Mast_Addressm';
import { PartyAddrService } from '../services/partyaddr.service';
import { Tbl_Mast_Contacts } from 'src/app/marketing/models/tbl_cargo_journals_master';

@Component({
  selector: 'app-partyaddr-list',
  templateUrl: './partyaddr-list.component.html'
})
export class PartyAddrListComponent implements OnInit {

  errorMessage: string;
  party_pkid: string;
  party_name: string;
  
  menuid: string;
  title: string;
  isAdmin: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;


  records: Tbl_Mast_Addressm[]

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PartyAddrService
  ) { }

  ngOnInit() {

    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.party_pkid = options.parentid;
    this.party_name = options.party_name;
    
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);

    this.List('SCREEN');
  }


  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.mbl_pkid = this.party_pkid;

    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;

    }, error => {
      this.errorMessage = this.gs.getError(error)
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
      party_pkid: this.party_pkid
    };
    this.gs.Naviagete('Silver.Other.Trans/MessengerSlipEdit', JSON.stringify(parameter));

  }

  edit(_record: Tbl_Mast_Addressm) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: _record.add_pkid,
      mode: 'EDIT',
      party_pkid: this.party_pkid
    };
    this.gs.Naviagete('Silver.Other.Trans/MessengerSlipEdit', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }
}
