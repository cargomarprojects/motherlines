import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { PaymentService } from '../services/payment.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Acc_Payment, vm_tbl_accPayment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_Invoicem';



@Component({
    selector: 'app-payment-edit',
    templateUrl: './payment-edit.component.html'
})
export class PaymentEditComponent implements OnInit {

    record: Tbl_cargo_invoicem = <Tbl_cargo_invoicem>{};
    pendingList: Tbl_cargo_invoicem[] = [];


    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;


    decplace = 0;

    group = 'customer';
    cust_id = "";
    cust_code = "";
    cust_name = "";
    refno = '';
    invno = '';
    custrefno = '';
    curr_code = '';

    str_id = "";
    Search_Mode = "";
    showall: boolean = false;




    where = " ACC_TYPE = 'BANK' ";


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: PaymentService,
    ) {
        this.decplace = this.gs.foreign_amt_dec;
    }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);


        this.menuid = options.menuid;
        this.pkid = options.pkid;
        this.mode = options.mode;


        this.setup();

        this.initPage();
        this.actionHandler();
    }

    setup() {

    }


    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
        this.LoadCombo();
    }

    LoadCombo() {

    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';

        if (this.mode == 'ADD') {

            this.record = <Tbl_cargo_invoicem>{};
            this.pendingList = <Tbl_cargo_invoicem[]>[];

            this.pkid = this.gs.getGuid();
            this.init();
        }
    }

    init() {


        //this.record.rec_created_by = this.gs.user_code;
        //this.record.rec_created_date = this.gs.defaultValues.today;
    }


    getPendingList() {
        var SearchData = this.gs.UserInfo;

        SearchData.pkid = this.pkid;
        if (this.cust_id != '') {
            this.str_id = this.cust_id;
            this.Search_Mode = "CUSTOMER";
            //this.Search_Mode = "GROUP";
        }
        else if (this.refno != '') {
            this.str_id = this.refno;
            this.Search_Mode = "MASTER";
        }
        else if (this.invno != '') {
            this.str_id = this.invno;
            this.Search_Mode = "INVNO";
        }
        else if (this.custrefno != '') {
            this.str_id = this.custrefno;
            this.Search_Mode = "REFNO";
        }
        if (this.Search_Mode == "") {
            alert("Search Data Not Found");
            return;
        }
        SearchData.PKID = this.str_id;
        SearchData.MODE = this.Search_Mode;
        SearchData.SHOWALL = (this.showall) ? "Y" : "N";
        if (this.gs.IS_SINGLE_CURRENCY == true) {
            SearchData.CURRENCY = "";
            SearchData.ISBASECURRENCY = "Y";
        }
        else {
            SearchData.CURRENCY = this.curr_code;
            if (this.curr_code == this.gs.base_cur_code)
                SearchData.ISBASECURRENCY = "Y";
            else
                SearchData.ISBASECURRENCY = "N";
        }
        SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;

        this.mainService.PendingList(SearchData).subscribe(
            res => {
                this.pendingList = res.list;
            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            });

    }



    ProcessData() {
    }

    SaveParent() {

    }




    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;

        this.SaveParent();
        const saveRecord = <vm_tbl_accPayment>{};
        //        saveRecord.record = this.record;
        //      saveRecord.records = this.DetailList;

        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {

                    //this.mainService.RefreshList(this.record);
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

        /*
        if (this.gs.isBlank(this.sdate)) {
            bRet = false;
            this.errorMessage = "Invalid Date";
            alert(this.errorMessage);
            return bRet;
        }
        */
        return bRet;
    }

    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "CUSTOMER") {
            this.cust_id = _Record.id;
            this.cust_code = _Record.code;
            this.cust_name = _Record.name;
        }
    }


    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }

    onBlur2(cb: any) {
    }

    FindTotal() {
    }

    swapSelection(rec: Tbl_cargo_invoicem) {
        rec.inv_flag2 = !rec.inv_flag2;
    }



}
