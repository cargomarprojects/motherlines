import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { OthGeneralService } from '../../services/oth-general.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_general, Tbl_cargo_container, vm_tbl_cargo_general } from '../../models/tbl_cargo_general';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { forEach } from '@angular/router/src/utils/collection';
import { TBL_MBL_REPORT } from 'src/app/reports/models/tbl_mbl_report';

@Component({
  selector: 'app-oth-general-edit',
  templateUrl: './oth-general-edit.component.html'
})
export class OthGeneralEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  @ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;

  record: Tbl_cargo_general = <Tbl_cargo_general>{};
  records: Tbl_cargo_container[] = [];

  // 24-05-2019 Created By Joy  

  private pkid: string;
  private menuid: string;

  private mode: string;

  private errorMessage: string;

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};
  OPERATION_MODE: string = "";
  MblStatusList: any[] = [];
  BlStatusList: any[] = [];

  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: OthGeneralService,
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
    this.LoadCombo();
  }

  LoadCombo() {

    // if (this.gs.company_name == "MOTHERLINES INC USA") {
    //   this.MblStatusList = [{ "name": "NIL" }
    //     , { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }
    //     , { "name": "OMBL WITH LAX OFFICE" }, { "name": "OMBL SENT BY LAX OFFICE" }, { "name": "OMBL WITH NYC OFFICE" }
    //     , { "name": "OMBL SENT BY NYC OFFICE" }];
    // } else {
    //   this.MblStatusList = [{ "name": "NIL" }, { "name": "OMBL WITH OPERATION" },
    //   { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }];
    // }

    // this.BlStatusList = [{ "name": "NIL" }
    //   , { "name": "PENDING SEAWAY" }, { "name": "SEAWAY BILL" }
    //   , { "name": "PENDING TELEX RELEASED" }, { "name": "TELEX RELEASED" }];
  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_general>{};
      this.records = <Tbl_cargo_container[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.mbl_pkid = this.pkid;
    this.record.mbl_no = '';
    this.record.mbl_cfno = 0;
    this.record.mbl_refno = '';
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_frt_status = '';
    this.record.mbl_liner_id = '';
    this.record.mbl_liner_name = '';
    this.record.mbl_liner_code = '';
    this.record.mbl_agent_id = '';
    this.record.mbl_agent_name = '';
    this.record.mbl_agent_code = '';
    this.record.mbl_pod_id = '';
    this.record.mbl_pod_code = '';
    this.record.mbl_pod_name = '';
    this.record.mbl_pol_id = '';
    this.record.mbl_pol_code = '';
    this.record.mbl_pol_name = '';
    this.record.mbl_vessel = '';
    this.record.mbl_voyage = '';
    this.record.mbl_country_id = '';
    this.record.mbl_country_name = '';
    this.record.mbl_handled_id = '';
    this.record.mbl_handled_name = '';
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.mbl_type = '';
    this.record.mbl_place_delivery = '';
    this.record.hbl_pkid = '';
    this.record.hbl_mbl_id = '';
    this.record.hbl_houseno = '';
    this.record.hbl_frt_status = '';
    this.record.hbl_consignee_id = '';
    this.record.hbl_consignee_code = '';
    this.record.hbl_consignee_name = '';
    this.record.hbl_consignee_add1 = '';
    this.record.hbl_consignee_add2 = '';
    this.record.hbl_consignee_add3 = '';
    this.record.hbl_consignee_add4 = '';
    this.record.hbl_consignee_add5 = '';
    this.record.hbl_shipper_id = '';
    this.record.hbl_shipper_code = '';
    this.record.hbl_shipper_name = '';
    this.record.hbl_shipper_add1 = '';
    this.record.hbl_shipper_add2 = '';
    this.record.hbl_shipper_add3 = '';
    this.record.hbl_shipper_add4 = '';
    this.record.hbl_shipper_add5 = '';
    this.record.hbl_commodity = '';
    this.record.hbl_uom = '';
    this.record.hbl_pcs = 0;
    this.record.hbl_packages = 0;
    this.record.hbl_weight = 0;
    this.record.hbl_lbs = 0;
    this.record.hbl_cbm = 0;
    this.record.hbl_cft = 0;
    this.record.hbl_chwt = 0;
    this.record.hbl_chwt_lbs = 0;
    this.record.mbl_lock = '';
    this.record.mbl_jobtype_id = '';
    this.record.mbl_jobtype_name = '';
    this.record.hbl_isf_no = '';
    this.record.mbl_salesman_id = '';
    this.record.mbl_salesman_name = '';
    this.record.rec_files_attached = '';
    this.record.mbl_shipment_stage = 'NIL';
    this.record.hbl_it_no = '';
    this.record.hbl_it_port = '';
    this.record.mbl_ismemo_attached = '';
    this.record.hbl_is_pl = 'N';
    this.record.hbl_is_ci = 'N';
    this.record.hbl_is_carr_an = 'N';
    this.record.hbl_custom_reles_status = 'NA';
    this.record.hbl_is_delivery = 'NA';

    if (this.OPERATION_MODE.trim() == "EXTRA") {
      this.record.mbl_prefix = this.gs.EXTRA_OPERATION_REFNO_PREFIX;
      this.record.mbl_startingno = this.gs.EXTRA_OPERATION_REFNO_STARTING_NO;
    }
    else {
      this.record.mbl_prefix = this.gs.OTHER_OPERATION_REFNO_PREFIX;
      this.record.mbl_startingno = this.gs.OTHER_OPERATION_REFNO_STARTING_NO;
    }

    // CmdAttachments.Foreground = new SolidColorBrush(Colors.Black);
    // CmdInternalMemo.Foreground = new SolidColorBrush(Colors.Black);

    if (this.gs.JOB_TYPE_OT.length > 0) {
      // this.record.mbl_jobtype_id = this.gs.JOB_TYPE_OT[0].
    }
  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_general>response.record;
        this.record.hbl_is_pl_bool = this.record.hbl_is_pl == "Y" ? true : false;
        this.record.hbl_is_ci_bool = this.record.hbl_is_ci == "Y" ? true : false;
        this.record.hbl_is_carr_an_bool = this.record.hbl_is_carr_an == "Y" ? true : false;
        this.records = <Tbl_cargo_container[]>response.records;
        this.mode = 'EDIT';
        this.CheckData();
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  CheckData() {
    /*
        if (Lib.IsShipmentClosed("SEA EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
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
          if (stype == 'MBL')
            this.mbl_no_field.nativeElement.focus();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });

  }


  Save() {

    if (!this.Allvalid())
      return;

    this.record.hbl_is_pl = this.record.hbl_is_pl_bool ? 'Y' : 'N';
    this.record.hbl_is_ci = this.record.hbl_is_ci_bool ? 'Y' : 'N';
    this.record.hbl_is_carr_an = this.record.hbl_is_carr_an_bool ? 'Y' : 'N';
    this.SaveContainer();
    this.FindTotTeus();
    const saveRecord = <vm_tbl_cargo_general>{};
    saveRecord.record = this.record;
    saveRecord.cntrs = this.records;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.operationmode = this.OPERATION_MODE;

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

  private FindTotTeus() {
    var Tot_Teu = 0, Teu = 0, Tot_Cbm = 0;
    var Tot_20 = 0, Tot_40 = 0, Tot_40HQ = 0, Tot_45 = 0;
    var Cntr_Tot = 0;
    let sCntrType: string = "";
    if (this.records != null) {
      this.records.forEach(Rec => {
        Cntr_Tot++;
        Teu = 0;
        if (Rec.cntr_type.indexOf("20") >= 0)
          Teu = 1;
        else if (Rec.cntr_type.indexOf("40") >= 0) {
          if (Rec.cntr_type.indexOf("HC") >= 0)
            Teu = 2.25;
          else
            Teu = 2;
        }
        else if (Rec.cntr_type.indexOf("45") >= 0)
          Teu = 2.50;

        // if (this.record.mbl_cntr_type.toString() == "LCL")
        //   Teu = 0;
        Tot_Teu += Teu;
        Tot_Cbm += Rec.cntr_cbm;
        Rec.cntr_teu = Teu;
        if (Teu > 0) {
          if (Rec.cntr_type.indexOf("20") >= 0)
            Tot_20 += 1;
          else if (Rec.cntr_type.indexOf("40HC") >= 0 || Rec.cntr_type.indexOf("40HQ") >= 0)
            Tot_40HQ += 1;
          else if (Rec.cntr_type.indexOf("40") >= 0)
            Tot_40 += 1;
          else if (Rec.cntr_type.indexOf("45") >= 0)
            Tot_45 += 1;
        }

        if (sCntrType.indexOf(Rec.cntr_type) < 0) {
          if (sCntrType != "")
            sCntrType += ",";
          sCntrType += Rec.cntr_type;
        }

      })
    }
    this.record.mbl_teu = Tot_Teu;
    this.record.mbl_20 = Tot_20;
    this.record.mbl_40 = Tot_40;
    this.record.mbl_40HQ = Tot_40HQ;
    this.record.mbl_45 = Tot_45;
    //this.record.mbl_cntr_cbm = Tot_Cbm;
    this.record.mbl_container_tot = Cntr_Tot;
    if (sCntrType.length > 100)
      sCntrType = sCntrType.substring(0, 100);

    // this.record.mbl_cntr_desc = sCntrType;
  }
  private SaveContainer() {
    if (this.records == null)
      return;
    let iCtr: number = 0;
    this.records.forEach(Rec => {
      iCtr++;
      Rec.cntr_hblid = this.pkid.toString();
      Rec.cntr_catg = "M";
      Rec.cntr_order = iCtr;
      Rec.cntr_weight_uom = "";
      Rec.cntr_packages = 0;
    })
  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    if (this.record.mbl_ref_date == "") {
      bRet = false;
      this.errorMessage = "Ref Date cannot be blank";
      return bRet;
    }
    if (this.gs.JOB_TYPE_OT.length > 0 && this.record.mbl_jobtype_id == "") {
      bRet = false;
      this.errorMessage = "Job Type cannot be blank";
      return bRet;
    }
    if (this.record.mbl_shipment_stage == "") {
      bRet = false;
      this.errorMessage = "Shipment Stage cannot be blank";
      return bRet;
    }

    if (this.record.mbl_handled_id == "") {
      bRet = false;
      this.errorMessage = "A/N Handled By cannot be blank"
      return bRet;
    }

    let cntrList: string = "";
    if (this.records != null) {
      this.records.forEach(Rec => {
        if (cntrList.indexOf(Rec.cntr_no.trim()) < 0)
          cntrList += Rec.cntr_no.trim() + ",";
        else {
          bRet = false;
          this.errorMessage = "Container( " + Rec.cntr_no + " ) Duplication in Container List"
          return bRet;
        }

        if (Rec.cntr_no.length != 11) {
          bRet = false;
          this.errorMessage = "Container( " + Rec.cntr_no + " ) Invalid"
          return bRet;
        }
        if (Rec.cntr_type.length <= 0) {
          bRet = false;
          this.errorMessage = "Container( " + Rec.cntr_no + " ) type has to be selected"
          return bRet;
        }
      })
    }
    return bRet;
  }


  Close() {
    this.location.back();
  }


  AddRow() {
    var rec = <Tbl_cargo_container>{};
    rec.cntr_pkid = this.gs.getGuid();
    rec.cntr_hblid = this.pkid.toString();
    rec.cntr_catg = "M";
    rec.cntr_no = "",
      rec.cntr_type = "",
      rec.cntr_sealno = '';
    rec.cntr_pieces = 0;
    rec.cntr_packages_uom = '';
    rec.cntr_packages = 0;
    rec.cntr_weight = 0;
    //  rec.cntr_tare_weight = 0;
    rec.cntr_cbm = 0;
    // rec.cntr_pick_date = '';
    // rec.cntr_return_date = '';
    rec.cntr_weight_uom = '';
    rec.cntr_order = 1;
    this.records.push(rec);
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

    if (_Record.controlname == "POFD") {
      this.record.mbl_pofd_id = _Record.id;
      this.record.mbl_pofd_name = _Record.name;
    }

    if (_Record.controlname == "COUNTRY") {
      this.record.mbl_country_id = _Record.id;
      this.record.mbl_country_name = _Record.name;
    }

    if (_Record.controlname == "SHIPPER") {

      this.record.hbl_shipper_id = _Record.id;
      this.record.hbl_shipper_code = _Record.code;
      this.record.hbl_shipper_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_shipper_name = _Record.col8;

      this.record.hbl_shipper_add1 = _Record.col1;
      this.record.hbl_shipper_add2 = _Record.col2;
      this.record.hbl_shipper_add3 = _Record.col3;
      this.record.hbl_shipper_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      if (_Record.col9 == "Y") {

        // MsgAlertBox mPage = new MsgAlertBox();
        // mPage.PKID = Txt_Shipper_Code.PKID;
        // mPage.SOURCE = "ACCOUNTING-ALERT";
        // mPage.parentpage += delegate(object sender2, string objectName2)
        // {
        //     Dispatcher.BeginInvoke(() => { Txt_Shipper_Name.Focus(); });
        // };
        // mPage.Show();
      }
    }

    if (_Record.controlname == "CONSIGNEE") {
      this.record.hbl_consignee_id = _Record.id;
      this.record.hbl_consignee_code = _Record.code;
      this.record.hbl_consignee_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_consignee_name = _Record.col8;

      this.record.hbl_consignee_add1 = _Record.col1;
      this.record.hbl_consignee_add2 = _Record.col2;
      this.record.hbl_consignee_add3 = this.gs.GetAttention(_Record.col5);
      this.record.hbl_consignee_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      if (_Record.col9 == "Y") {
        // MsgAlertBox mPage = new MsgAlertBox();
        // mPage.PKID = Txt_Shipper_Code.PKID;
        // mPage.SOURCE = "ACCOUNTING-ALERT";
        // mPage.parentpage += delegate(object sender2, string objectName2)
        // {
        //     Dispatcher.BeginInvoke(() => { Txt_Shipper_Name.Focus(); });
        // };
        // mPage.Show();
      }
    }


    // Container
    if (_Record.controlname == "CONTAINER TYPE") {
      this.records.forEach(rec => {
        if (rec.cntr_pkid == _Record.uid) {
          rec.cntr_type = _Record.code;
        }
      });
    }
  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_no': {

        this.IsBLDupliation('MBL', this.record.mbl_no);
        break;
      }
      case 'mbl_liner_bookingno': {

        // this.IsBLDupliation('BOOKING', this.record.mbl_liner_bookingno);
        // break;
      }
    }
  }


  onBlur(field: string, rec: Tbl_cargo_container = null) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'mbl_no': {
        this.record.mbl_no = this.record.mbl_no.toUpperCase();
        break;
      }

      case 'hbl_houseno': {
        this.record.hbl_houseno = this.record.hbl_houseno.toUpperCase();
        break;
      }
      case 'hbl_shipper_name': {
        this.record.hbl_shipper_name = this.record.hbl_shipper_name.toUpperCase();
        break;
      }

      case 'hbl_shipper_add1': {
        this.record.hbl_shipper_add1 = this.record.hbl_shipper_add1.toUpperCase();
        break;
      }
      case 'hbl_shipper_add2': {
        this.record.hbl_shipper_add2 = this.record.hbl_shipper_add2.toUpperCase();
        break;
      }
      case 'hbl_shipper_add3': {
        this.record.hbl_shipper_add3 = this.record.hbl_shipper_add3.toUpperCase();
        break;
      }
      case 'hbl_shipper_add4': {
        this.record.hbl_shipper_add4 = this.record.hbl_shipper_add4.toUpperCase();
        break;
      }

      case 'hbl_consignee_name': {
        this.record.hbl_consignee_name = this.record.hbl_consignee_name.toUpperCase();
        break;
      }

      case 'hbl_consignee_add1': {
        this.record.hbl_consignee_add1 = this.record.hbl_consignee_add1.toUpperCase();
        break;
      }
      case 'hbl_consignee_add2': {
        this.record.hbl_consignee_add2 = this.record.hbl_consignee_add2.toUpperCase();
        break;
      }
      case 'hbl_consignee_add3': {
        this.record.hbl_consignee_add3 = this.record.hbl_consignee_add3.toUpperCase();
        break;
      }
      case 'hbl_consignee_add4': {
        this.record.hbl_consignee_add4 = this.record.hbl_consignee_add4.toUpperCase();
        break;
      }
      case 'hbl_commodity': {
        this.record.hbl_commodity = this.record.hbl_commodity.toUpperCase();
        break;
      }
      case 'hbl_isf_no': {
        this.record.hbl_isf_no = this.record.hbl_isf_no.toUpperCase();
        break;
      }

      case 'hbl_packages': {
        this.record.hbl_packages = this.gs.roundNumber(this.record.hbl_packages, 0);
        break;
      }

      case 'hbl_weight': {
        this.record.hbl_weight = this.gs.roundNumber(this.record.hbl_weight, 3);
        break;
      }
      case 'hbl_lbs': {
        this.record.hbl_lbs = this.gs.roundNumber(this.record.hbl_lbs, 3);
        break;
      }
      case 'hbl_cbm': {
        this.record.hbl_cbm = this.gs.roundNumber(this.record.hbl_cbm, 3);
        break;
      }
      case 'hbl_cft': {
        this.record.hbl_cft = this.gs.roundNumber(this.record.hbl_cft, 3);
        break;
      }
      case 'hbl_chwt': {
        this.record.hbl_chwt = this.gs.roundNumber(this.record.hbl_chwt, 3);
        break;
      }
      case 'hbl_chwt_lbs': {
        this.record.hbl_chwt_lbs = this.gs.roundNumber(this.record.hbl_chwt_lbs, 3);
        break;
      }

      case 'hbl_it_no': {
        this.record.hbl_it_no = this.record.hbl_it_no.toUpperCase();
        break;
      }
      case 'hbl_it_port': {
        this.record.hbl_it_port = this.record.hbl_it_port.toUpperCase();
        break;
      }

      case 'mbl_place_delivery': {
        this.record.mbl_place_delivery = this.record.mbl_place_delivery.toUpperCase();
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

      case 'cntr_no': {
        rec.cntr_no = rec.cntr_no.toUpperCase();
        break;
      }
      case 'cntr_type': {
        rec.cntr_type = rec.cntr_type.toUpperCase();
        break;
      }
      case 'cntr_sealno': {
        rec.cntr_sealno = rec.cntr_sealno.toUpperCase();
        break;
      }
      case 'cntr_pieces': {
        rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
        break;
      }
      case 'cntr_packages_uom': {
        break;
      }
      case 'cntr_weight': {
        rec.cntr_weight = this.gs.roundNumber(rec.cntr_weight, 3);
        break;
      }
      case 'cntr_cbm': {
        rec.cntr_cbm = this.gs.roundNumber(rec.cntr_cbm, 3);
        break;
      }
      //   case 'cntr_tare_weight': {
      //     rec.cntr_tare_weight = this.gs.roundNumber(rec.cntr_tare_weight, 0);
      //     break;
      //   }
    }
  }

  FindWeight(_type: string) {
    if (_type == "Kgs2Lbs")
      this.record.hbl_lbs = this.gs.Convert_Weight("KG2LBS", this.record.hbl_weight, 3);
    else if (_type == "Lbs2Kgs")
      this.record.hbl_weight = this.gs.Convert_Weight("LBS2KG", this.record.hbl_lbs, 3);
    else if (_type == "Cbm2Cft")
      this.record.hbl_cft = this.gs.Convert_Weight("CBM2CFT", this.record.hbl_cbm, 3);
    else if (_type == "Cft2Cbm")
      this.record.hbl_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.hbl_cft, 3);
    else if (_type == "Chwt2Lbs")
      this.record.hbl_chwt_lbs = this.gs.Convert_Weight("KG2LBS", this.record.hbl_chwt, 3);
    else if (_type == "Lbs2Chwt")
      this.record.hbl_chwt = this.gs.Convert_Weight("LBS2KG", this.record.hbl_chwt_lbs, 3);
  }

  AddHouse() {
  }
  ShowCntrMovement() {
  }
}
