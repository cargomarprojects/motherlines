import { Component, OnInit, ViewChild, ElementRef, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../core/services/global.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';

import { HouseService } from '../services/house.service';

import { Tbl_cargo_exp_housem, vm_Tbl_cargo_exp_housem } from '../models/Tbl_cargo_exp_housem';
import { Tbl_cargo_exp_desc } from '../models/Tbl_cargo_exp_desc';
import { Tbl_cargo_container } from 'src/app/other/models/tbl_cargo_general';
import { Tbl_cargo_exp_container } from '../models/tbl_cargo_exp_masterm';



@Component({
  selector: 'app-housepage',
  templateUrl: './housepage.component.html'
})
export class HousePageComponent implements OnInit {


  private pkid: string;
  private menuid: string;
  private mode: string = "ADD";

  

  private errorMessage: string[] = [];

  private title: string;
  private isAdmin: boolean;

  record: Tbl_cargo_exp_housem = <Tbl_cargo_exp_housem>{};
  records: Tbl_cargo_exp_desc[] = [];

  recorddet: Tbl_cargo_exp_desc[] = [];

  cntrs: Tbl_cargo_container[] = [];

  ShipmentType: string = '';

  @ViewChild('hbl_shipper_name') hbl_shipper_name_ctrl: InputBoxComponent;


  DESC_TYPE: string = "SE-DESC";

  canSave : boolean = false;

  private parentid : string ;
  private mbl_refno : string ;
  private type : string ;

  private refno : string ;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: HouseService,
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
    this.canSave =  this.gs.canSave(this.menuid, this.mode);

    this.errorMessage = [];

  }

  actionHandler() {

    this.errorMessage = [];
    this.InitDesc();
    if ( this.mode == 'ADD')
    {
      this.pkid = this.gs.getGuid();
      this.record = <Tbl_cargo_exp_housem>{};
      this.cntrs = <Tbl_cargo_exp_container[]>[];
      this.records = <Tbl_cargo_exp_desc[]>[];

    }
    if ( this.mode == 'EDIT')
      this.GetRecord();

  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.desc_type = this.DESC_TYPE;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.record = <Tbl_cargo_exp_housem>response.record;
        this.cntrs = <Tbl_cargo_exp_container[]>response.cntrs;
        this.records = <Tbl_cargo_exp_desc[]>response.records;


        this.ShipmentType = this.record.mbl_cntr_type;
        
        /*
        cmb_Frt_Status.SelectedValue = this.record.hbl_frt_status;
        Cmb_Nomination.SelectedValue = this.record..hbl_bltype;
        CmbHblFormat.SelectedValue = ParentRec.hbl_format_id;
        CmbHblFormat_Draft.SelectedValue = ParentRec.hbl_draft_format_id;
        if (this.ShipmentType == "FCL" || this.ShipmentType == "LCL")
        {
            Cmb_Shpmnt_Stage.IsEnabled = false;
        }
        if (Lib.IsShipmentClosed("SEA EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
        {
            IsLocked = true;
            LBL_LOCK.Content = "LOCKED";
            CmdSave.IsEnabled = false;
        }
        else
            LBL_LOCK.Content = "UNLOCKED";
        */


        if (this.records != null) {
          this.records.forEach(rec => {
            this.ShowDesc(rec);
          });
        }

        this.record._hbl_is_cntrized = (this.record.hbl_is_cntrized == "Y") ? true : false;
        this.record._hbl_is_arranged = (this.record.hbl_is_arranged == "Y") ? true : false;
        this.record._hbl_print_kgs = (this.record.hbl_print_kgs == "Y") ? true : false;
        this.record._hbl_print_lbs = (this.record.hbl_print_lbs == "Y") ? true : false;

      }, error => {
        this.errorMessage.push(this.gs.getError(error));

      });
  }


  LoadContainer() {
    this.errorMessage = [];
    let SearchData = {
      pkid: this.pkid,
    }
    this.mainService.GetContainer(SearchData).subscribe(response => {
      this.cntrs = response.records;
      this.showContainer();
    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);
    });
  }

  GetCntrInfo(CntrNo: string, CntrSealNo: string) {
    if (CntrSealNo.length > 0)
      CntrNo += "/ " + CntrSealNo;
    return CntrNo;
  }

  showContainer() {
    this.record.mark6 = "CONTAINER NO./ SEAL NO.";
    if (this.cntrs.length > 0)
      this.record.mark7 = this.GetCntrInfo(this.cntrs[0].cntr_no, this.cntrs[0].cntr_sealno);
    if (this.cntrs.length > 1)
      this.record.mark8 = this.GetCntrInfo(this.cntrs[1].cntr_no, this.cntrs[1].cntr_sealno);
    if (this.cntrs.length > 2)
      this.record.mark9 = this.GetCntrInfo(this.cntrs[2].cntr_no, this.cntrs[2].cntr_sealno);
    if (this.cntrs.length > 3)
      this.record.mark10 = this.GetCntrInfo(this.cntrs[10].cntr_no, this.cntrs[10].cntr_sealno);
    if (this.cntrs.length > 4)
      this.record.mark11 = this.GetCntrInfo(this.cntrs[11].cntr_no, this.cntrs[11].cntr_sealno);
    if (this.cntrs.length > 5)
      this.record.mark12 = this.GetCntrInfo(this.cntrs[12].cntr_no, this.cntrs[12].cntr_sealno);
    if (this.cntrs.length > 6)
      this.record.mark13 = this.GetCntrInfo(this.cntrs[13].cntr_no, this.cntrs[13].cntr_sealno);
    if (this.cntrs.length > 7)
      this.record.mark14 = this.GetCntrInfo(this.cntrs[14].cntr_no, this.cntrs[14].cntr_sealno);
    if (this.cntrs.length > 8)
      this.record.mark15 = this.GetCntrInfo(this.cntrs[15].cntr_no, this.cntrs[15].cntr_sealno);
    if (this.cntrs.length > 9)
      this.record.mark16 = this.GetCntrInfo(this.cntrs[16].cntr_no, this.cntrs[16].cntr_sealno);
    if (this.cntrs.length > 10)
      this.record.mark17 = this.GetCntrInfo(this.cntrs[17].cntr_no, this.cntrs[17].cntr_sealno);
  }

  ShowDesc(Rec: Tbl_cargo_exp_desc) {
    if (Rec.cargo_ctr == 1) {
      this.record.mark1 = Rec.cargo_marks; this.record.pkg1 = Rec.cargo_packages; this.record.desc1 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 2) {
      this.record.mark2 = Rec.cargo_marks; this.record.pkg2 = Rec.cargo_packages; this.record.desc2 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 3) {
      this.record.mark3 = Rec.cargo_marks; this.record.pkg3 = Rec.cargo_packages; this.record.desc3 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 4) {
      this.record.mark4 = Rec.cargo_marks; this.record.desc4 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 5) {
      this.record.mark5 = Rec.cargo_marks; this.record.desc5 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 6) {
      this.record.mark6 = Rec.cargo_marks; this.record.desc6 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 7) {
      this.record.mark7 = Rec.cargo_marks; this.record.desc7 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 8) {
      this.record.mark8 = Rec.cargo_marks; this.record.desc8 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 9) {
      this.record.mark9 = Rec.cargo_marks; this.record.desc9 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 10) {
      this.record.mark10 = Rec.cargo_marks; this.record.desc10 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 11) {
      this.record.mark11 = Rec.cargo_marks; this.record.desc11 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 12) {
      this.record.mark12 = Rec.cargo_marks; this.record.desc12 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 13) {
      this.record.mark13 = Rec.cargo_marks; this.record.desc13 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 14) {
      this.record.mark14 = Rec.cargo_marks; this.record.desc14 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 15) {
      this.record.mark15 = Rec.cargo_marks; this.record.desc15 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 16) {
      this.record.mark16 = Rec.cargo_marks; this.record.desc16 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 17) {
      this.record.mark17 = Rec.cargo_marks; this.record.desc17 = Rec.cargo_description;
    }
  }

  InitDesc() {
    this.record.mark1 = ""; this.record.pkg1 = ""; this.record.desc1 = "";
    this.record.mark2 = ""; this.record.pkg2 = ""; this.record.desc2 = "";
    this.record.mark3 = ""; this.record.pkg3 = ""; this.record.desc3 = "";
    this.record.mark4 = ""; this.record.desc4 = "";
    this.record.mark5 = ""; this.record.desc5 = "";
    this.record.mark6 = ""; this.record.desc6 = "";
    this.record.mark7 = ""; this.record.desc7 = "";
    this.record.mark8 = ""; this.record.desc8 = "";
    this.record.mark9 = ""; this.record.desc9 = "";
    this.record.mark10 = ""; this.record.desc10 = "";
    this.record.mark11 = ""; this.record.desc11 = "";
    this.record.mark12 = ""; this.record.desc12 = "";
    this.record.mark13 = ""; this.record.desc13 = "";
    this.record.mark14 = ""; this.record.desc14 = "";
    this.record.mark15 = ""; this.record.desc15 = "";
    this.record.mark16 = ""; this.record.desc16 = "";
    this.record.mark17 = ""; this.record.desc17 = "";

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

    this.record.hbl_is_cntrized = (this.record._hbl_is_cntrized) ? "Y" : "N";
    this.record.hbl_is_arranged    = (this.record._hbl_is_arranged) ? "Y" : "N";
    this.record.hbl_print_kgs = (this.record._hbl_print_kgs) ? "Y" : "N";
    this.record.hbl_print_lbs = (this.record._hbl_print_lbs) ? "Y" : "N";


    this.SaveDescList();

    const saverec = <vm_Tbl_cargo_exp_housem>{};

    saverec.mode = this.mode;
    saverec.pkid = this.pkid;
    saverec.record = this.record;
    saverec.records = this.recorddet;
    saverec.userinfo = this.gs.UserInfo;

    this.mainService.Save(saverec).subscribe(response => {

      if (response.retvalue) {
        this.refno= response.refno;
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
    }

    if (rec.controlname == 'CONSIGNEE') {

      this.record.hbl_consignee_id = rec.id;
      this.record.hbl_consigned_to1 = rec.name;
      this.record.hbl_consigned_to2 = rec.col1;
      this.record.hbl_consigned_to3 = rec.col2;
      this.record.hbl_consigned_to4 = rec.col3;
      this.record.hbl_consigned_to5 = this.gs.GetTelFax(rec.col6, rec.col7);

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
      this.record.hbl_notify_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
    }


    if (rec.controlname == "AGENT") {
      this.record.hbl_agent_id = rec.id;
    }

    if (rec.controlname == "HANDLEDBY") {
      this.record.hbl_handled_id = rec.id;
    }

    if (rec.controlname == "SALEMSAN") {

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
  }

  Close() {
    this.location.back();
  }



  SaveDescList() {

    this.recorddet = <Tbl_cargo_exp_desc[]>[];

    this.SaveDesc(1, this.record.mark1, this.record.pkg1, this.record.desc1);
    this.SaveDesc(2, this.record.mark2, this.record.pkg2, this.record.desc2);
    this.SaveDesc(3, this.record.mark3, this.record.pkg3, this.record.desc3);

    this.SaveDesc(4, this.record.mark4, '', this.record.desc4);
    this.SaveDesc(5, this.record.mark5, '', this.record.desc5);
    this.SaveDesc(6, this.record.mark6, '', this.record.desc6);
    this.SaveDesc(7, this.record.mark7, '', this.record.desc7);
    this.SaveDesc(8, this.record.mark8, '', this.record.desc8);
    this.SaveDesc(9, this.record.mark9, '', this.record.desc9);
    this.SaveDesc(10, this.record.mark10, '', this.record.desc10);
    this.SaveDesc(11, this.record.mark11, '', this.record.desc11);

    this.SaveDesc(12, this.record.mark12, '', this.record.desc12);
    this.SaveDesc(13, this.record.mark13, '', this.record.desc13);
    this.SaveDesc(14, this.record.mark14, '', this.record.desc14);
    this.SaveDesc(15, this.record.mark15, '', this.record.desc15);
    this.SaveDesc(16, this.record.mark16, '', this.record.desc16);
    this.SaveDesc(17, this.record.mark17, '', this.record.desc17);

  }

  SaveDesc(iCtr: number, M1: string, P1: string, D1: string) {
    if (M1.length > 0 || P1.length > 0 || D1.length > 0) {
      var Rec: Tbl_cargo_exp_desc = <Tbl_cargo_exp_desc>{};
      Rec.parentid = this.pkid;
      Rec.parent_type = this.DESC_TYPE;
      Rec.cargo_ctr = iCtr;
      Rec.cargo_marks = M1;
      Rec.cargo_packages = P1;
      Rec.cargo_description = D1;
      this.recorddet.push(Rec);
    }
  }


}
