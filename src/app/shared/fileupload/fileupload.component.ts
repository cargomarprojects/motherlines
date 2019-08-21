import { Component, OnInit, Input,Output, ViewChild,EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { Table_Mast_Files } from '../models/table_mast_files';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html'
})
export class FileUploadComponent  implements OnInit  {

  private Files_Parent_Id: string;
  @Input() set parentid(value: string) {
    this.Files_Parent_Id = value;
  }

  private Files_Sub_Id: string;
  @Input() set subid(value: string) {
    this.Files_Sub_Id = value;
  }

  private Files_Type: string;
  @Input() set type(value: string) {
    this.Files_Type = value;
  }

  private Files_TypeList: any;
  @Input() set typelist(value: any) {
    this.Files_TypeList = value;
  }

  private table_name: string;
  @Input() set tablename(value: string) {
    this.table_name = value;
  }

  private table_pk_column: string;
  @Input() set tablepkcolumn(value: string) {
    this.table_pk_column = value;
  }

  private Files_Ref_No: string;
  @Input() set refno(value: string) {
    this.Files_Ref_No = value;
  }
 
   
  private Customer_Name: string;
  @Input() set customername(value: string) {
    this.Customer_Name = value;
  }

  private UpdateColumn: string="REC_FILES_ATTACHED";
  @Input() set updatecolumn(value: string) {
    this.UpdateColumn = value;
  }
  
   
  private VIEW_ONLY_SOURCE: string;
  @Input() set viewonlysource(value: string) {
    this.VIEW_ONLY_SOURCE = value;
  }

  private VIEW_ONLY_ID: string;
  @Input() set viewonlyid(value: string) {
    this.VIEW_ONLY_ID = value;
  }

  private FILES_PATH1: string;
  @Input() set filespath(value: string) {
    this.FILES_PATH1 = value;
  }

  private FILES_PATH2: string;
  @Input() set filespath2(value: string) {
    this.FILES_PATH2 = value;
  }

  @Output() callbackevent = new EventEmitter<any>();

  fileName:string = "";
  fileRefno:string = "";
  fileDocType:string = "";

  title = 'Documents';

  private errorMessage : string = '';

  loading = false;
  myFiles: string[] = [];
  sMsg: string = '';

  constructor(
    private gs: GlobalService,
    private lovService: LovService,
    private http2: HttpClient,
  ) {

  }

  @ViewChild('fileinput') private fileinput: ElementRef;

  RecordList: Table_Mast_Files[] = [];
  filesSelected: boolean = false;;

  ngOnInit() {
    this.List();
  }
 

  getFileDetails(e: any) {
    //console.log (e.target.files);
    let isValidFile = true;
    let fname: string = '';
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;
      fname = e.target.files[i].name;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);
    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%#');
    }
  }


  uploadFiles() {


    // if (this.catg_id == '') {
    //   alert('Pls Select Category');
    //   return;
    // }

    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }

    this.loading = true;

    let frmData: FormData = new FormData();


    // frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
    // frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
    // frmData.append("PARENTID", this.pkid);
    // frmData.append("GROUPID", this.groupid);
    // frmData.append("TYPE", this.type);
    // frmData.append("CATGID", this.catg_id);
    // frmData.append("CREATEDBY", this.gs.globalVariables.user_code);


    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.http2.post<any>(
      this.gs.baseUrl + '/api/General/UploadFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.loading = false;
          this.filesSelected = false;
          this.fileinput.nativeElement.value = '';
          this.List();
          alert('Upload Complete');
        },
        error => {
          this.loading = false;
          alert('Failed');
        }
      );
  }




  List() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
   // SearchData.pkid = this.cf_masterid;

    this.lovService.DocumentList(SearchData)
      .subscribe(response => {
        this.RecordList = <Table_Mast_Files[]>response.records;
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }
 

  ShowFile(filename: string) {
    this.Downloadfile(filename, "", filename);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  RemoveRow(_rec:Table_Mast_Files)
  {

  }

  RemoveList(event: any) {

    if (!event.selected) {
      return;
    }

    // this.loading = true;

    // let SearchData = {
    //   pkid: event.id,
    //   type: this.type,
    //   parentid: this.pkid,
    //   user_code: this.gs.globalVariables.user_code
    // };

    // this.ErrorMessage = '';
    // this.InfoMessage = '';
    // this.lovService.DeleteRecord(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     this.RecordList.splice(this.RecordList.findIndex(rec => rec.doc_pkid == this.pkid), 1);
    //   },
    //     error => {
    //       this.loading = false;
    //       this.ErrorMessage = this.gs.getError(error);
    //     });
  }

  Close(){
    if ( this.callbackevent)
      this.callbackevent.emit({action : 'CLOSE', source :''});
  }

}
