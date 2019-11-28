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



@Component({
    selector: 'app-pay-final',
    templateUrl: './payfinal.component.html'
})
export class PayFinalComponent implements OnInit {

    record: Tbl_Acc_Payment = <Tbl_Acc_Payment>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    total_amount = 0;
    iTotChq = 0;

    docno = '';
    sdate = '';
    id = '';
    code = '';
    name = '';
    remarks = '';

    next_chqno = 0;

    CFNO = "";

    title: string;
    isAdmin: boolean;
    refno: string = "";

    decplace = 0;

    isAccLocked = false;

    showchqdt = true;

    where = " ACC_TYPE = 'BANK' ";

    oldrefno = '';

    arPendingList: Tbl_Acc_Payment[] = [];

    DetailList: Tbl_Acc_Payment[] = [];



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: PaymentService,
    ) {
        this.decplace = this.gs.foreign_amt_dec;
        this.sdate = this.gs.defaultValues.today;
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

        if (this.gs.SHOW_CHECK_DATE == "N") {
            this.showchqdt = false;
        }

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
        this.isAccLocked = false;

        if (this.mode == 'ADD') {
            this.record = <Tbl_Acc_Payment>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
    }

    init() {

        this.record.pay_pkid = this.pkid;
        this.record.pay_vrno = '';
        this.remarks = '';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }



    ProcessData() {
    }

    SaveParent() {
        

    }




    Save() {

        if (!this.Allvalid())
            return;

        this.SaveParent();
        const saveRecord = <vm_tbl_accPayment>{};
        saveRecord.record = this.record;
        saveRecord.records = this.DetailList;

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
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                    this.mode = "ADD";
                    this.actionHandler();
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }


    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.sdate)) {
            bRet = false;
            this.errorMessage = "Invalid Date";
            alert(this.errorMessage);
            return bRet;
        }

        
        return bRet;
    }

    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.id = _Record.id;
            this.code = _Record.code;
            this.name = _Record.name;
        }
    }




    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }

    onBlur2(cb: any) {
        /*
        if (field === 'group_name')
            this.record.acc_group_name = this.record.acc_group_name.toUpperCase();
        */
    }

}
