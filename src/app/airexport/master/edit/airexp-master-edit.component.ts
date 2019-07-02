import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { AirExpMasterService } from '../../services/airexp-master.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_exp_masterm, vm_tbl_cargo_exp_masterm } from '../../models/tbl_cargo_exp_masterm';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-airexp-master-edit',
  templateUrl: './airexp-master-edit.component.html'
})
export class AirExpMasterEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  //@ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;

  record: Tbl_cargo_exp_masterm = <Tbl_cargo_exp_masterm>{};
  /*
    01-07-2019 Created By Ajith  
  */
  private pkid: string;
  private menuid: string;

  private mode: string;

  private errorMessage: string;

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};


  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: AirExpMasterService,
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.mode = options.mode;
    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = '';
  }


  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_exp_masterm>{};
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.mbl_pkid = this.pkid;
    this.record.mbl_shipment_stage = 'NIL';
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_direct = "N";
    this.record.mbl_3rdparty = "N";
    this.record.mbl_shipment_stage = "NIL";
    this.record.mbl_prefix = this.gs.AIR_EXPORT_REFNO_PREFIX;
    this.record.mbl_startingno = this.gs.AIR_EXPORT_REFNO_STARTING_NO;
    this.record.mbl_no = '';
    if (this.gs.BRANCH_REGION == "USA")
      this.record.mbl_currency = "USD";
    else
      this.record.mbl_currency = "AED";

    if (this.gs.JOB_TYPE_AE.length > 0) {
      // if (JobList.Count > 0)
      //     Cmb_JobType.SelectedIndex = 0;
    }
  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_exp_masterm>response.record;
        this.mode = 'EDIT';
        this.CheckData();
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  CheckData() {
    /*
        if (Lib.IsShipmentClosed("AIR EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
        {
            IsLocked = true;
            LBL_LOCK.Content = "LOCKED";
            CmdSave.IsEnabled = false;
            CmdCopyCntr.IsEnabled = false;
        }
        else
            LBL_LOCK.Content = "UNLOCKED";
    
    */
  }


  IsBLDupliation(stype: string, no: string) {

    if (no == null)
      return;
    if (no == '')
      return;

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.blno = no;
    SearchData.stype = stype;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.mode = this.mode;

    this.mainService.Isblnoduplication(SearchData)
      .subscribe(response => {
        if (response.retvalue) {
          this.errorMessage = response.retstring;
          if (stype == 'MAWB')
            this.mbl_no_field.nativeElement.focus();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });

  }

  Save() {

    if (!this.Allvalid())
      return;

    this.record.mbl_direct = this.record.mbl_direct_bool ? 'Y' : 'N';
    this.record.mbl_3rdparty = this.record.mbl_3rdparty_bool ? 'Y' : 'N';

    const saveRecord = <vm_tbl_cargo_exp_masterm>{};
    saveRecord.record = this.record;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD" && response.code != '')
            this.record.mbl_refno = response.code;
          this.mode = 'EDIT';
          this.errorMessage = 'Save Complete';
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }


  private Allvalid(): boolean {

    var bRet = true;

    this.errorMessage = "";
    if (this.record.mbl_ref_date == "") {
      bRet = false;
      this.errorMessage = "Ref Date cannot be blank";
      return bRet;
    }
     
    if (this.gs.JOB_TYPE_AE.length > 0 && this.record.mbl_jobtype_id == "") {
      bRet = false;
      this.errorMessage = "Job Type cannot be blank";
      return bRet;
    }

    if (this.record.mbl_shipment_stage == "") {
      bRet = false;
      this.errorMessage = "Shipment Stage cannot be blank";
      return bRet;
    }
    if (this.record.mbl_no == "") {
      bRet = false;
      this.errorMessage = "Master BL# can't be blank"
      return bRet;
    }

    if (this.record.mbl_agent_id == "") {
      bRet = false;
      this.errorMessage = "Master Agent cannot be blank"
      return bRet;
    }
    if (this.record.mbl_liner_id == "") {
      bRet = false;
      this.errorMessage = "Carrier cannot be blank"
      return bRet;
    }
    if (this.record.mbl_handled_id == "") {
      bRet = false;
      this.errorMessage = "A/N Handled By cannot be blank"
      return bRet;
    }

    if (this.record.mbl_frt_status == "") {
      bRet = false;
      this.errorMessage = "Freight status cannot be blank"
      return bRet;
    }

    if (this.record.mbl_pol_id == "") {
      bRet = false;
      this.errorMessage = "Port of Loading cannot be blank"
      return bRet;
    }
    if (this.record.mbl_pol_etd == "") {
      bRet = false;
      this.errorMessage = "ETD cannot be blank"
      return bRet;
    }
    if (this.record.mbl_pod_id == "") {
      bRet = false;
      this.errorMessage = "Port of Discharge cannot be blank"
      return bRet;
    }
    if (this.record.mbl_pod_eta == "") {
      bRet = false;
      this.errorMessage = "ETA cannot be blank"
      return bRet;
    }
    // if (this.record.mbl_pofd_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Final Destination cannot be blank"
    //   return bRet;
    // }

    if (this.record.mbl_country_id == "") {
      bRet = false;
      this.errorMessage = "Country Cannot be blank"
      return bRet;
    }
    if (this.record.mbl_currency == "") {
      bRet = false;
      this.errorMessage = "Currency cannot be blank"
      return bRet;
    }

    if (this.record.mbl_mawb_weight <= 0) {
      bRet = false;
      this.errorMessage = "Invalid Weight"
      return bRet;
    }
    if (this.record.mbl_mawb_chwt <= 0) {
      bRet = false;
      this.errorMessage = "Invalid Ch.Weight"
      return bRet;
    }

    // if (!Lib.IsValidAWB(Txt_MblNo.Text))
    // {
    //     bRet = false;
    //     MessageBox.Show("Invalid Master BL#", "Save", MessageBoxButton.OK);
    //     Txt_MblNo.Focus();
    //     return bRet;
    // }

    return bRet;
  }


  Close() {
    this.location.back();
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "AGENT") {
      this.record.mbl_agent_id = _Record.id;
      this.record.mbl_agent_name = _Record.name;
    }
    if (_Record.controlname == "CARRIER") {
      this.record.mbl_liner_id = _Record.id;
      this.record.mbl_liner_name = _Record.name;
    }
    if (_Record.controlname == "HANDLEDBY") {
      this.record.mbl_handled_id = _Record.id;
      this.record.mbl_handled_name = _Record.name;
    }
    if (_Record.controlname == "SALESMAN") {
      this.record.mbl_salesman_id = _Record.id;
      this.record.mbl_salesman_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.record.mbl_pol_id = _Record.id;
      this.record.mbl_pol_name = _Record.name;
    }

    if (_Record.controlname == "POD") {
      this.record.mbl_pod_id = _Record.id;
      this.record.mbl_pod_name = _Record.name;
    }

    if (_Record.controlname == "COUNTRY") {
      this.record.mbl_country_id = _Record.id;
      this.record.mbl_country_name = _Record.name;
    }

  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_no': {
        this.IsBLDupliation('MBL', this.record.mbl_no);
        break;
      }
    }
  }


  onBlur(field: string) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'mbl_no': {
        this.record.mbl_no = this.record.mbl_no.toUpperCase();
        break;
      }
      case 'mbl_liner_bookingno': {
        this.record.mbl_liner_bookingno = this.record.mbl_liner_bookingno.toUpperCase();
        break;
      }
      case 'mbl_vessel': {
        this.record.mbl_vessel = this.record.mbl_vessel.toUpperCase();
        break;
      }
      case 'mbl_voyage': {
        this.record.mbl_voyage = this.record.mbl_voyage.toUpperCase();
        break;
      }
      case 'mbl_to_port1': {
        this.record.mbl_to_port1 = this.record.mbl_to_port1.toUpperCase();
        break;
      }
      case 'mbl_by_carrier1': {
        this.record.mbl_by_carrier1 = this.record.mbl_by_carrier1.toUpperCase();
        break;
      }

      case 'mbl_to_port2': {
        this.record.mbl_to_port2 = this.record.mbl_to_port2.toUpperCase();
        break;
      }
      case 'mbl_by_carrier2': {
        this.record.mbl_by_carrier2 = this.record.mbl_by_carrier2.toUpperCase();
        break;
      }
      case 'mbl_to_port3': {
        this.record.mbl_to_port3 = this.record.mbl_to_port3.toUpperCase();
        break;
      }
      case 'mbl_by_carrier3': {
        this.record.mbl_by_carrier3 = this.record.mbl_by_carrier3.toUpperCase();
        break;
      }
      case 'mbl_mawb_weight': {
        this.record.mbl_mawb_weight = this.gs.roundNumber(this.record.mbl_mawb_weight, 3);
        break;
      }
      case 'mbl_mawb_chwt': {
        this.record.mbl_mawb_chwt = this.gs.roundNumber(this.record.mbl_mawb_chwt, 3);
        break;
      }

    }
  }


}