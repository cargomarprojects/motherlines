import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
})
export class MailComponent implements OnInit {
  // Local Variables 
  title = 'Mail';
  @ViewChild('fileinput') private fileinput: ElementRef;

  @Input() public pkid: string = '';
  @Input() public AttachList = new Array<any>();

  @Output() mailcallbackevent = new EventEmitter<any>();
  chkReadRecipt: boolean = false;
  chkDelivReceipt: boolean = false;
  customer_name: string = "";
  customer_id: string = "";

  showattach: boolean = false;

  myFiles: string[] = [];
  filesSelected: boolean = false;;

  disableSave = true;
  loading = false;

  private to_ids: string = '';
  private cc_ids: string = '';
  private bcc_ids: string = '';
  private subject: string = '';
  private message: string = '';

  private errorMessage: string[] = [];
  constructor(
    private gs: GlobalService,
    private lovService: LovService,
    private http2: HttpClient,
  ) {
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.customer_id = '';
    this.customer_name = '';
    this.chkDelivReceipt = false;
    this.chkReadRecipt = false;
    this.cc_ids = '';
    this.bcc_ids = '';
    this.to_ids = '';
    this.subject = '';
    this.message = '';
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == 'CUSTOMER') {
      this.customer_name = _Record.name;
      this.customer_id = _Record.id;
    }
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  // Save Data
  SendMail() {

    this.errorMessage = [];
    if (!this.allvalid())
      return;

     this.SearchRecord('smtpmail', 'MAIL');
  }

  allvalid() {
    let bret: boolean = true;
    this.errorMessage = [];;
    if (this.gs.isBlank(this.to_ids)) {
      bret = false;
      this.errorMessage.push("Mail To Address Is Blank");
    }

    if (this.gs.isBlank(this.subject)) {
      bret = false;
      this.errorMessage.push("Subject Cannot Be Blank");
    }

    if (this.gs.isBlank(this.message)) {
      bret = false;
      this.errorMessage.push("Message Cannot Be Blank");
    }

    if (!bret)
      alert('Error While Saving');

    return bret;
  }
  OnBlur(field: string) {

  }
  Close() {
    if (this.mailcallbackevent)
      this.mailcallbackevent.emit({ action: 'CLOSE' });

  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  SearchRecord(controlname: string, _type: string) {

    this.errorMessage = [];
    let filename: string = "";
    let filedisplayname: string = "";
    if (this.AttachList != null) {
      if (this.AttachList.length == 1) {
        filename = this.AttachList[0].filename;
        filedisplayname = this.AttachList[0].filedisplayname;
      } else {
        for (let rec of this.AttachList) {
          if (filename != "")
            filename = filename.concat("|");
          filename = filename.concat(rec.filename, "?", rec.filedisplayname);
        }
      }
    }


    let SearchData = {
      table: controlname,
      pkid: '',
      to_ids: '',
      cc_ids: '',
      bcc_ids: '',
      subject: '',
      message: '',
      filename: '',
      filedisplayname: '',
      type: _type,
      company_code: this.gs.company_code,
      branch_code: this.gs.branch_code,
      user_pkid: this.gs.user_pkid,
      user_name: this.gs.user_name,
      user_code: this.gs.user_code,
      read_receipt: this.chkReadRecipt ? "YES" : "NO",
      delivery_receipt:this.chkDelivReceipt ? "YES" : "NO"
    };

    SearchData.table = controlname;
    SearchData.pkid = this.pkid;
    SearchData.to_ids = this.to_ids;
    SearchData.cc_ids = this.cc_ids;
    SearchData.bcc_ids = this.bcc_ids;
    SearchData.subject = this.subject;
    SearchData.message = this.message;
    SearchData.filename = filename;
    SearchData.filedisplayname = filedisplayname;
    SearchData.type = _type;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.user_pkid = this.gs.user_pkid;
    SearchData.user_name = this.gs.user_name;
    SearchData.user_code = this.gs.user_code;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        if (_type == "MAIL") {
          this.errorMessage.push(response.message);
        }
      },
        error => {
          this.errorMessage.push(this.gs.getError(error));
          alert(this.errorMessage);
        });
  }

  /*
  ShowBL() {
    //this.router.navigate([rec.menu_route1], { queryParams: { parameter: rec.menu_route2 }, replaceUrl: true });
    //this.router.navigate(["operations/seabl"], { queryParams: { parameter:"menuid:JOBSEAEXPORT,type:SEA EXPORT"}, replaceUrl: true });
    //this.router.navigate([{ outlets: { blpage: ['operations/seabl'] } }]); 
  }
  */

  RemoveAttachment(Id: string, _type: string) {
     this.AttachList.splice(this.AttachList.findIndex(rec => rec.filename == Id), 1);
  }

}
