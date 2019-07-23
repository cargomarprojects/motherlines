import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../core/services/global.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';

import { MbldService } from '../services/mbld.service';

import { Tbl_cargo_exp_mbldet, vm_Tbl_cargo_exp_mbldet } from '../models/Tbl_cargo_exp_mbldet';
import { Tbl_cargo_exp_desc } from '../models/Tbl_cargo_exp_desc';



@Component({
  selector: 'app-mblpage',
  templateUrl: './mblpage.component.html'
})
export class MblPageComponent implements OnInit {


  private pkid: string;
  private menuid: string;
  private mode: string = "ADD";
  private errorMessage: string;

  private title: string;
  private isAdmin: boolean;

  record: Tbl_cargo_exp_mbldet = <Tbl_cargo_exp_mbldet>{};
  records : Tbl_cargo_exp_desc [] =[];

  recorddet : Tbl_cargo_exp_desc [] =[];

  @ViewChild('mbld_shipper_name') mbld_shipper_name_ctrl: InputBoxComponent;


  DESC_TYPE : string = "MBLDESC";


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: MbldService,
  ) { }


  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.initPage();
    this.actionHandler();
  }

  initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = '';

  }

  actionHandler() {

    this.errorMessage = '';

    this.record = <Tbl_cargo_exp_mbldet>{};
    this.records = <Tbl_cargo_exp_desc[]>[];
    this.InitDesc();
    this.GetRecord();

  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.desc_type = this.DESC_TYPE;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.record = <Tbl_cargo_exp_mbldet>response.record;
        this.records = <Tbl_cargo_exp_desc[]>response.records;

        if ( this.record.mbld_pkid == ""){
          this.record.mbld_type_move = this.record.mbld_ship_term;//default data
          this.record.mbld_notify_name = "SAME AS CONSIGNEE";
          this.record.mbld_is_cntrized = (this.record.mbld_cntr_type != "OTHERS") ? "Y" : "N";
          if (this.record.mbld_cntr_type == "FCL" || this.record.mbld_cntr_type == "CONSOLE")
          {
            this.record.desc1 = "SHIPPERS'S LOAD, COUNT, AND SEALED";
            this.record.desc2 = "SAID TO CONTAIN";
          }
          else if (this.record.mbld_cntr_type == "LCL")
          {
            this.record.desc1 = "SAID TO CONTAIN";
          }
          
        }

        this.InitDesc();
        
        if ( this.records != null) {

          this.records.forEach( rec =>{
              this.ShowDesc(rec);
          });

        }


        this.record._mbld_is_cntrized = false;
        if (this.record.mbld_is_cntrized == "Y")
          this.record._mbld_is_cntrized = true;

        this.record._mbld_print_kgs = false;
        if (this.record.mbld_print_kgs == "Y")
          this.record._mbld_print_kgs = true;

        this.record._mbld_print_lbs = false;
        if (this.record.mbld_print_lbs == "Y")
          this.record._mbld_print_lbs = true;



      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  ShowDesc(Rec : Tbl_cargo_exp_desc )
  {
      if (Rec.cargo_ctr == 1)
      {
          this.record.mark1 = Rec.cargo_marks; this.record.pkg1 = Rec.cargo_packages; this.record.desc1 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 2)
      {
          this.record.mark2 = Rec.cargo_marks; this.record.pkg2 = Rec.cargo_packages; this.record.desc2 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 3)
      {
          this.record.mark3 = Rec.cargo_marks; this.record.pkg3 = Rec.cargo_packages; this.record.desc3 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 4)
      {
          this.record.mark4 = Rec.cargo_marks; this.record.desc4 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 5)
      {
          this.record.mark5 = Rec.cargo_marks; this.record.desc5 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 6)
      {
          this.record.mark6 = Rec.cargo_marks; this.record.desc6 = Rec.cargo_description;
      }      
      if (Rec.cargo_ctr == 7)
      {
          this.record.mark7 = Rec.cargo_marks; this.record.desc7 = Rec.cargo_description;
      }      
      if (Rec.cargo_ctr == 8)
      {
          this.record.mark8 = Rec.cargo_marks; this.record.desc8 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 9)
      {
          this.record.mark9 = Rec.cargo_marks; this.record.desc9 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 10)
      {
          this.record.mark10 = Rec.cargo_marks; this.record.desc10 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 11)
      {
          this.record.mark11 = Rec.cargo_marks; this.record.desc11 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 12)
      {
          this.record.mark12 = Rec.cargo_marks; this.record.desc12 = Rec.cargo_description;
      }
      if (Rec.cargo_ctr == 13)
      {
          this.record.mark13 = Rec.cargo_marks; this.record.desc13 = Rec.cargo_description;
      }      
      if (Rec.cargo_ctr == 14)
      {
          this.record.mark14 = Rec.cargo_marks; this.record.desc14 = Rec.cargo_description;
      }      
      if (Rec.cargo_ctr == 15)
      {
          this.record.mark15 = Rec.cargo_marks; this.record.desc15 = Rec.cargo_description;
      }      
      if (Rec.cargo_ctr == 16)
      {
          this.record.mark16 = Rec.cargo_marks; this.record.desc16 = Rec.cargo_description;
      }      
      if (Rec.cargo_ctr == 17)
      {
          this.record.mark17 = Rec.cargo_marks; this.record.desc17 = Rec.cargo_description;
      }
  }

   InitDesc()
  {
    this.record.mark1 = ""; this.record.pkg1 = ""; this.record.desc1 = "";
    this.record.mark2 = ""; this.record.pkg2 = ""; this.record.desc2 = "";
    this.record.mark3 = ""; this.record.pkg3 = ""; this.record.desc3 = "";
    this.record.mark4 = ""; this.record.desc4= "";
    this.record.mark5 = ""; this.record.desc5= "";
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
    let bRet = true;

    return bRet;
  }

  onBlur(field: string) {

  }



  Save() {

    if (!this.Allvalid())
      return;

    this.SaveDescList();

    const saverec = <vm_Tbl_cargo_exp_mbldet>{};
    
    saverec.mode = this.mode;
    saverec.pkid = this.pkid;
    saverec.record = this.record;
    saverec.records = this.recorddet;
    saverec.userinfo = this.gs.UserInfo;

    this.mainService.Save(saverec).subscribe(response => {

      if (response.retvalue)
        this.mode = 'EDIT';

    }, error => {
      this.errorMessage = this.gs.getError(error);
    }
    );

  }


  LovSelected(rec: SearchTable) {

    if (rec.controlname == "SHIPPER") {
      this.record.mbld_shipper_id = rec.id;
      this.record.mbld_shipper_name = rec.name;
      if (rec.col8 != "")
        this.record.mbld_shipper_name = rec.col8;
      this.record.mbld_shipper_add1 = rec.col1;
      this.record.mbld_shipper_add2 = rec.col2;
      this.record.mbld_shipper_add3 = rec.col3;
      this.record.mbld_shipper_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
    }

    if (rec.controlname == 'CONSIGNEE') {

      this.record.mbld_consignee_id = rec.id;
      this.record.mbld_consigned_to1 = rec.name;
      this.record.mbld_consigned_to2 = rec.col1;
      this.record.mbld_consigned_to3 = rec.col2;
      this.record.mbld_consigned_to4 = rec.col3;
      this.record.mbld_consigned_to5 = this.gs.GetTelFax(rec.col6, rec.col7);

    }

    if (rec.controlname == "NOTIFY") {
      this.record.mbld_notify_id = rec.id;
      this.record.mbld_notify_name = rec.name;
      if (rec.col8 != "")
        this.record.mbld_notify_name = rec.col8;
      this.record.mbld_notify_add1 = rec.col1;
      this.record.mbld_notify_add2 = rec.col2;
      this.record.mbld_notify_add3 = rec.col3;
      this.record.mbld_notify_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
    }


    if (rec.controlname == "AGENT") {
      this.record.mbld_agent_id = rec.id;
    }

    if (rec.controlname == "HANDLEDBY") {
      this.record.mbld_handled_id = rec.id;
    }

    if (rec.controlname == "SALEMSAN") {

    }

  }

  FindWeight(_type: string) {
    if (_type == "Kgs2Lbs")
      this.record.mbld_lbs = this.gs.Convert_Weight("KG2LBS", this.record.mbld_weight, 3);
    else if (_type == "Lbs2Kgs")
      this.record.mbld_weight = this.gs.Convert_Weight("LBS2KG", this.record.mbld_lbs, 3);
    else if (_type == "Cbm2Cft")
      this.record.mbld_cft = this.gs.Convert_Weight("CBM2CFT", this.record.mbld_cbm, 3);
    else if (_type == "Cft2Cbm")
      this.record.mbld_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.mbld_cft, 3);
  }

  Close() {
    this.location.back();
  }



  SaveDescList()
  {

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
  
  SaveDesc(iCtr :  number, M1 : string, P1 :string, D1 : string)
  {
      if (M1.length > 0 || P1.length > 0 || D1.length > 0)
      {
          var Rec : Tbl_cargo_exp_desc =  <Tbl_cargo_exp_desc>{};
          Rec.parentid = this.pkid;
          Rec.parent_type = this.DESC_TYPE;
          Rec.cargo_ctr = iCtr;
          Rec.cargo_marks = M1;
          Rec.cargo_packages = P1;
          Rec.cargo_description = D1;
          this.recorddet.push (Rec);
      }
  }






}
