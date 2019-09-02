import { Component, OnInit } from '@angular/core';
import { Router, PreloadAllModules } from '@angular/router';


import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';

import { User_Menu } from '../models/menum';
import { Modulem } from '../models/modulem';

import { Companym } from '../models/company';
import { Yearm } from '../models/yearm';


@Component({
    selector: 'app-login2',
    templateUrl: './login2.component.html',
    styleUrls: ['./login2.component.css'],
    providers: [LoginService]
})
export class Login2Component implements OnInit {

    loading: boolean = false;
    errorMessage: string = '';


    mRec: Modulem = null;

    CompanyList: Companym[];
    Company_Id: string = '';


    Comp_Row: any;
    Year_Row: any;

    YearList: any[];
    Year_Id: string = '';

    MainList: any[];

    constructor(
        private mainservice: LoginService,
        public GLOBALCONTANTS: GlobalService,
        private router: Router
    ) {

        this.GLOBALCONTANTS.Modules = null;
        this.GLOBALCONTANTS.MenuList = null;

        this.GLOBALCONTANTS.IsAuthenticated = false;
        this.LoadCombo();
    }

    ngOnInit() {
    }

    LoadCombo() {

        this.loading = true;



        let userid = this.GLOBALCONTANTS.user_pkid;
        if (this.GLOBALCONTANTS.user_isadmin == "Y")
            userid = '';


        let SearchData = {
            CompanyId: this.GLOBALCONTANTS.company_pkid,
            User_Id: userid
        };

        this.mainservice.LoadCompanyYearList(SearchData)
            .subscribe(response => {

                this.CompanyList = response.companylist;
                this.YearList = response.yearlist;

                this.GLOBALCONTANTS.SetupCompanyList(response.companylist);

                response.companylist.forEach(a => {
                    if (this.Company_Id == '')
                        this.Company_Id = a.comp_pkid;
                })

                response.yearlist.forEach(a => {
                    this.Year_Id = a.fy_pkid;
                })

                this.loading = false;
            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }

    Login() {

        this.Comp_Row = this.CompanyList.find(a => a.comp_pkid == this.Company_Id);
        this.Year_Row = this.YearList.find(a => a.fy_pkid == this.Year_Id);

        this.GLOBALCONTANTS.user_ua_pkid = this.Comp_Row.ua_pkid;
        this.GLOBALCONTANTS.branch_pkid = this.Comp_Row.comp_pkid;
        this.GLOBALCONTANTS.branch_code = this.Comp_Row.comp_code;
        this.GLOBALCONTANTS.branch_name = this.Comp_Row.comp_name;
        this.GLOBALCONTANTS.branch_add1 = this.Comp_Row.comp_add1;
        this.GLOBALCONTANTS.branch_add2 = this.Comp_Row.comp_add2;
        this.GLOBALCONTANTS.branch_add3 = this.Comp_Row.comp_add3;
        this.GLOBALCONTANTS.branch_add4 = this.Comp_Row.comp_add4;
        this.GLOBALCONTANTS.branch_prefix = this.Comp_Row.comp_prefix;


        //this.GLOBALCONTANTS.USER_LOCATION_ID = Lib.Convert2Integer(this.Comp_Row.comp_code);
        this.GLOBALCONTANTS.REC_BRANCH_CODE = this.Comp_Row.comp_code;

        this.GLOBALCONTANTS.ADDRESS_LINE1 = this.Comp_Row.comp_line1;
        this.GLOBALCONTANTS.ADDRESS_LINE2 = this.Comp_Row.comp_line2;
        this.GLOBALCONTANTS.ADDRESS_LINE3 = this.Comp_Row.comp_line3;
        this.GLOBALCONTANTS.ADDRESS_LINE4 = this.Comp_Row.comp_line4;
        this.GLOBALCONTANTS.ADDRESS_LINE5 = this.Comp_Row.comp_line5;


        this.GLOBALCONTANTS.year_pkid = this.Year_Row.fy_pkid;
        this.GLOBALCONTANTS.year_code = this.Year_Row.fy_code;
        this.GLOBALCONTANTS.year_name = this.Year_Row.fy_name;
        this.GLOBALCONTANTS.year_start_date = this.GLOBALCONTANTS.replaceAll(this.Year_Row.fy_start_date, "/", "-");
        this.GLOBALCONTANTS.year_end_date = this.GLOBALCONTANTS.replaceAll(this.Year_Row.fy_end_date, "/", "-");
        this.GLOBALCONTANTS.year_islocked = this.Year_Row.fy_islocked;

        this.GLOBALCONTANTS.InitUserInfo();

        this.SetupYearList();
        this.LoadSettings();
        this.LoadMenu();

        this.GLOBALCONTANTS.IsAuthenticated = true;

        this.GLOBALCONTANTS.Save2LocalStorage();

        this.router.navigate(['home'], { replaceUrl: true });
    }


    SetupYearList() {
        this.GLOBALCONTANTS.YearList = [];
        this.GLOBALCONTANTS.software_start_year = 0;

        this.YearList.forEach(mRec => {
            if (this.GLOBALCONTANTS.software_start_year == 0) {
                this.GLOBALCONTANTS.software_start_year = mRec.fy_code;
            }
            else {
                if (mRec.fy_code < this.GLOBALCONTANTS.software_start_year)
                    this.GLOBALCONTANTS.software_start_year = mRec.fy_code;
            }
        });
    }

    LoadSettings() {

        var SearchData: any = {};
        SearchData = this.GLOBALCONTANTS.UserInfo;
        SearchData.PARAM_TYPE = "ALL SETTINGS";
        SearchData.SCREEN = "LOGIN2";
        SearchData["SET-LOGIN"] = "Y";


        this.mainservice.LoadSettings(SearchData)
            .subscribe(response => {
                this.MainList = response.list;
                this.loading = false;

                this.InitData();
                this.GLOBALCONTANTS.InitUserInfo();
                //this.GLOBALCONTANTS.InitMonths();

                this.GLOBALCONTANTS.Save2LocalStorage();

            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }

    LoadMenu() {

        var module_name = '';

        var SearchData: any = {};
        SearchData = this.GLOBALCONTANTS.UserInfo;

        if (this.GLOBALCONTANTS.user_isadmin == "Y")
            SearchData.UA_ID = "";
        else
            SearchData.UA_ID = this.GLOBALCONTANTS.user_ua_pkid;


        this.mainservice.LoadMenu(SearchData)
            .subscribe(response => {

                this.GLOBALCONTANTS.MenuList = response.list;
                this.GLOBALCONTANTS.Modules = [];
                response.list.forEach(element => {
                    if (module_name != element.module_name) {
                        this.mRec = new Modulem();
                        this.mRec.module_name = element.module_name;
                        this.GLOBALCONTANTS.Modules.push(this.mRec);
                        module_name = element.module_name;
                    }
                });

                this.GLOBALCONTANTS.Save2LocalStorage();

                this.loading = false;
            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }




    private InitData() {
        this.MainList.forEach(Rec => {
            if (Rec.param_type == "BRANCH SETTINGS") {
                if (Rec.param_name1 == "A/C RECEIVABLE") {
                    this.GLOBALCONTANTS.SETTINGS_AC_RECEIVABLE = Rec.param_name2;
                    this.GLOBALCONTANTS.SETTINGS_AC_RECEIVABLE_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "A/C PAYABLE") {
                    this.GLOBALCONTANTS.SETTINGS_AC_PAYABLE = Rec.param_name2;
                    this.GLOBALCONTANTS.SETTINGS_AC_PAYABLE_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "PETTY CASH")
                    this.GLOBALCONTANTS.SETTINGS_AC_PETTYCASH = Rec.param_name2;
                else if (Rec.param_name1 == "INTERNAL-PAYMENT-SETTLEMENT-AR") {
                    this.GLOBALCONTANTS.INTERNAL_PAYMENT_SETTLMENT_AR_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INTERNAL_PAYMENT_SETTLMENT_AR_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "INTERNAL-PAYMENT-SETTLEMENT-AP") {
                    this.GLOBALCONTANTS.INTERNAL_PAYMENT_SETTLMENT_AP_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INTERNAL_PAYMENT_SETTLMENT_AP_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "INCOME-AE") {
                    this.GLOBALCONTANTS.INCOME_AE_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INCOME_AE_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "INCOME-AI") {
                    this.GLOBALCONTANTS.INCOME_AI_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INCOME_AI_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "INCOME-SE") {
                    this.GLOBALCONTANTS.INCOME_SE_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INCOME_SE_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "INCOME-SI") {
                    this.GLOBALCONTANTS.INCOME_SI_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INCOME_SI_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "INCOME-OT") {
                    this.GLOBALCONTANTS.INCOME_OT_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INCOME_OT_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "INCOME-EX") {
                    this.GLOBALCONTANTS.INCOME_EX_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.INCOME_EX_NAME = Rec.param_name3;
                }

                else if (Rec.param_name1 == "EXPENSE-AE") {
                    this.GLOBALCONTANTS.EXPENSE_AE_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.EXPENSE_AE_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "EXPENSE-AI") {
                    this.GLOBALCONTANTS.EXPENSE_AI_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.EXPENSE_AI_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "EXPENSE-SE") {
                    this.GLOBALCONTANTS.EXPENSE_SE_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.EXPENSE_SE_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "EXPENSE-SI") {
                    this.GLOBALCONTANTS.EXPENSE_SI_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.EXPENSE_SI_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "EXPENSE-OT") {
                    this.GLOBALCONTANTS.EXPENSE_OT_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.EXPENSE_OT_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "EXPENSE-EX") {
                    this.GLOBALCONTANTS.EXPENSE_EX_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.EXPENSE_EX_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "RETAINED-PROFIT") {
                    this.GLOBALCONTANTS.RETAINED_PROFIT_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.RETAINED_PROFIT_CODE = "";
                    this.GLOBALCONTANTS.RETAINED_PROFIT_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "VAT-ACCOUNT") {
                    this.GLOBALCONTANTS.VAT_ACC_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.VAT_ACC_CODE = "";
                    this.GLOBALCONTANTS.VAT_ACC_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "VAT-INVOICE-DESCRIPTION") {
                    this.GLOBALCONTANTS.VAT_INVDESC_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.VAT_INVDESC_CODE = "";
                    this.GLOBALCONTANTS.VAT_INVDESC_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "VAT-PERCENTAGE") {
                    this.GLOBALCONTANTS.VAT_PER = Rec.param_name3;
                }
                else if (Rec.param_name1 == "DIRECT-BILL-AGENT") {
                    this.GLOBALCONTANTS.DIRECT_AGENT_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.DIRECT_AGENT_NAME = Rec.param_name3;
                }

                else if (Rec.param_name1 == "BANK CHARGES") {
                    this.GLOBALCONTANTS.SETTINGS_AC_BANK_CHARGES_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.SETTINGS_AC_BANK_CHARGES_NAME = Rec.param_name3;
                }

                else if (Rec.param_name1 == "EXCHANGE DIFFERENCE") {
                    this.GLOBALCONTANTS.SETTINGS_AC_EX_DIFF_ID = Rec.param_name2;
                    this.GLOBALCONTANTS.SETTINGS_AC_EX_DIFF_NAME = Rec.param_name3;
                }

                else if (Rec.param_name1 == "ISSUE-AGENT") {
                    this.GLOBALCONTANTS.ISSUE_AGENT_ID = "";
                    this.GLOBALCONTANTS.ISSUE_AGENT_NAME = Rec.param_name3;
                }
                else if (Rec.param_name1 == "ISSUE-AGENT-CITY") {
                    this.GLOBALCONTANTS.ISSUE_AGENT_CITY = Rec.param_name3;
                }
                else if (Rec.param_name1 == "ISSUE-AGENT-ADDRESS") {
                    this.GLOBALCONTANTS.ISSUE_AGENT_ADDRESS = Rec.param_name3;
                }
                else if (Rec.param_name1 == "IATA-CODE") {
                    this.GLOBALCONTANTS.HBL_IATA = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SHOW-LOGO-HOME-PAGE") {
                    this.GLOBALCONTANTS.HOME_PAGE_LOGO_DISPLAY = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SHOW-NAME-HOME-PAGE") {
                    this.GLOBALCONTANTS.HOME_PAGE_NAME_DISPLAY = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SHOW-CTPAT") {
                    this.GLOBALCONTANTS.SHOW_CTPAT_LOGO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SHOW-EXTRA-OPTION") {
                    this.GLOBALCONTANTS.SHOW_EXTRA_OPERATION = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX") {
                    this.GLOBALCONTANTS.SEA_EXPORT_HOUSE_PREFIX = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX-POL") {
                    this.GLOBALCONTANTS.SEA_EXPORT_HOUSE_PREFIX_POL = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX-POD") {
                    this.GLOBALCONTANTS.SEA_EXPORT_HOUSE_PREFIX_POD = Rec.param_name3;
                }

                else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-STARTING-NO") {
                    this.GLOBALCONTANTS.SEA_EXPORT_HOUSE_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-INCREMENT-BY") {
                    this.GLOBALCONTANTS.SEA_EXPORT_HOUSE_INCR_BY = Rec.param_name3;
                }

                else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX") {
                    this.GLOBALCONTANTS.AIR_EXPORT_HOUSE_PREFIX = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX-POL") {
                    this.GLOBALCONTANTS.AIR_EXPORT_HOUSE_PREFIX_POL = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX-POD") {
                    this.GLOBALCONTANTS.AIR_EXPORT_HOUSE_PREFIX_POD = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-STARTING-NO") {
                    this.GLOBALCONTANTS.AIR_EXPORT_HOUSE_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-INCREMENT-BY") {
                    this.GLOBALCONTANTS.AIR_EXPORT_HOUSE_INCR_BY = Rec.param_name3;
                }

                else if (Rec.param_name1 == "SEA-EXPORT-REFNO-PREFIX") {
                    this.GLOBALCONTANTS.SEA_EXPORT_REFNO_PREFIX = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SEA-EXPORT-REFNO-STARTING-NO") {
                    this.GLOBALCONTANTS.SEA_EXPORT_REFNO_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "SEA-IMPORT-REFNO-PREFIX") {
                    this.GLOBALCONTANTS.SEA_IMPORT_REFNO_PREFIX = Rec.param_name3;

                }
                else if (Rec.param_name1 == "SEA-IMPORT-REFNO-STARTING-NO") {
                    this.GLOBALCONTANTS.SEA_IMPORT_REFNO_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AIR-EXPORT-REFNO-PREFIX") {
                    this.GLOBALCONTANTS.AIR_EXPORT_REFNO_PREFIX = Rec.param_name3;

                }
                else if (Rec.param_name1 == "AIR-EXPORT-REFNO-STARTING-NO") {
                    this.GLOBALCONTANTS.AIR_EXPORT_REFNO_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AIR-IMPORT-REFNO-PREFIX") {
                    this.GLOBALCONTANTS.AIR_IMPORT_REFNO_PREFIX = Rec.param_name3;

                }
                else if (Rec.param_name1 == "AIR-IMPORT-REFNO-STARTING-NO") {
                    this.GLOBALCONTANTS.AIR_IMPORT_REFNO_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "OTHER-OPERATION-REFNO-PREFIX") {
                    this.GLOBALCONTANTS.OTHER_OPERATION_REFNO_PREFIX = Rec.param_name3;

                }
                else if (Rec.param_name1 == "OTHER-OPERATION-REFNO-STARTING-NO") {
                    this.GLOBALCONTANTS.OTHER_OPERATION_REFNO_STARTING_NO = Rec.param_name3;
                }

                else if (Rec.param_name1 == "EXTRA-OPERATION-REFNO-PREFIX") {
                    this.GLOBALCONTANTS.EXTRA_OPERATION_REFNO_PREFIX = Rec.param_name3;

                }
                else if (Rec.param_name1 == "EXTRA-OPERATION-REFNO-STARTING-NO") {
                    this.GLOBALCONTANTS.EXTRA_OPERATION_REFNO_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AR-INVOICE-PREFIX") {
                    this.GLOBALCONTANTS.AR_INVOICE_PREFIX = Rec.param_name3;

                }
                else if (Rec.param_name1 == "AR-INVOICE-STARTING-NO") {
                    this.GLOBALCONTANTS.AR_INVOICE_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AP-INVOICE-PREFIX") {
                    this.GLOBALCONTANTS.AP_INVOICE_PREFIX = Rec.param_name3;
                }
                else if (Rec.param_name1 == "AP-INVOICE-STARTING-NO") {
                    this.GLOBALCONTANTS.AP_INVOICE_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "DEBIT-NOTE-PREFIX") {
                    this.GLOBALCONTANTS.DEBIT_NOTE_PREFIX = Rec.param_name3;
                }
                else if (Rec.param_name1 == "DEBITE-NOTE-STARTING-NO") {
                    this.GLOBALCONTANTS.DEBIT_NOTE_STARTING_NO = Rec.param_name3;
                }
                else if (Rec.param_name1 == "RESOURCE URL")
                    this.GLOBALCONTANTS.WWW_ROOT = Rec.param_name3;
                else if (Rec.param_name1 == "FILES URL")
                    this.GLOBALCONTANTS.WWW_ROOT_FILE_FOLDER = Rec.param_name3;
                else if (Rec.param_name1 == "FILES FOLDER")
                    this.GLOBALCONTANTS.FILES_FOLDER = Rec.param_name3;
                else if (Rec.param_name1 == "BACK END DATE FORMAT")
                    this.GLOBALCONTANTS.BACKEND_DATEFORMAT = Rec.param_name3;
                else if (Rec.param_name1 == "FRONT END DATE FORMAT") {
                    this.GLOBALCONTANTS.FRONTEND_DATEFORMAT = Rec.param_name3;
                    this.GLOBALCONTANTS.date_display_fmt = Rec.param_name3;
                    this.GLOBALCONTANTS.date_display_fmt_with_time = Rec.param_name3 + " HH:mm:ss";
                    //SetDateFormat();
                }
                else if (Rec.param_name1 == "BASE CURRENCY CODE")
                    this.GLOBALCONTANTS.base_cur_code = Rec.param_name3;
                else if (Rec.param_name1 == "FOREIGN CURRENCY CODE")
                    this.GLOBALCONTANTS.foreign_cur_code = Rec.param_name3;
                else if (Rec.param_name1 == "NO OF ROWS")
                    this.GLOBALCONTANTS.ROWS_TO_DISPLAY = Rec.param_name3;
                else if (Rec.param_name1 == "HBL INSTRUCTION-1")
                    this.GLOBALCONTANTS.HBL_INSTR1 = Rec.param_name3;
                else if (Rec.param_name1 == "HBL INSTRUCTION-2")
                    this.GLOBALCONTANTS.HBL_INSTR2 = Rec.param_name3;
                else if (Rec.param_name1 == "PARENT-ADDRESS")
                    this.GLOBALCONTANTS.PARENT_ADDRESS_REQUIRED = Rec.param_name3;
                else if (Rec.param_name1 == "AUTO-CLOSE-CHECK-PRINT")
                    this.GLOBALCONTANTS.AUTO_CLOSE_CHECK_PRINT = Rec.param_name3;
                else if (Rec.param_name1 == "RE-PRINT-CHECK")
                    this.GLOBALCONTANTS.RE_PRINT_CHECK = Rec.param_name3;
                else if (Rec.param_name1 == "LOCK-DAYS-SEA")
                    this.GLOBALCONTANTS.LOCK_DAYS_SEA = Rec.param_name3;
                else if (Rec.param_name1 == "LOCK-DAYS-AIR")
                    this.GLOBALCONTANTS.LOCK_DAYS_AIR = Rec.param_name3;
                else if (Rec.param_name1 == "LOCK-DAYS-OTHERS")
                    this.GLOBALCONTANTS.LOCK_DAYS_OTHERS = Rec.param_name3;
                else if (Rec.param_name1 == "LOCK-DAYS-ADMIN")
                    this.GLOBALCONTANTS.LOCK_DAYS_ADMIN = Rec.param_name3;
                else if (Rec.param_name1 == "SHOW-BOE")
                    this.GLOBALCONTANTS.BOE_IMPORT_REQUIRED = Rec.param_name3;
                else if (Rec.param_name1 == "REGION")
                    this.GLOBALCONTANTS.BRANCH_REGION = Rec.param_name3;
                else if (Rec.param_name1 == "ARAP-CODE-SELECTION")
                    this.GLOBALCONTANTS.ALLOW_ARAP_CODE_SELECTION = Rec.param_name3;
                else if (Rec.param_name1 == "SEA_ARVL_FORMAT")
                    this.GLOBALCONTANTS.SEA_ARVL_FORMAT = Rec.param_name3;
                else if (Rec.param_name1 == "SHOW-CHECK-DATE")
                    this.GLOBALCONTANTS.SHOW_CHECK_DATE = Rec.param_name3;
                else if (Rec.param_name1 == "REMOVE-ZERO-FORMAT")
                    this.GLOBALCONTANTS.REMOVE_ZERO_FORMAT = Rec.param_name3;
                else if (Rec.param_name1 == "PACKAGE-TOTAL-BUTTON")
                    this.GLOBALCONTANTS.PACKAGE_TOTAL_BUTTON = Rec.param_name3;
                else if (Rec.param_name1 == "OPTIONAL-DESCRIPTION")
                    this.GLOBALCONTANTS.OPTIONAL_DESCRIPTION = Rec.param_name3;
                else if (Rec.param_name1 == "PAYROLL-INVOICE-CODE")
                    this.GLOBALCONTANTS.PAYROLL_INVOICE_CODE = Rec.param_name3;
                else if (Rec.param_name1 == "PAYROLL-ACC-CODE")
                    this.GLOBALCONTANTS.PAYROLL_ACC_CODE = Rec.param_name3;
                else if (Rec.param_name1 == "PAYROLL-ENABLED")
                    this.GLOBALCONTANTS.PAYROLL_ENABLED = Rec.param_name3;
                else if (Rec.param_name1 == "HIDE-DOCTYPE-INVOICE")
                    this.GLOBALCONTANTS.HIDE_DOCTYPE_INVOICE = Rec.param_name3;
                else if (Rec.param_name1 == "DOC-FOOTER1")
                    this.GLOBALCONTANTS.DOC_FOOTER1 = Rec.param_name3;
                else if (Rec.param_name1 == "DOC-FOOTER2")
                    this.GLOBALCONTANTS.DOC_FOOTER2 = Rec.param_name3;
                else if (Rec.param_name1 == "FY-START-MONTH")
                    this.GLOBALCONTANTS.FY_START_MONTH = Rec.param_name3;

                else if (Rec.param_name1 == "DEFAULT-HBL-FORMAT")
                    this.GLOBALCONTANTS.DEFAULT_HBL_FORMAT = Rec.param_name2;
                else if (Rec.param_name1 == "DEFAULT-HBL-DRAFT-FORMAT")
                    this.GLOBALCONTANTS.DEFAULT_HBL_DRAFTFORMAT = Rec.param_name2;
                else if (Rec.param_name1 == "AC-REPORT-BASED-ON")
                    this.GLOBALCONTANTS.AC_REPORT_BASED_ON = Rec.param_name3;
                else if (Rec.param_name1 == "FS-APP-FOLDER")
                    this.GLOBALCONTANTS.FS_APP_FOLDER = Rec.param_name3;
                else if (Rec.param_name1 == "GLOBAL-FTP-FOLDER") {
                    this.GLOBALCONTANTS.GLOBAL_FTP_FOLDER = Rec.param_name3;
                    this.GLOBALCONTANTS.GLOBAL_REPORT_FOLDER = Rec.param_name3 + "\\reports";
                }
                else if (Rec.param_name1 == "SEA-IMP-OVERRIDE-POD-ETA")
                    this.GLOBALCONTANTS.SEA_IMP_OVERRIDE_POD_ETA = Rec.param_name3;
                else if (Rec.param_name1 == "AIR-IMP-OVERRIDE-POD-ETA")
                    this.GLOBALCONTANTS.AIR_IMP_OVERRIDE_POD_ETA = Rec.param_name3;

                else if (Rec.param_name1 == "SHIPMENT-LOG-FORMAT")
                    this.GLOBALCONTANTS.SHIPMENTLOG_FORMAT = Rec.param_name3;

                /*
                else if (Rec.param_name1 == "SHIPMENT-LOCKED-DATE")
                {
                    if (Rec.param_name3.Trim() != "")
                    {
                        string[] sdata = Rec.param_name3.Split('-');
                        if (sdata.Length == 3)
                        {
                            int yy = Lib.Convert2Integer(sdata[0]);
                            int mm = Lib.Convert2Integer(sdata[1]);
                            int dd = Lib.Convert2Integer(sdata[2]);
                            this.GLOBALCONTANTS.ACCOUNTS_LOCKED_DATE = new DateTime(yy, mm, dd);
                        }
                    }
                }
                */
            }
            else if (Rec.param_type == "GLOBAL SETTINGS") {
                if (Rec.param_name1 == "SOFTWARE VERSION")
                    this.GLOBALCONTANTS.SOFTWARE_VERSION = Rec.param_name3;

                if (Rec.param_name1 == "GENERAL_BRANCH_CODE")
                    this.GLOBALCONTANTS.GENERAL_BRANCH_CODE = Rec.param_name3;

            }
        });


        if (this.GLOBALCONTANTS.base_cur_code == this.GLOBALCONTANTS.foreign_cur_code)
            this.GLOBALCONTANTS.IS_SINGLE_CURRENCY = true;
        if (this.GLOBALCONTANTS.base_cur_code != this.GLOBALCONTANTS.foreign_cur_code)
            this.GLOBALCONTANTS.IS_SINGLE_CURRENCY = false;
        if (this.GLOBALCONTANTS.ROWS_TO_DISPLAY == 0)
            this.GLOBALCONTANTS.ROWS_TO_DISPLAY = 40;
        this.GLOBALCONTANTS.WWW_FILES_URL = this.GLOBALCONTANTS.WWW_ROOT_FILE_FOLDER + "/" + this.GLOBALCONTANTS.FILES_FOLDER + "/Files";



        this.GLOBALCONTANTS.SHIPMENT_STAGE_OI = [{ "code": "NIL", "name": "NIL" }];
        this.GLOBALCONTANTS.SHIPMENT_STAGE_OE = [{ "code": "NIL", "name": "NIL" }];
        this.GLOBALCONTANTS.SHIPMENT_STAGE_AI = [{ "code": "NIL", "name": "NIL" }];
        this.GLOBALCONTANTS.SHIPMENT_STAGE_AE = [{ "code": "NIL", "name": "NIL" }];
        this.GLOBALCONTANTS.SHIPMENT_STAGE_OT = [{ "code": "NIL", "name": "NIL" }];



        this.MainList.filter(a => a.param_code == 'OI').sort(function (a, b) {
            return b.param_name4 < a.param_name4 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.SHIPMENT_STAGE_OI.push({ "code": a.param_name4, "name": a.param_name3 })
        });


        this.MainList.filter(a => a.param_code == 'OE').sort(function (a, b) {
            return b.param_name4 < a.param_name4 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.SHIPMENT_STAGE_OE.push({ "code": a.param_name4, "name": a.param_name3 })
        });

        this.MainList.filter(a => a.param_code == 'AI').sort(function (a, b) {
            return b.param_name4 < a.param_name4 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.SHIPMENT_STAGE_AI.push({ "code": a.param_name4, "name": a.param_name3 })
        });

        this.MainList.filter(a => a.param_code == 'AE').sort(function (a, b) {
            return b.param_name4 < a.param_name4 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.SHIPMENT_STAGE_AE.push({ "code": a.param_name4, "name": a.param_name3 })
        });


        this.MainList.filter(a => a.param_code == 'OT').sort(function (a, b) {
            return b.param_name4 < a.param_name4 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.SHIPMENT_STAGE_OT.push({ "code": a.param_name4, "name": a.param_name3 })
        });


        this.MainList.filter(a => a.param_type == 'GLOBAL SETTINGS' && a.param_name1 == 'INVOICE_STAGE').sort(function (a, b) {
            return b.param_name4 < a.param_name4 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.INVOICE_STAGE.push({ "code": a.param_code, "name": a.param_name2 + "," + a.param_name3 })
        });


        this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'SEA IMPORT').sort(function (a, b) {
            return b.param_name3 < a.param_name3 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.JOB_TYPE_OI.push({ "code": a.param_pkid, "name": a.param_name1 })
        });


        this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'SEA EXPORT').sort(function (a, b) {
            return b.param_name3 < a.param_name3 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.JOB_TYPE_OE.push({ "code": a.param_pkid, "name": a.param_name1 })
        });


        this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'AIR EXPORT').sort(function (a, b) {
            return b.param_name3 < a.param_name3 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.JOB_TYPE_AE.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'AIR IMPORT').sort(function (a, b) {
            return b.param_name3 < a.param_name3 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.JOB_TYPE_AI.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'OTHERS').sort(function (a, b) {
            return b.param_name3 < a.param_name3 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.JOB_TYPE_OT.push({ "code": a.param_pkid, "name": a.param_name1 })
        });


        this.MainList.filter(a => a.param_type == 'FREIGHT STATUS').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_FREIGHT_STATUS.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'CARGO MOVEMENT').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_CARGO_MOVEMENT.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'CONTAINER TYPE').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_CONTAINER_TYPE.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'NOMINATION').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_NOMINATION.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'COUNTRY').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_COUNTRY.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'CURRENCY').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_CURRENCY.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'UNIT').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_UNIT.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'HBL-FORMAT').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_HBL_FORMAT.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'HBL-FORMAT' && a.param_name6 == 'BLANK').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_HBL_FORMAT_BLANK.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'HBL-FORMAT' && a.param_name6 == 'DRAFT').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_HBL_FORMAT_DRAFT.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        this.MainList.filter(a => a.param_type == 'HAWB-FORMAT').sort(function (a, b) {
            return b.param_name1 < a.param_name1 ? 1 : -1;
        }).forEach(a => {
            this.GLOBALCONTANTS.PARAM_HAWB_FORMAT.push({ "code": a.param_pkid, "name": a.param_name1 })
        });

        /*      public PARAM_FREIGHT_STATUS : any = [];
                public PARAM_CARGO_MOVEMENT : any = [];
                public PARAM_CONTAINER_TYPE : any = [];
                public PARAM_NOMINATION : any = [];
                public PARAM_COUNTRY : any = [];
                public PARAM_CURRENCY : any = [];
                public PARAM_HBL_FORMAT : any = [];
                public PARAM_HBL_FORMAT_DRAFT : any = [];
                public PARAM_HAWB_FORMAT : any = [];
                public PARAM_UNIT : any = [];
                public PARAM_CUSTOMER_GROUP : any = [];
                public PARAM_FORM_CATEGORIES : any = [];
         */


    }

    Cancel() {
        this.router.navigate(['login'], { replaceUrl: true });
    }

}
