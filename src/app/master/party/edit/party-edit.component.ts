import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { PartyService } from '../../services/party.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_Mast_Partym, vm_Tbl_Mast_Partym } from '../../models/Tbl_Mast_Partym';
import { SearchTable } from '../../../shared/models/searchtable';
import { Tbl_Mast_Contacts } from '../../../marketing/models/tbl_cargo_journals_master';

@Component({
  selector: 'app-party-edit',
  templateUrl: './party-edit.component.html'
})
export class PartyEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  //@ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;

  record: Tbl_Mast_Partym = <Tbl_Mast_Partym>{};
  records: Tbl_Mast_Contacts[] = [];
  /*
    01-07-2019 Created By Ajith  
  */

  locationList: any[] = [];

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  attach_title: string = '';
  attach_parentid: string = '';
  attach_subid: string = '';
  attach_type: string = '';
  attach_typelist: any = {};
  attach_tablename: string = '';
  attach_tablepkcolumn: string = '';
  attach_refno: string = '';
  attach_customername: string = '';
  attach_updatecolumn: string = '';
  attach_viewonlysource: string = '';
  attach_viewonlyid: string = '';
  attach_filespath: string = '';
  attach_filespath2: string = '';

  private pkid: string = "";
  private menuid: string;
  private hbl_pkid: string = '';
  private hbl_mode: string = '';

  private mode: string;

  private errorMessage: string;

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};


  //IsLocked: boolean = false;
  is_locked: boolean = false;
  gen_branch_b: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: PartyService,
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
    this.locationList = <any[]>[];
    this.gs.CompanyList.forEach(rec => {
      if (rec.comp_code != "ALL")
        this.locationList.push(rec);
    });
    this.errorMessage = '';
  }


  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    this.is_locked = false;
    if (this.mode == 'ADD') {
      this.record = <Tbl_Mast_Partym>{};
      this.records = <Tbl_Mast_Contacts[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.gen_pkid = this.pkid;
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.gen_code = '';
    this.record.gen_name = '';
    this.record.gen_short_name = '';
    this.record.gen_address1 = '';
    this.record.gen_address2 = '';
    this.record.gen_address3 = '';
    this.record.gen_address4 = '';
    this.record.gen_location = '';
    this.record.gen_state = '';
    this.record.gen_contact = '';
    this.record.gen_title = '';
    this.record.gen_title = '';
    this.record.gen_tel = '';
    this.record.gen_mobile = '';
    this.record.gen_fax = '';
    this.record.gen_refer_by = '';
    this.record.gen_ctpat_no = '';
    this.record.gen_web = '';
    this.record.gen_email = '';
    this.record.gen_pincode = '';
    this.record.gen_firm_code = '';
    this.record.gen_einirsno = '';
    this.record.gen_cha_code = '';
    this.record.gen_cha_id = '';
    this.record.gen_parent_name = '';
    this.record.gen_parent_id = '';
    this.record.gen_curr_code = '';
    this.record.gen_is_importer = 'N';
    this.record.gen_is_exporter = 'N';
    this.record.gen_is_terminal = 'N';
    this.record.gen_is_terminal2 = 'N';
    this.record.gen_is_shipper = 'N';
    this.record.gen_is_consignee = 'N';
    this.record.gen_is_cha = 'N';
    this.record.gen_is_forwarder = 'N';
    this.record.gen_is_agent = 'N';
    this.record.gen_is_carrier = 'N';
    this.record.gen_is_trucker = 'N';
    this.record.gen_is_vendor = 'N';
    this.record.gen_is_warehouse = 'N';
    this.record.gen_is_miscellaneous = 'N';
    this.record.gen_is_employees = 'N';
    this.record.gen_is_tbd = 'N';
    this.record.gen_is_bank = 'N';
    this.record.gen_is_carrier2_sea = 'N';
    this.record.gen_is_shipper_vendor = 'N';
    this.record.gen_is_contractor = 'N';
    this.record.gen_is_ctpat = 'N';
    this.record.gen_days = '';
    this.record.gen_nomination = '';
    this.record.gen_priority = '';
    this.record.gen_brokers = '';
    this.record.gen_poa_customs_yn = 'N';
    this.record.gen_poa_isf_yn = 'N';
    this.record.gen_bond_yn = 'N';
    this.record.gen_purch_from = '';
    this.record.gen_bondno = '';
    this.record.gen_country_name = '';
    this.record.gen_country_id = '';
    this.record.gen_salesman_name = '';
    this.record.gen_salesman_id = '';
    this.record.gen_handled_name = '';
    this.record.gen_handled_id = '';
    this.record.gen_bond_expdt = '';
    this.record.gen_chb_name = '';
    this.record.gen_chb_add1 = '';
    this.record.gen_chb_add2 = '';
    this.record.gen_chb_add3 = '';
    this.record.gen_chb_contact = '';
    this.record.gen_chb_tel = '';
    this.record.gen_chb_fax = '';
    this.record.gen_chb_email = '';
    this.record.gen_criteria = '';
    this.record.gen_min_profit = '';
    this.record.gen_branch = '';
    this.record.gen_protected = '';
    this.record.gen_is_actual_vendor = 'N';
    this.record.gen_is_splac = 'N';
    this.record.gen_splac_memo = '';
    this.record.gen_is_blackac = 'N';
    this.record.gen_handled_loc_id = '';
    this.record.gen_cust_group_id = '';
    this.record.gen_is_acc_alert = 'N';





    // this.record.mbl_prefix = this.gs.AIR_EXPORT_REFNO_PREFIX;
    // this.record.mbl_startingno = this.gs.AIR_EXPORT_REFNO_STARTING_NO;
    // // if (this.gs.BRANCH_REGION == "USA")
    // //   this.record.mbl_currency = "USD";
    // // else
    // //   this.record.mbl_currency = "AED";
    // this.record.mbl_no = '';
    // this.record.mbl_refno = '';
    // this.record.mbl_ref_date = this.gs.defaultValues.today;
    // this.record.mbl_date = '';
    // this.record.mbl_frt_status = '';
    // this.record.mbl_liner_id = '';
    // this.record.mbl_liner_name = '';
    // this.record.mbl_liner_code = '';
    // this.record.mbl_agent_id = '';
    // this.record.mbl_agent_name = '';
    // this.record.mbl_agent_code = '';
    // this.record.mbl_pod_id = '';
    // this.record.mbl_pod_code = '';
    // this.record.mbl_pod_name = '';
    // this.record.mbl_pod_cntry_code = '';
    // this.record.mbl_pol_id = '';
    // this.record.mbl_pol_code = '';
    // this.record.mbl_pol_name = '';
    // this.record.mbl_pol_cntry_code = '';
    // this.record.mbl_liner_bookingno = '';
    // this.record.mbl_direct = 'N';
    // this.record.mbl_direct_bool = false;
    // this.record.mbl_pol_etd = '';
    // this.record.mbl_pod_eta = '';
    // this.record.mbl_vessel = '';
    // this.record.mbl_voyage = '';
    // this.record.mbl_currency = '';
    // this.record.mbl_to_port1 = '';
    // this.record.mbl_to_port2 = '';
    // this.record.mbl_to_port3 = '';
    // this.record.mbl_by_carrier1 = '';
    // this.record.mbl_by_carrier2 = '';
    // this.record.mbl_by_carrier3 = '';
    // this.record.mbl_country_id = '';
    // this.record.mbl_country_name = '';
    // this.record.mbl_handled_id = '';
    // this.record.mbl_handled_name = '';
    // this.record.mbl_mawb_weight = 0;
    // this.record.mbl_mawb_chwt = 0;
    // this.record.mbl_jobtype_id = '';
    // this.record.mbl_jobtype_name = '';
    // this.record.mbl_shipment_stage = 'NIL';
    // this.record.mbl_salesman_id = '';
    // this.record.mbl_salesman_name = '';
    // this.record.mbl_3rdparty = 'N';
    // this.record.mbl_3rdparty_bool = false;
    if (this.gs.JOB_TYPE_AI.length > 0) {
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
        this.record = <Tbl_Mast_Partym>response.record;
        this.records = <Tbl_Mast_Contacts[]>response.hrecords;
        this.mode = 'EDIT';
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  Save() {

    if (!this.Allvalid())
      return;

    // this.record.mbl_direct = this.record.mbl_direct_bool ? 'Y' : 'N';
    // this.record.mbl_3rdparty = this.record.mbl_3rdparty_bool ? 'Y' : 'N';

    const saveRecord = <vm_Tbl_Mast_Partym>{};
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
            this.record.gen_code = response.code;
          this.mode = 'EDIT';
          this.mainService.RefreshList(this.record);
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
    // if (this.record.mbl_ref_date == "") {
    //   bRet = false;
    //   this.errorMessage = "Ref Date cannot be blank";
    //   return bRet;
    // }

    // if (this.gs.JOB_TYPE_AE.length > 0 && this.record.mbl_jobtype_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Job Type cannot be blank";
    //   return bRet;
    // }

    // if (this.record.mbl_shipment_stage == "") {
    //   bRet = false;
    //   this.errorMessage = "Shipment Stage cannot be blank";
    //   return bRet;
    // }
    // if (this.record.mbl_no == "") {
    //   bRet = false;
    //   this.errorMessage = "Master BL# can't be blank"
    //   return bRet;
    // }

    // if (this.record.mbl_agent_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Master Agent cannot be blank"
    //   return bRet;
    // }
    // if (this.record.mbl_liner_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Carrier cannot be blank"
    //   return bRet;
    // }
    // if (this.record.mbl_handled_id == "") {
    //   bRet = false;
    //   this.errorMessage = "A/N Handled By cannot be blank"
    //   return bRet;
    // }

    // if (this.record.mbl_frt_status == "") {
    //   bRet = false;
    //   this.errorMessage = "Freight status cannot be blank"
    //   return bRet;
    // }

    // if (this.record.mbl_pol_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Port of Loading cannot be blank"
    //   return bRet;
    // }
    // if (this.record.mbl_pol_etd == "") {
    //   bRet = false;
    //   this.errorMessage = "ETD cannot be blank"
    //   return bRet;
    // }
    // if (this.record.mbl_pod_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Port of Discharge cannot be blank"
    //   return bRet;
    // }
    // if (this.record.mbl_pod_eta == "") {
    //   bRet = false;
    //   this.errorMessage = "ETA cannot be blank"
    //   return bRet;
    // }
    // // if (this.record.mbl_pofd_id == "") {
    // //   bRet = false;
    // //   this.errorMessage = "Final Destination cannot be blank"
    // //   return bRet;
    // // }

    // if (this.record.mbl_country_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Country Cannot be blank"
    //   return bRet;
    // }
    // // if (this.record.mbl_currency == "") {
    // //   bRet = false;
    // //   this.errorMessage = "Currency cannot be blank"
    // //   return bRet;
    // // }

    // if (this.record.mbl_mawb_weight <= 0) {
    //   bRet = false;
    //   this.errorMessage = "Invalid Weight"
    //   return bRet;
    // }

    // if (this.record.mbl_mawb_chwt <= 0) {
    //   bRet = false;
    //   this.errorMessage = "Invalid Ch.Weight"
    //   return bRet;
    // }

    // if (!this.IsValidAWB(this.record.mbl_no)) {
    //   bRet = false;
    //   this.errorMessage = "Invalid Master BL#"
    //   return bRet;
    // }

    return bRet;

  }

  IsValidAWB(Awb: string) {
    let strnum: string = "0123456789";
    let i: number = 0;//"".indexOf(snum)<0
    let strChar: string = '';
    Awb = Awb.trim();
    if (Awb.length != 11)
      return false;
    for (i = 0; i < Awb.length; i++) {
      strChar = Awb.substr(i, 1);
      if (strnum.indexOf(strChar) < 0)
        return false;
    }
    return true;
  }

  Close() {
    this.location.back();
  }

  LovSelected(_Record: SearchTable) {

    // if (_Record.controlname == "AGENT") {
    //   this.record.mbl_agent_id = _Record.id;
    //   this.record.mbl_agent_name = _Record.name;
    // }
    // if (_Record.controlname == "CARRIER") {
    //   this.record.mbl_liner_id = _Record.id;
    //   this.record.mbl_liner_name = _Record.name;
    // }
    // if (_Record.controlname == "HANDLEDBY") {
    //   this.record.mbl_handled_id = _Record.id;
    //   this.record.mbl_handled_name = _Record.name;
    // }
    // if (_Record.controlname == "SALESMAN") {
    //   this.record.mbl_salesman_id = _Record.id;
    //   this.record.mbl_salesman_name = _Record.name;
    // }
    // if (_Record.controlname == "POL") {
    //   this.record.mbl_pol_id = _Record.id;
    //   this.record.mbl_pol_name = _Record.name;
    // }

    // if (_Record.controlname == "POD") {
    //   this.record.mbl_pod_id = _Record.id;
    //   this.record.mbl_pod_name = _Record.name;
    // }

    // if (_Record.controlname == "COUNTRY") {
    //   this.record.mbl_country_id = _Record.id;
    //   this.record.mbl_country_name = _Record.name;
    // }

  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_no': {
        // this.IsBLDupliation('MBL', this.record.mbl_no);
        // break;
      }
    }
  }


  onBlur(field: string) {
    switch (field) {
      case 'gen_pincode': {
        this.record.gen_pincode = this.record.gen_pincode.toUpperCase();
        break;
      }
      //   case 'mbl_no': {
      //     this.record.mbl_no = this.record.mbl_no.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_liner_bookingno': {
      //     this.record.mbl_liner_bookingno = this.record.mbl_liner_bookingno.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_vessel': {
      //     this.record.mbl_vessel = this.record.mbl_vessel.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_voyage': {
      //     this.record.mbl_voyage = this.record.mbl_voyage.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_to_port1': {
      //     this.record.mbl_to_port1 = this.record.mbl_to_port1.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_by_carrier1': {
      //     this.record.mbl_by_carrier1 = this.record.mbl_by_carrier1.toUpperCase();
      //     break;
      //   }

      //   case 'mbl_to_port2': {
      //     this.record.mbl_to_port2 = this.record.mbl_to_port2.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_by_carrier2': {
      //     this.record.mbl_by_carrier2 = this.record.mbl_by_carrier2.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_to_port3': {
      //     this.record.mbl_to_port3 = this.record.mbl_to_port3.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_by_carrier3': {
      //     this.record.mbl_by_carrier3 = this.record.mbl_by_carrier3.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_mawb_weight': {
      //     this.record.mbl_mawb_weight = this.gs.roundNumber(this.record.mbl_mawb_weight, 3);
      //     break;
      //   }
      //   case 'mbl_mawb_chwt': {
      //     this.record.mbl_mawb_chwt = this.gs.roundNumber(this.record.mbl_mawb_chwt, 3);
      //     break;
      //   }

    }
  }


  BtnNavigation(action: string) {

    switch (action) {
      case 'ARAP': {
        let prm = {
          menuid: this.gs.MENU_AI_MASTER_ARAP,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.gen_code,
          mbl_type: 'AI',
          origin: 'airimp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
        break;
      }
      case 'PROFITREPORT': {
        let prm = {
          menuid: this.gs.MENU_AI_MASTER_PROFIT_REPORT,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.gen_code,
          mbl_type: 'AI',
          origin: 'airimp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/ProfitReportPage', JSON.stringify(prm));
        break;
      }
      case 'ATTACHMENT': {
        let TypeList: any[] = [];
        TypeList = [{ "code": "EMAIL", "name": "E-MAIL" }, { "code": "HOUSEBL", "name": "HOUSE B/L" }, { "code": "MASTER", "name": "MASTER" }, { "code": "PAYMENT SETTLEMENT", "name": "OTHERS" }];
        this.attach_title = 'Documents';
        this.attach_parentid = this.pkid;
        this.attach_subid = '';
        this.attach_type = 'PAYMENT SETTLEMENT';
        this.attach_typelist = TypeList;
        this.attach_tablename = 'cargo_masterm';
        this.attach_tablepkcolumn = 'mbl_pkid';
        this.attach_refno = this.record.gen_code;
        this.attach_customername = '';
        this.attach_updatecolumn = 'REC_FILES_ATTACHED';
        this.attach_viewonlysource = '';
        this.attach_viewonlyid = '';
        this.attach_filespath = '';
        this.attach_filespath2 = '';
        this.tab = 'attachment';
        break;
      }

    }
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }
}
