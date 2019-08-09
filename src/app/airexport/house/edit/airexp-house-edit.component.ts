import { Component, OnInit, ViewChild, ElementRef, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../../core/services/global.service';
import { User_Menu } from '../../../core/models/menum';
import { SearchTable } from '../../../shared/models/searchtable';
import { AirExpHouseService } from '../../services/airexp-house.service';
import { Tbl_cargo_exp_housem, vm_tbl_cargo_exp_housem, Tbl_desc } from '../../models/Tbl_cargo_exp_housem';
import { Tbl_cargo_exp_desc } from '../../models/Tbl_cargo_exp_desc';
import { Tbl_cargo_exp_masterm } from '../../models/tbl_cargo_exp_masterm';

@Component({
  selector: 'app-airexp-house-edit',
  templateUrl: './airexp-house-edit.component.html'
})
export class AirExpHouseEditComponent implements OnInit {


  private pkid: string;
  private menuid: string;
  private mode: string = "ADD";
  private errorMessage: string[] = [];

  private title: string;
  private isAdmin: boolean;

  record: Tbl_cargo_exp_housem = <Tbl_cargo_exp_housem>{};
  recorddet: Tbl_desc = <Tbl_desc>{};

  ShipmentType: string = '';

  @ViewChild('hbl_shipper_name') hbl_shipper_name_ctrl: InputBoxComponent;


  DESC_TYPE: string = "SE-DESC";

  canSave: boolean = false;

  is_locked: boolean = false;
  is_stage_locked = false;

  private parentid: string;
  private mbl_refno: string;
  private type: string;

  private refno: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: AirExpHouseService,
  ) { }


  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.parentid = options.parentid;
    this.pkid = options.pkid;
    this.mbl_refno = options.refno;
    this.type = options.type;
    this.mode = options.mode;

    this.initPage();
    this.actionHandler();
  }

  initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canSave = this.gs.canSave(this.menuid, this.mode);

    this.errorMessage = [];

  }

  actionHandler() {

    this.errorMessage = [];
    this.InitDesc();

    this.is_stage_locked = false;
    this.is_locked = false;

    if (this.mode == 'ADD') {
      this.pkid = this.gs.getGuid();
      this.record = <Tbl_cargo_exp_housem>{};
      this.InitRecord();
      this.LoadData();
    }
    if (this.mode == 'EDIT')
      this.GetRecord();

  }
  InitRecord() {
    this.record.hbl_houseno = "";
    this.record.hbl_date = "";
    this.record.hbl_bltype = "";
    this.record.hbl_frt_status = "";
    this.record.hbl_consignee_id = "";
    this.record.hbl_consignee_code = "";
    this.record.hbl_consignee_name = "";
    this.record.hbl_shipper_id = "";
    this.record.hbl_shipper_code = "";
    this.record.hbl_shipper_name = "";
    this.record.hbl_shipper_add1 = "";
    this.record.hbl_shipper_add2 = "";
    this.record.hbl_shipper_add3 = "";
    this.record.hbl_shipper_add4 = "";
    this.record.hbl_agent_id = "";
    this.record.hbl_agent_name = "";
    this.record.hbl_agent_city = "";
    this.record.hbl_agent_code = "";
    this.record.hbl_cha_id = "";
    this.record.hbl_cha_name = "";
    this.record.hbl_cha_code = "";
    this.record.hbl_asarranged_shipper = "";
    this.record.hbl_asarranged_consignee = "";
    this.record.hbl_asarranged_shipper_b = false;
    this.record.hbl_asarranged_consignee_b = false;
    this.record.hbl_commodity = "";
    this.record.hbl_uom = "";
    this.record.hbl_pcs = 0;
    this.record.hbl_packages = 0;
    this.record.hbl_weight = 0;
    this.record.hbl_lbs = 0;
    this.record.hbl_cbm = 0;
    this.record.hbl_cft = 0;
    this.record.hbl_remark1 = "";
    this.record.hbl_remark2 = "";
    this.record.hbl_remark3 = "";
    this.record.hbl_salesman_id = "";
    this.record.hbl_salesman_code = "";
    this.record.hbl_salesman_name = "";
    this.record.hbl_handled_id = "";
    this.record.hbl_handled_code = "";
    this.record.hbl_handled_name = "";
    this.record.rec_created_by = "";
    this.record.rec_created_date = "";
    this.record.rec_created_email = "";
    this.record.hbl_consigned_to1 = "";
    this.record.hbl_consigned_to2 = "";
    this.record.hbl_consigned_to3 = "";
    this.record.hbl_consigned_to4 = "";
    this.record.hbl_consigned_to5 = "";
    this.record.hbl_consigned_to6 = "";
    this.record.hbl_notify_id = "";
    this.record.hbl_notify_code = "";
    this.record.hbl_notify_name = "";
    this.record.hbl_notify_add1 = "";
    this.record.hbl_notify_add2 = "";
    this.record.hbl_notify_add3 = "";
    this.record.hbl_exp_ref1 = "";
    this.record.hbl_exp_ref2 = "";
    this.record.hbl_exp_ref3 = "";
    this.record.hbl_exp_ref4 = "";
    this.record.hbl_rout1 = "";
    this.record.hbl_rout2 = "";
    this.record.hbl_rout3 = "";
    this.record.hbl_rout4 = "";
    this.record.hbl_goods_nature = "";
    this.record.hbl_place_delivery = "";
    this.record.hbl_pol_name = "";
    this.record.hbl_pod_name = "";
    this.record.hbl_by1 = "";
    this.record.hbl_by2 = "";
    this.record.hbl_by1_carrier = "";
    this.record.hbl_by2_carrier = "";
    this.record.hbl_weight_unit = "";
    this.record.hbl_chwt = 0;
    this.record.hbl_chwt_lbs = 0;
    this.record.hbl_rate = 0;
    this.record.hbl_total = 0;
    this.record.hbl_iata = "";
    this.record.hbl_accno = "";
    this.record.hbl_oc_status = "";
    this.record.hbl_carriage_value = "";
    this.record.hbl_customs_value = "";
    this.record.hbl_ins_amt = "";
    this.record.hbl_class = "";
    this.record.hbl_comm = "";
    this.record.hbl_aesno = "";
    this.record.hbl_lcno = "";
    this.record.hbl_issued_by = "";
    this.record.hbl_issued_date = "";
    this.record.mbl_lock = "";
    this.record.mbl_unlock_date = "";
    this.record.mbl_ref_date = "";
    this.record.hbl_format_id = "";
    this.record.hbl_shipment_stage = "";
    this.record.hbl_charges1 = "";
    this.record.hbl_porc1 = "";
    this.record.hbl_rate1 = "";
    this.record.hbl_total1 = "";
    this.record.hbl_print_shpr1 = "";
    this.record.hbl_print_cons1 = "";
    this.record.hbl_print_shpr1_b = false;
    this.record.hbl_print_cons1_b = false;
    this.record.hbl_pp1 = "";
    this.record.hbl_cc1 = "";
    this.record.hbl_charges2 = "";
    this.record.hbl_porc2 = "";
    this.record.hbl_rate2 = "";
    this.record.hbl_total2 = "";
    this.record.hbl_print_shpr2 = "";
    this.record.hbl_print_cons2 = "";
    this.record.hbl_print_shpr2_b = false;
    this.record.hbl_print_cons2_b = false;
    this.record.hbl_pp2 = "";
    this.record.hbl_cc2 = "";
    this.record.hbl_charges3 = "";
    this.record.hbl_porc3 = "";
    this.record.hbl_rate3 = "";
    this.record.hbl_total3 = "";
    this.record.hbl_print_shpr3 = "";
    this.record.hbl_print_cons3 = "";
    this.record.hbl_print_shpr3_b = false;
    this.record.hbl_print_cons3_b = false;
    this.record.hbl_pp3 = "";
    this.record.hbl_cc3 = "";
    this.record.hbl_charges4 = "";
    this.record.hbl_porc4 = "";
    this.record.hbl_rate4 = "";
    this.record.hbl_total4 = "";
    this.record.hbl_print_shpr4 = "";
    this.record.hbl_print_cons4 = "";
    this.record.hbl_print_shpr4_b = false;
    this.record.hbl_print_cons4_b = false;
    this.record.hbl_pp4 = "";
    this.record.hbl_cc4 = "";
    this.record.hbl_charges5 = "";
    this.record.hbl_porc5 = "";
    this.record.hbl_rate5 = "";
    this.record.hbl_total5 = "";
    this.record.hbl_print_shpr5 = "";
    this.record.hbl_print_cons5 = "";
    this.record.hbl_print_shpr5_b = false;
    this.record.hbl_print_cons5_b = false;
    this.record.hbl_pp5 = "";
    this.record.hbl_cc5 = "";
    this.record.hbl_charges1_carrier = "";
    this.record.hbl_porc1_carrier = "";
    this.record.hbl_rate1_carrier = "";
    this.record.hbl_total1_carrier = "";
    this.record.hbl_print_shpr1_carrier = "";
    this.record.hbl_print_cons1_carrier = "";
    this.record.hbl_print_shpr1_carrier_b = false;
    this.record.hbl_print_cons1_carrier_b = false;
    this.record.hbl_pp1_carrier = "";
    this.record.hbl_cc1_carrier = "";
    this.record.hbl_charges2_carrier = "";
    this.record.hbl_porc2_carrier = "";
    this.record.hbl_rate2_carrier = "";
    this.record.hbl_total2_carrier = "";
    this.record.hbl_print_shpr2_carrier = "";
    this.record.hbl_print_cons2_carrier = "";
    this.record.hbl_print_shpr2_carrier_b = false;
    this.record.hbl_print_cons2_carrier_b = false;
    this.record.hbl_pp2_carrier = "";
    this.record.hbl_cc2_carrier = "";
    this.record.hbl_charges3_carrier = "";
    this.record.hbl_porc3_carrier = "";
    this.record.hbl_rate3_carrier = "";
    this.record.hbl_total3_carrier = "";
    this.record.hbl_print_shpr3_carrier = "";
    this.record.hbl_print_cons3_carrier = "";
    this.record.hbl_print_shpr3_carrier_b = false;
    this.record.hbl_print_cons3_carrier_b = false;
    this.record.hbl_pp3_carrier = "";
    this.record.hbl_cc3_carrier = "";




  }
  LoadData() {

    if (this.mode == "ADD") {
      this.record.hbl_asarranged_shipper = "N";
      this.record.hbl_asarranged_consignee = "N";
      this.record.hbl_print_shpr1 = "N";
      this.record.hbl_print_shpr2 = "N";
      this.record.hbl_print_shpr3 = "N";
      this.record.hbl_print_shpr4 = "N";
      this.record.hbl_print_shpr5 = "N";
      this.record.hbl_print_cons1 = "N";
      this.record.hbl_print_cons2 = "N";
      this.record.hbl_print_cons3 = "N";
      this.record.hbl_print_cons4 = "N";
      this.record.hbl_print_cons5 = "N";
      this.record.hbl_print_shpr1_carrier = "N";
      this.record.hbl_print_shpr2_carrier = "N";
      this.record.hbl_print_shpr3_carrier = "N";
      this.record.hbl_print_cons1_carrier = "N";
      this.record.hbl_print_cons2_carrier = "N";
      this.record.hbl_print_cons3_carrier = "N";

      this.record.hbl_asarranged_shipper_b = false;
      this.record.hbl_asarranged_consignee_b = false;
      this.record.hbl_print_shpr1_b = false;
      this.record.hbl_print_shpr2_b = false;
      this.record.hbl_print_shpr3_b = false;
      this.record.hbl_print_shpr4_b = false;
      this.record.hbl_print_shpr5_b = false;
      this.record.hbl_print_cons1_b = false;
      this.record.hbl_print_cons2_b = false;
      this.record.hbl_print_cons3_b = false;
      this.record.hbl_print_cons4_b = false;
      this.record.hbl_print_cons5_b = false;
      this.record.hbl_print_shpr1_carrier_b = false;
      this.record.hbl_print_shpr2_carrier_b = false;
      this.record.hbl_print_shpr3_carrier_b = false;
      this.record.hbl_print_cons1_carrier_b = false;
      this.record.hbl_print_cons2_carrier_b = false;
      this.record.hbl_print_cons3_carrier_b = false;

      this.record.hbl_frt_status = "";
      this.record.hbl_bltype = "";
      this.record.hbl_shipment_stage = "NIL";


      this.record.hbl_date = this.gs.defaultValues.today;
      this.record.rec_created_by = this.gs.user_code;
      this.record.rec_created_date = this.gs.defaultValues.today;


      if (this.parentid.trim() != "")
        this.LoadMasterData();

      if (this.gs.PARAM_HAWB_FORMAT != null) {
        if (this.gs.PARAM_HAWB_FORMAT.length > 0)
          this.record.hbl_format_id = this.gs.PARAM_HAWB_FORMAT[0].code;
      }

    }

    // if (this.mode == "ADD") {
    //   this.record.hbl_mbl_id = this.parentid;
    //   this.record.rec_created_id = this.gs.user_pkid;
    //   this.record.hbl_frt_status = "";
    //   //this.record.hbl_obl_telex = "N/A";
    //   this.record.hbl_bltype = "";
    //   this.record.rec_created_by = this.gs.user_code;
    //   this.record.rec_created_date = this.gs.defaultValues.today;
    //   this.record.hbl_notify_name = "SAME AS CONSIGNEE";
    //   this.record.hbl_shipment_stage = "NIL";

    //   if (this.parentid != "")
    //     this.LoadDefaultData();

    //   if (this.gs.PARAM_HBL_FORMAT_BLANK.length > 0) {
    //     this.record.hbl_format_id = this.gs.PARAM_HBL_FORMAT_BLANK[0].code;
    //     /*
    //     if (this.gs.DEFAULT_HBL_FORMAT.length > 0)
    //       this.record.hbl_format_id = this.gs.DEFAULT_HBL_FORMAT;
    //     */
    //   }
    //   if (this.gs.PARAM_HBL_FORMAT_DRAFT.length > 0) {
    //     this.record.hbl_draft_format_id = this.gs.PARAM_HBL_FORMAT_DRAFT[0].code;
    //     /*
    //     if (this.gs.DEFAULT_HBL_DRAFTFORMAT.length > 0)
    //       this.record.hbl_draft_format_id = this.gs.DEFAULT_HBL_DRAFTFORMAT;
    //     */
    //   }
    // }

  }

  LoadMasterData() {
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.parentid;
    this.mainService.LoadMasterData(SearchData)
      .subscribe(response => {
        var masRec = <Tbl_cargo_exp_masterm>response.record;

        if (masRec != null) {
          this.record.mbl_refno = masRec.mbl_refno;

          this.record.mbl_no = masRec.mbl_no;
          this.record.hbl_vessel = masRec.mbl_vessel;
          this.record.hbl_voyage = masRec.mbl_voyage;


          this.record.hbl_handled_id = masRec.mbl_handled_id;
          this.record.hbl_handled_name = masRec.mbl_handled_name;

          this.record.hbl_salesman_id = masRec.mbl_salesman_id;
          this.record.hbl_salesman_name = masRec.mbl_salesman_name;

          this.record.hbl_pol_name = this.gs.GetAirportCode(masRec.mbl_pol_code, masRec.mbl_pol_name, masRec.mbl_pol_cntry_code);
          this.record.hbl_pod_name = this.gs.GetAirportCode(masRec.mbl_pod_code, masRec.mbl_pod_name, masRec.mbl_pod_cntry_code);

          this.record.hbl_weight_unit = "KG";
          this.record.hbl_uom = "CTN";


          this.record.hbl_carriage_value = "NVD";
          this.record.hbl_customs_value = "NCV";
          this.record.hbl_ins_amt = "NIL";

          this.record.hbl_iata = this.gs.HBL_IATA;

          this.record.hbl_rout3 = "PLEASE CONTACT WITH CONSIGNEE UPON SHIPMENT ARRIVAL.";

          this.record.hbl_exp_ref1 = this.gs.ISSUE_AGENT_NAME;
          this.record.hbl_exp_ref2 = this.gs.ISSUE_AGENT_ADDRESS;
          this.record.hbl_exp_ref3 = this.gs.ISSUE_AGENT_CITY;


          this.record.hbl_issued_by = masRec.mbl_handled_name;


          this.record.hbl_by1_carrier = this.gs.ADDRESS_LINE1 + " AS AGENT FOR";

          this.record.hbl_by2_carrier = masRec.mbl_liner_name;

          this.record.hbl_agent_name = this.gs.ISSUE_AGENT_NAME;
          this.record.hbl_agent_city = this.gs.ISSUE_AGENT_CITY;

          this.record.hbl_issued_date = masRec.mbl_pol_etd;

          this.is_locked = this.gs.IsShipmentClosed("AIR EXPORT", masRec.mbl_ref_date, masRec.mbl_lock, masRec.mbl_unlock_date);

          // if (Lib.IsShipmentClosed("AIR EXPORT", (DateTime)masRec.mbl_ref_date, masRec.mbl_lock,masRec.mbl_unlock_date))
          // {
          //     LBL_LOCK.Content = "LOCKED";
          //     CmdSave.IsEnabled = false;
          // }
        }

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  LoadDefaultData() {
    // this.errorMessage = [];
    // let SearchData = {
    //   pkid: this.parentid
    // }
    // this.mainService.GetHouseDefaultRecord(SearchData).subscribe(
    //   response => {
    //     var rec = response.record;

    //     this.record.mbl_refno = rec.mbl_refno;
    //     this.record.hbl_agent_id = rec.mbl_agent_id;
    //     this.record.hbl_agent_code = rec.mbl_agent_code;
    //     this.record.hbl_agent_name = rec.mbl_agent_name;
    //     this.record.hbl_pol_name = rec.mbl_pol_name;
    //     this.record.hbl_pod_name = rec.mbl_pod_name;
    //     this.record.hbl_pofd_id = rec.mbl_pofd_id;
    //     this.record.hbl_pofd_code = rec.mbl_pofd_code;
    //     this.record.hbl_pofd_name = rec.mbl_pofd_name;
    //     this.record.hbl_pofd_eta = rec.mbl_pofd_eta;

    //     this.record.mbl_no = rec.mbl_no;
    //     this.record.hbl_vessel = rec.mbl_vessel;
    //     this.record.hbl_voyage = rec.mbl_voyage;
    //     this.record.hbl_handled_id = rec.mbl_handled_id;
    //     this.record.hbl_handled_name = rec.mbl_handled_name;
    //     this.record.hbl_by1 = rec.mbl_handled_name;

    //     this.record.hbl_is_cntrized = (rec.mbl_cntr_type != "OTHERS") ? "Y" : "N";
    //     this.record._hbl_is_cntrized = (rec.mbl_cntr_type != "OTHERS") ? true : false;

    //     this.record.hbl_issued_date = rec.mbl_pol_etd;
    //     this.record.hbl_salesman_id = rec.mbl_salesman_id;
    //     this.record.hbl_salesman_name = rec.mbl_salesman_name;

    //     this.record.hbl_shipment_stage = rec.mbl_shipment_stage;
    //     if (rec.mbl_cntr_type == "FCL" || rec.mbl_cntr_type == "LCL") {
    //       this.record.hbl_shipment_stage = rec.mbl_shipment_stage;
    //       this.is_stage_locked = true;
    //     }
    //     if (rec.mbl_cntr_type == "FCL") {
    //       this.record.desc1 = "SHIPPERS'S LOAD, COUNT, AND SEALED";
    //       this.record.desc2 = "SAID TO CONTAIN";
    //     }
    //     else if (rec.mbl_cntr_type == "LCL" || rec.mbl_cntr_type == "CONSOLE") {
    //       this.record.desc1 = "SAID TO CONTAIN";
    //     }
    //     this.ShipmentType = rec.mbl_cntr_type;
    //     this.is_locked = this.gs.IsShipmentClosed("SEA EXPORT", rec.mbl_ref_date, rec.mbl_lock, rec.mbl_unlock_date);

    //     this.cntrs = <Tbl_cargo_exp_container[]>response.cntrs;

    //     this.cntrs.forEach(rec => {
    //       rec.cntr_pkid = this.gs.getGuid();
    //     });


    //   },
    //   error => {
    //     this.errorMessage.push(this.gs.getError(error));
    //     alert(this.errorMessage[0]);
    //   }
    // );



  }

  GetRecord() {

    // this.errorMessage = [];
    // var SearchData = this.gs.UserInfo;
    // SearchData.pkid = this.pkid;
    // SearchData.desc_type = this.DESC_TYPE;
    // this.mainService.GetRecord(SearchData)
    //   .subscribe(response => {

    //     this.record = <Tbl_cargo_exp_housem>response.record;
    //     this.cntrs = <Tbl_cargo_exp_container[]>response.cntrs;
    //     this.records = <Tbl_cargo_exp_desc[]>response.records;


    //     this.ShipmentType = this.record.mbl_cntr_type;



    //     if (this.ShipmentType == "FCL" || this.ShipmentType == "LCL")
    //       this.is_stage_locked = true;

    //     this.is_locked = this.gs.IsShipmentClosed("SEA EXPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);


    //     if (this.records != null) {
    //       this.records.forEach(rec => {
    //         this.ShowDesc(rec);
    //       });
    //     }

    //     this.record._hbl_is_cntrized = (this.record.hbl_is_cntrized == "Y") ? true : false;
    //     this.record._hbl_is_arranged = (this.record.hbl_is_arranged == "Y") ? true : false;
    //     this.record._hbl_print_kgs = (this.record.hbl_print_kgs == "Y") ? true : false;
    //     this.record._hbl_print_lbs = (this.record.hbl_print_lbs == "Y") ? true : false;

    //   }, error => {
    //     this.errorMessage.push(this.gs.getError(error));

    //   });
  }


  LoadMBL() {
    this.LoadMBLWeight();
    this.LoadMBLDesc();
  }


  LoadMBLWeight() {

    // this.errorMessage = [];

    // let SearchData = {
    //   pkid: this.parentid,
    // }
    // this.mainService.GetMblWeight(SearchData).subscribe(response => {
    //   if (response.record) {
    //     this.record.hbl_weight = response.record.mbld_weight;
    //     this.record.hbl_lbs = response.record.mbld_lbs;
    //     this.record.hbl_cbm = response.record.mbld_cbm;
    //     this.record.hbl_cft = response.record.mbld_cft;
    //   }
    // }, error => {
    //   this.errorMessage.push(this.gs.getError(error));
    //   alert(this.errorMessage[0]);
    // });


  }


  LoadMBLDesc() {

    // this.errorMessage = [];

    // let SearchData = {
    //   pkid: this.parentid,
    //   desc_type: 'MBLDESC',
    // }
    // this.mainService.GetDesc(SearchData).subscribe(response => {

    //   if (response.records != null) {
    //     response.records.forEach(rec => {
    //       this.ShowDesc(rec);
    //     });
    //   }


    // }, error => {
    //   this.errorMessage.push(this.gs.getError(error));
    //   alert(this.errorMessage[0]);
    // });


  }



  LoadContainer() {
    // this.errorMessage = [];
    // let SearchData = {
    //   pkid: this.pkid,
    // }
    // this.mainService.GetContainer(SearchData).subscribe(response => {
    //   this.cntrs = response.records;
    //   this.showContainer();
    // }, error => {
    //   this.errorMessage.push(this.gs.getError(error));
    //   alert(this.errorMessage[0]);
    // });
  }

  GetCntrInfo(CntrNo: string, CntrSealNo: string) {
    if (CntrSealNo.length > 0)
      CntrNo += "/ " + CntrSealNo;
    return CntrNo;
  }

  showContainer() {
    // this.record.mark6 = "CONTAINER NO./ SEAL NO.";
    // if (this.cntrs.length > 0)
    //   this.record.mark7 = this.GetCntrInfo(this.cntrs[0].cntr_no, this.cntrs[0].cntr_sealno);
    // if (this.cntrs.length > 1)
    //   this.record.mark8 = this.GetCntrInfo(this.cntrs[1].cntr_no, this.cntrs[1].cntr_sealno);
    // if (this.cntrs.length > 2)
    //   this.record.mark9 = this.GetCntrInfo(this.cntrs[2].cntr_no, this.cntrs[2].cntr_sealno);
    // if (this.cntrs.length > 3)
    //   this.record.mark10 = this.GetCntrInfo(this.cntrs[10].cntr_no, this.cntrs[10].cntr_sealno);
    // if (this.cntrs.length > 4)
    //   this.record.mark11 = this.GetCntrInfo(this.cntrs[11].cntr_no, this.cntrs[11].cntr_sealno);
    // if (this.cntrs.length > 5)
    //   this.record.mark12 = this.GetCntrInfo(this.cntrs[12].cntr_no, this.cntrs[12].cntr_sealno);
    // if (this.cntrs.length > 6)
    //   this.record.mark13 = this.GetCntrInfo(this.cntrs[13].cntr_no, this.cntrs[13].cntr_sealno);
    // if (this.cntrs.length > 7)
    //   this.record.mark14 = this.GetCntrInfo(this.cntrs[14].cntr_no, this.cntrs[14].cntr_sealno);
    // if (this.cntrs.length > 8)
    //   this.record.mark15 = this.GetCntrInfo(this.cntrs[15].cntr_no, this.cntrs[15].cntr_sealno);
    // if (this.cntrs.length > 9)
    //   this.record.mark16 = this.GetCntrInfo(this.cntrs[16].cntr_no, this.cntrs[16].cntr_sealno);
    // if (this.cntrs.length > 10)
    //   this.record.mark17 = this.GetCntrInfo(this.cntrs[17].cntr_no, this.cntrs[17].cntr_sealno);
  }

  ShowDesc(Rec: Tbl_cargo_exp_desc) {
    // if (Rec.cargo_ctr == 1) {
    //   this.record.mark1 = Rec.cargo_marks; this.record.pkg1 = Rec.cargo_packages; this.record.desc1 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 2) {
    //   this.record.mark2 = Rec.cargo_marks; this.record.pkg2 = Rec.cargo_packages; this.record.desc2 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 3) {
    //   this.record.mark3 = Rec.cargo_marks; this.record.pkg3 = Rec.cargo_packages; this.record.desc3 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 4) {
    //   this.record.mark4 = Rec.cargo_marks; this.record.desc4 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 5) {
    //   this.record.mark5 = Rec.cargo_marks; this.record.desc5 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 6) {
    //   this.record.mark6 = Rec.cargo_marks; this.record.desc6 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 7) {
    //   this.record.mark7 = Rec.cargo_marks; this.record.desc7 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 8) {
    //   this.record.mark8 = Rec.cargo_marks; this.record.desc8 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 9) {
    //   this.record.mark9 = Rec.cargo_marks; this.record.desc9 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 10) {
    //   this.record.mark10 = Rec.cargo_marks; this.record.desc10 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 11) {
    //   this.record.mark11 = Rec.cargo_marks; this.record.desc11 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 12) {
    //   this.record.mark12 = Rec.cargo_marks; this.record.desc12 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 13) {
    //   this.record.mark13 = Rec.cargo_marks; this.record.desc13 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 14) {
    //   this.record.mark14 = Rec.cargo_marks; this.record.desc14 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 15) {
    //   this.record.mark15 = Rec.cargo_marks; this.record.desc15 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 16) {
    //   this.record.mark16 = Rec.cargo_marks; this.record.desc16 = Rec.cargo_description;
    // }
    // if (Rec.cargo_ctr == 17) {
    //   this.record.mark17 = Rec.cargo_marks; this.record.desc17 = Rec.cargo_description;
    // }
  }

  InitDesc() {

    this.recorddet.mark1 = ""; this.recorddet.desc1 = "";
    this.recorddet.mark2 = ""; this.recorddet.desc2 = "";
    this.recorddet.mark3 = ""; this.recorddet.desc3 = "";
    this.recorddet.mark4 = ""; this.recorddet.desc4 = "";
    this.recorddet.mark5 = ""; this.recorddet.desc5 = "";
    this.recorddet.mark6 = ""; this.recorddet.desc6 = "";
    this.recorddet.mark7 = ""; this.recorddet.desc7 = "";
    this.recorddet.mark8 = ""; this.recorddet.desc8 = "";
    this.recorddet.mark9 = ""; this.recorddet.desc9 = "";
    this.recorddet.mark10 = ""; this.recorddet.desc10 = "";
    this.recorddet.desc11 = "";
    this.recorddet.desc12 = "";
    this.recorddet.desc13 = "";
    this.recorddet.desc14 = "";
    this.recorddet.desc15 = "";
    this.recorddet.desc16 = "";
    this.recorddet.desc17 = "";
  }



  Allvalid() {
    let bret = true;

    if (this.gs.isBlank(this.record.hbl_shipper_id) || this.gs.isBlank(this.record.hbl_shipper_code)) {
      this.errorMessage.push("Shipper Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_shipper_name)) {
      this.errorMessage.push("Shipper Name cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_shipper_add1)) {
      this.errorMessage.push("Shipper Address1 cannot be blank");
      bret = false;
    }


    if (this.gs.isBlank(this.record.hbl_consignee_id) || this.gs.isBlank(this.record.hbl_consignee_code)) {
      this.errorMessage.push("Consignee Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_consigned_to1)) {
      this.errorMessage.push("Consignee Name cannot be blank");
      bret = false;
    }

    if (!this.gs.isBlank(this.record.hbl_notify_id)) {

      if (this.gs.isBlank(this.record.hbl_notify_code)) {
        this.errorMessage.push("Notify Code cannot be blank");
        bret = false;
      }
      if (this.gs.isBlank(this.record.hbl_notify_name)) {
        this.errorMessage.push("Notify Name cannot be blank");
        bret = false;
      }
    }

    if (this.gs.isBlank(this.record.hbl_pol_name)) {
      this.errorMessage.push("Pol cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_pod_name)) {
      this.errorMessage.push("Pod cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_handled_id) || this.gs.isBlank(this.record.hbl_handled_name)) {
      this.errorMessage.push("Handled By cannot be blank");
      bret = false;
    }



    if (this.gs.BRANCH_REGION == "USA") {
      if (this.gs.isZero(this.record.hbl_lbs)) {
        this.errorMessage.push("LBS cannot be blank");
        bret = false;
      }

      if (this.gs.isZero(this.record.hbl_cft) && this.ShipmentType != "FCL") {
        this.errorMessage.push("CFT cannot be blank");
        bret = false;
      }
    }

    if (this.gs.isZero(this.record.hbl_weight)) {
      this.errorMessage.push("Weight cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.hbl_cbm) && this.ShipmentType != "FCL") {
      this.errorMessage.push("CBM cannot be blank");
      bret = false;
    }

    if (!bret)
      alert('Error While Saving');

    return bret;
  }

  onBlur(field: string) {

  }


  Save() {

    this.errorMessage = [];

    if (!this.Allvalid())
      return;

    // this.record.hbl_is_cntrized = (this.record._hbl_is_cntrized) ? "Y" : "N";
    // this.record.hbl_is_arranged = (this.record._hbl_is_arranged) ? "Y" : "N";
    // this.record.hbl_print_kgs = (this.record._hbl_print_kgs) ? "Y" : "N";
    // this.record.hbl_print_lbs = (this.record._hbl_print_lbs) ? "Y" : "N";


    this.SaveDescList();

    const saverec = <vm_tbl_cargo_exp_housem>{};

    saverec.mode = this.mode;
    //saverec.pkid = this.pkid;
    saverec.record = this.record;
    //saverec.records = this.recorddet;
    saverec.userinfo = this.gs.UserInfo;

    this.mainService.Save(saverec).subscribe(response => {

      if (response.retvalue) {
        this.record.hbl_houseno = response.refno;
        this.mode = 'EDIT';
      }

    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);

    }
    );

  }


  LovSelected(rec: SearchTable) {

    if (rec.controlname == "SHIPPER") {
      this.record.hbl_shipper_id = rec.id;
      this.record.hbl_shipper_code = rec.code;
      this.record.hbl_shipper_name = rec.name;
      if (rec.col8 != "")
        this.record.hbl_shipper_name = rec.col8;
      this.record.hbl_shipper_add1 = rec.col1;
      this.record.hbl_shipper_add2 = rec.col2;
      this.record.hbl_shipper_add3 = rec.col3;
      this.record.hbl_shipper_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_shipper_id);
      }
    }

    if (rec.controlname == 'CONSIGNEE') {

      this.record.hbl_consignee_id = rec.id;
      this.record.hbl_consigned_to1 = rec.name;
      this.record.hbl_consigned_to2 = rec.col1;
      this.record.hbl_consigned_to3 = rec.col2;
      this.record.hbl_consigned_to4 = rec.col3;
      this.record.hbl_consigned_to5 = this.gs.GetTelFax(rec.col6, rec.col7);

      var sNom = rec.type;
      if (sNom == "NOMINATION" || sNom == "MUTUAL")
        this.record.hbl_bltype = sNom;
      else
        this.record.hbl_bltype = "FREEHAND";

      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_consignee_id);
      }
    }

    if (rec.controlname == "NOTIFY") {
      this.record.hbl_notify_id = rec.id;
      this.record.hbl_notify_code = rec.code;
      this.record.hbl_notify_name = rec.name;
      if (rec.col8 != "")
        this.record.hbl_notify_name = rec.col8;
      this.record.hbl_notify_add1 = rec.col1;
      this.record.hbl_notify_add2 = rec.col2;
      this.record.hbl_notify_add3 = rec.col3;
      // this.record.hbl_notify_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_notify_id);
      }
    }


    if (rec.controlname == "AGENT") {
      this.record.hbl_agent_id = rec.id;
    }

    if (rec.controlname == "HANDLEDBY") {
      this.record.hbl_handled_id = rec.id;
      this.record.hbl_by1 = rec.name;
    }

    if (rec.controlname == "SALEMSAN") {
      this.record.hbl_salesman_id = rec.id;
    }

    // // Container
    // if (rec.controlname == "CONTAINER TYPE") {
    //   this.cntrs.forEach(mrec => {
    //     if (mrec.cntr_pkid == rec.uid) {
    //     }
    //   });
    // }

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
  }

  Close() {
    this.location.back();
  }



  SaveDescList() {

    // this.recorddet = <Tbl_cargo_exp_desc[]>[];

    // this.SaveDesc(1, this.record.mark1, this.record.pkg1, this.record.desc1);
    // this.SaveDesc(2, this.record.mark2, this.record.pkg2, this.record.desc2);
    // this.SaveDesc(3, this.record.mark3, this.record.pkg3, this.record.desc3);

    // this.SaveDesc(4, this.record.mark4, '', this.record.desc4);
    // this.SaveDesc(5, this.record.mark5, '', this.record.desc5);
    // this.SaveDesc(6, this.record.mark6, '', this.record.desc6);
    // this.SaveDesc(7, this.record.mark7, '', this.record.desc7);
    // this.SaveDesc(8, this.record.mark8, '', this.record.desc8);
    // this.SaveDesc(9, this.record.mark9, '', this.record.desc9);
    // this.SaveDesc(10, this.record.mark10, '', this.record.desc10);
    // this.SaveDesc(11, this.record.mark11, '', this.record.desc11);

    // this.SaveDesc(12, this.record.mark12, '', this.record.desc12);
    // this.SaveDesc(13, this.record.mark13, '', this.record.desc13);
    // this.SaveDesc(14, this.record.mark14, '', this.record.desc14);
    // this.SaveDesc(15, this.record.mark15, '', this.record.desc15);
    // this.SaveDesc(16, this.record.mark16, '', this.record.desc16);
    // this.SaveDesc(17, this.record.mark17, '', this.record.desc17);

  }

  SaveDesc(iCtr: number, M1: string, P1: string, D1: string) {
    if (M1.length > 0 || P1.length > 0 || D1.length > 0) {
      //   var Rec: Tbl_cargo_exp_desc = <Tbl_cargo_exp_desc>{};
      //   Rec.parentid = this.pkid;
      //   Rec.parent_type = this.DESC_TYPE;
      //   Rec.cargo_ctr = iCtr;
      //   Rec.cargo_marks = M1;
      //   Rec.cargo_packages = P1;
      //   Rec.cargo_description = D1;
      //   this.recorddet.push(Rec);
    }
  }

  AddRow() {

    // var rec = <Tbl_cargo_exp_container>{};
    // rec.cntr_pkid = this.gs.getGuid();
    // rec.cntr_no = "",
    //   rec.cntr_type = "",
    //   rec.cntr_sealno = '';
    // rec.cntr_packages_uom = '';
    // rec.cntr_movement = "",
    //   rec.cntr_weight = 0;
    // rec.cntr_pieces = 0;
    // rec.cntr_cbm = 0;
    // this.cntrs.push(rec);
  }



}
