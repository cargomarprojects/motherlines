import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';
import { ClearService } from '../services/clear.service';
import { Companym } from '../models/company';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  loading: Boolean = false;
  showloginbutton: Boolean = false;

  errorMessage: string = '';


  software_version_string = '1.106';
  
  username: string = '';
  password: string = '';

  server_software_version_string = '';


  CompanyList: Companym[];

  Company_Id: string = '';
  Company_Code: string = '';

  userrecord: any;


  constructor(
    private mainservice: LoginService,
    public GLOBALCONTANTS: GlobalService,
    public clrservice: ClearService,
    private router: Router
  ) {

    this.GLOBALCONTANTS.Modules = null;
    this.GLOBALCONTANTS.MenuList = null;
    this.GLOBALCONTANTS.IsLoginSuccess = false;
    this.GLOBALCONTANTS.IsAuthenticated = false;
    this.showloginbutton = false;

    this.username = 'ADMIN';
    this.password = '123';

    this.LoadCombo();
  }

  ngOnInit() {
  }



  LoadCombo() {

    this.loading = true;
    let SearchData = {
      TYPE: 'USR_COMPANY'
    };


    this.showloginbutton = false;
    this.mainservice.LoadCompany(SearchData)
      .subscribe(response => {
        this.CompanyList = response.list;
        this.server_software_version_string = response.version;
        if (this.software_version_string === this.server_software_version_string) {
          this.showloginbutton = true;
        }
        else {
          this.errorMessage = "New Version Available, Kindly Clear Browser History";
          this.showloginbutton = false;
        }

        response.list.forEach(a => {
          this.Company_Id = a.pkid;
        })
        
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
        alert(this.errorMessage);
      });
  }

  Login() {
    if (!this.username) {
      this.errorMessage = 'Login ID Cannot Be Blank';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password Cannot Be Blank';
      return;
    }

    this.username = this.username.toUpperCase();
    this.password = this.password.toUpperCase();

    this.loading = true;

    this.mainservice.Login(this.username, this.password, this.Company_Id)
      .subscribe(response => {
        this.loading = false;
        let user = response;
        if (user && user.access_token) {
          this.GLOBALCONTANTS.IsLoginSuccess = true;
          this.GLOBALCONTANTS.Access_Token = user.access_token;
          if (this.GLOBALCONTANTS.IsLoginSuccess) {
            this.errorMessage = "Login Success";
            this.GLOBALCONTANTS.user_pwd = this.password;
            // this.clrservice.ClearInit();
            this.GLOBALCONTANTS.GSESSION += 1;
            this.Login1();
          }
          else {
            this.errorMessage = "Login Failed";
          }
        }
      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
      });
  }


  Cancel() {
    this.router.navigate(['home'], { replaceUrl: true });
  }



  Login1() {

    let SearchData = {
      sCompanyId: this.Company_Id,
      sUserId: this.username,
      sPwd: this.password
    };


    this.mainservice.Login1(SearchData)
      .subscribe(response => {

        this.userrecord = response.record;
        this.LoadData();

        this.router.navigate(['login2'], { replaceUrl: true });

      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
        alert(this.errorMessage);
      });



  }


  public LoadData() {
    this.GLOBALCONTANTS.BACKEND_DATEFORMAT = "YYYY/MM/DD";
    this.GLOBALCONTANTS.FRONTEND_DATEFORMAT = "YYYY/MM/DD";

    //string Str =  System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern;
    this.GLOBALCONTANTS.date_display_fmt = '';//System.Threading.Thread.CurrentThread.CurrentCulture.DateTimeFormat.ShortDatePattern.ToString(); 

    this.GLOBALCONTANTS.user_pkid = this.userrecord.usr_pkid;
    this.GLOBALCONTANTS.user_code = this.userrecord.usr_code;
    this.GLOBALCONTANTS.user_name = this.userrecord.usr_name;
    this.GLOBALCONTANTS.user_islocked = "N";
    this.GLOBALCONTANTS.user_isadmin = "N";


    this.GLOBALCONTANTS.ALLOW_LOGIN_FROM_MULTIPLE_SYSTEM = this.userrecord.ALLOW_LOGIN_FROM_MULTIPLE_SYSTEM;


    this.GLOBALCONTANTS.user_hide_payroll = this.userrecord.usr_hide_payroll;
    this.GLOBALCONTANTS.USER_DISABLE_EDIT_SI_MBLSTATUS = this.userrecord.usr_disable_edit_si_mblstatus;

    this.GLOBALCONTANTS.user_email_cc = this.userrecord.usr_email_cc;
    this.GLOBALCONTANTS.user_email = this.userrecord.usr_email;

    this.GLOBALCONTANTS.user_email_display_name = this.userrecord.usr_email_display_name;
    this.GLOBALCONTANTS.user_email_signature = this.userrecord.usr_email_signature;

    if (this.userrecord.usr_email_sign_font != "")
      this.GLOBALCONTANTS.user_email_sign_font = this.userrecord.usr_email_sign_font;
    if (this.userrecord.usr_email_sign_color != "")
      this.GLOBALCONTANTS.user_email_sign_color = this.userrecord.usr_email_sign_color;
    if (this.userrecord.usr_email_sign_size != "")
      this.GLOBALCONTANTS.user_email_sign_size = this.userrecord.usr_email_sign_size;
    if (this.userrecord.usr_email_sign_bold != "")
      this.GLOBALCONTANTS.user_email_sign_bold = this.userrecord.usr_email_sign_bold;

    if (this.userrecord.usr_code == "ADMIN")
      this.GLOBALCONTANTS.user_isadmin = "Y";

    if (this.userrecord.usr_confirm_onexit == "Y")
      this.GLOBALCONTANTS.Confirm_On_Exit = true;
    else
      this.GLOBALCONTANTS.Confirm_On_Exit = false;

    this.GLOBALCONTANTS.audit_id = this.userrecord.AUDIT_ID;
    this.GLOBALCONTANTS.company_pkid = this.userrecord.comp_pkid;

    this.GLOBALCONTANTS.company_code = this.userrecord.comp_code;
    this.GLOBALCONTANTS.company_name = this.userrecord.comp_name;
    this.GLOBALCONTANTS.company_add1 = this.userrecord.comp_add1;
    this.GLOBALCONTANTS.company_add2 = this.userrecord.comp_add2;
    this.GLOBALCONTANTS.company_add3 = this.userrecord.comp_add3;
    this.GLOBALCONTANTS.company_add4 = this.userrecord.comp_add4;

    //this.GLOBALCONTANTS.USER_LOCATION_ID = Lib.Convert2Integer(this.userrecord.comp_code);

    this.GLOBALCONTANTS.REC_COMPANY_CODE = this.userrecord.REC_COMPANY_CODE;

    this.GLOBALCONTANTS.ADDRESS_LINE1 = this.userrecord.comp_line1;
    this.GLOBALCONTANTS.ADDRESS_LINE2 = this.userrecord.comp_line2;
    this.GLOBALCONTANTS.ADDRESS_LINE3 = this.userrecord.comp_line3;
    this.GLOBALCONTANTS.ADDRESS_LINE4 = this.userrecord.comp_line4;

    this.GLOBALCONTANTS.company_sow = this.userrecord.comp_sow;
    this.GLOBALCONTANTS.branch_pkid = "";

    this.GLOBALCONTANTS.InitUserInfo();
  }

}
