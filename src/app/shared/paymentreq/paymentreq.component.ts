import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
//import { Auditlog } from '../../shared/models/auditlog';


@Component({
  selector: 'app-paymentreq',
  templateUrl: './paymentreq.component.html',
})
export class PaymentReqComponent implements OnInit {
  // Local Variables 
 
  @Input() public cp_ref_no: string = 'TEST';
  @Input() public cp_master_id: string = '';
  @Input() public cp_source: string = '';
  @Input() public cp_mode: string = '';
   
 
  // trackrecords: Tbl_Cargo_Tracking_Status[] = [];
  // trackmemorecord: Tbl_Cargo_Tracking_Status = <Tbl_Cargo_Tracking_Status>{};
  // trackmemorecords: Tbl_Cargo_Tracking_Status[] = [];
  // 15-07-2019 Created By Ajith  
  private pkid: string;
  private menuid: string;
  private mode: string;
  private title: string = '';
  private isAdmin: boolean;
  private errorMessage: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    //private mainService: OthTrackingPageService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.cp_master_id = options.cp_master_id;
    this.cp_source = options.cp_source;
    this.cp_mode = options.cp_mode;
    this.cp_ref_no = options.cp_ref_no;
    this.mode = 'ADD';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Tracking';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {
  
  }

   
  actionHandler() {
    this.GetRecord();
  }

  init() {

    // this.record.parentid = this.pkid;
    // this.record.cargo_description = '';
    // this.record.cargo_marks = '';
    // this.record.cargo_packages = '';
    // this.record.cargo_ctr = 1;
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
   
    // this.mainService.GetRecord(SearchData)
    //   .subscribe(response => {
    //     this.trackrecords = <Tbl_Cargo_Tracking_Status[]>response.records;
    //     this.trackmemorecords = <Tbl_Cargo_Tracking_Status[]>response.memorecords;
    //     this.NewRecord();
    //   }, error => {
    //     this.errorMessage = this.gs.getError(error);
    //   });
  }
 

  Save() {

    if (!this.Allvalid())
      return;

    // const saveRecord = <vm_Tbl_Cargo_Tracking_Status>{};
    // saveRecord.userinfo = this.gs.UserInfo;
    // saveRecord.record = this.trackrecords;
    // saveRecord.pkid = this.pkid;
    // saveRecord.parentType = this.parentType;
    // saveRecord.paramType = this.paramType;

    // this.mainService.Save(saveRecord)
    //   .subscribe(response => {
    //     if (response.retvalue == false) {
    //       this.errorMessage = response.error;
    //       alert(this.errorMessage);
    //     }
    //     else {
    //       this.errorMessage = 'Save Complete';
    //       alert(this.errorMessage);
    //     }
    //   }, error => {
    //     this.errorMessage = this.gs.getError(error);
    //     alert(this.errorMessage);
    //   });
  }

  private Allvalid(): boolean {

     var bRet = true;
    // this.errorMessage = "";
    // if (this.pkid == "") {
    //   bRet = false;
    //   this.errorMessage = "Invalid ID";
    //   alert(this.errorMessage);
    //   return bRet;
    // }

     return bRet;
  }


  Close() {
    this.location.back();
  }
  

  
}
