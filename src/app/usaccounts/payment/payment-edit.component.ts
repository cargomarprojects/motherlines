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

    Old_List: Tbl_cargo_invoicem[] = [];


    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;

    IsRefresh = "";

    txt_Bal_AR = 0;
    txt_Bal_AP = 0;
    txt_Bal_diff = 0;

    txt_tot_AR = 0;
    txt_tot_AP = 0;
    txt_tot_diff = 0;

    txt_diff = 0;

    LBL_COUNT = 0;
    LBL_STATUS = '';

    Pay_RP = "";

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




    where = " ";


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
        if (!this.gs.IS_SINGLE_CURRENCY)
            this.curr_code = this.gs.base_cur_code;
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


        this.Pay_RP = "";

        this.txt_Bal_AP = 0;
        this.txt_Bal_AR = 0;
        this.txt_Bal_diff = 0;

        this.txt_tot_AP = 0;
        this.txt_tot_AR = 0;
        this.txt_tot_diff = 0;

        this.txt_diff = 0;

        this.LBL_COUNT = 0;
        this.LBL_STATUS = '';

        //this.record.rec_created_by = this.gs.user_code;
        //this.record.rec_created_date = this.gs.defaultValues.today;
    }

    RefreshList() {
        this.IsRefresh = "YES";
        this.Old_List = this.pendingList.filter(rec => rec.inv_flag === 'Y' && rec.inv_pay_amt > 0);
        this.FindInvoice();
    }

    FindInvoice() {
        if (this.gs.IS_SINGLE_CURRENCY == false) {
            if (this.curr_code.length <= 0) {
                alert("Currency Code Has to be entered");
                return;
            }
        }

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

                if (this.Search_Mode == "INVNO" || this.Search_Mode == "REFNO" || this.Search_Mode == "MASTER") {
                    if (res.partyname != '')
                        this.cust_name = res.partyname;
                }
                this.pendingList = res.list;

                if (this.IsRefresh == "YES")
                    this.ReProcessInvoiceList();

                this.IsRefresh = "";

                this.FindPartyBalance();

                this.FindTotal();

            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            });
    }

    FindPartyBalance() {
        let nAR = 0;
        let nAP = 0;
        let nDiff = 0;
        nAR = 0;
        nAP = 0;
        nDiff = 0;
        this.pendingList.forEach(mRec => {
            nAR += mRec.inv_ar_total;
            nAP += mRec.inv_ap_total;
            nAR = this.gs.roundNumber(nAR, 2);
            nAP = this.gs.roundNumber(nAP, 2);
        });
        nDiff = nAR - nAP;
        nDiff = this.gs.roundNumber(nDiff, 2);
        this.txt_Bal_AR = nAR;
        this.txt_Bal_AP = nAP;
        this.txt_Bal_diff = nDiff;
        this.txt_diff = nDiff;
    }


    ReProcessInvoiceList() {
        let iCount = 0;
        this.Old_List.forEach(mRec => {
            this.pendingList.forEach(dRec => {
                if (mRec.inv_pkid == dRec.inv_pkid) {
                    dRec.inv_flag = mRec.inv_flag;
                    dRec.inv_flag2 = mRec.inv_flag2;
                    dRec.inv_pay_amt = mRec.inv_pay_amt;
                    iCount++;
                }
            });
        });
        this.LBL_COUNT = iCount;
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
        if (_Record.controlname == "CURRENCY") {
            this.curr_code = _Record.code;
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


    swapSelection(rec: Tbl_cargo_invoicem) {
        rec.inv_flag2 = !rec.inv_flag2;
        rec.inv_flag = (rec.inv_flag2) ? 'Y' : 'N';
        this.FindTotal("CHKBOX", rec);

    }


    FindTotal(sType: string = '', Rec: Tbl_cargo_invoicem = null) {
        var nAR = 0;
        var nAP = 0;
        var nDiff = 0;
        var nPayAmt = 0;

        var iCount = 0;


        if (sType == "CHKBOX") {
            if (Rec != null) {
                if (Rec.inv_ar_total <= 0 && Rec.inv_ap_total <= 0) {
                    Rec.inv_flag = "N";
                    return;
                }
                if (Rec.inv_flag == "Y")
                    Rec.inv_pay_amt = Rec.inv_balance;
                else
                    Rec.inv_pay_amt = null;
            }
        }

        if (Rec != null) {
            nAR = Rec.inv_ar_total;
            nAP = Rec.inv_ap_total;
            nPayAmt = Rec.inv_pay_amt;
            if (nAR > 0)
                nDiff = nAR;
            if (nAP > 0)
                nDiff = nAP;
            nAR = 0;
            nAP = 0;
            nDiff = 0;
        }

        this.pendingList.forEach(mRec => {
            if (mRec.inv_flag == "Y") {
                iCount++;
                if (mRec.inv_ar_total > 0) {
                    nAR += mRec.inv_pay_amt;
                    nAR = this.gs.roundNumber(nAR, 2);
                }
                else {
                    nAP += mRec.inv_pay_amt;
                    nAP = this.gs.roundNumber(nAP, 2);
                }
            }
            else {
                mRec.inv_pay_amt = null;
            }
        })

        nDiff = nAR - nAP;

        nDiff = this.gs.roundNumber(nDiff, 2);

        this.txt_tot_AR = nAR;
        this.txt_tot_AP = nAP;
        this.txt_tot_diff = nDiff;

        this.LBL_COUNT = iCount;

        this.LBL_STATUS = "";
        this.Pay_RP = "";
        if (nDiff > 0) {
            this.Pay_RP = "RECEIPT";
            this.LBL_STATUS = "RECEIPT AMT " + nDiff.toString();
        }
        else if (nDiff < 0) {
            this.Pay_RP = "PAYMENT";
            this.LBL_STATUS = "PAYMENT AMT " + Math.abs(nDiff).toString();
        }


        var nBal2 = this.txt_Bal_diff;
        nDiff = nBal2 - nDiff;
        nDiff = this.gs.roundNumber(nDiff, 2);
        this.txt_diff = nDiff;

    }







}
