import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { Table_Mast_Files } from '../models/table_mast_files';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html'
})
export class FileUploadComponent implements OnInit {



  private Doc_title: string = "";
  @Input() set title(value: string) {
    this.Doc_title = value;
  }


  private Files_Parent_Id: string = "";
  @Input() set parentid(value: string) {
    this.Files_Parent_Id = value;
  }

  private Files_Sub_Id: string = "";
  @Input() set subid(value: string) {
    this.Files_Sub_Id = value;
  }

  private Files_Type: string = "";
  @Input() set type(value: string) {
    this.Files_Type = value;
  }

  private Files_TypeList: any;
  @Input() set typelist(value: any) {
    this.Files_TypeList = value;
  }

  private table_name: string = "";
  @Input() set tablename(value: string) {
    this.table_name = value;
  }

  private table_pk_column: string = "";
  @Input() set tablepkcolumn(value: string) {
    this.table_pk_column = value;
  }

  private Files_Ref_No: string = "";
  @Input() set refno(value: string) {
    this.Files_Ref_No = value;
  }


  private Customer_Name: string = "";
  @Input() set customername(value: string) {
    this.Customer_Name = value;
  }

  private UpdateColumn: string = "REC_FILES_ATTACHED";
  @Input() set updatecolumn(value: string) {
    this.UpdateColumn = value;
  }


  private VIEW_ONLY_SOURCE: string = "";
  @Input() set viewonlysource(value: string) {
    this.VIEW_ONLY_SOURCE = value;
  }

  private VIEW_ONLY_ID: string;
  @Input() set viewonlyid(value: string) {
    this.VIEW_ONLY_ID = value;
  }

  private FILES_PATH1: string = "";
  @Input() set filespath(value: string) {
    this.FILES_PATH1 = value;
  }

  private FILES_PATH2: string = "";
  @Input() set filespath2(value: string) {
    this.FILES_PATH2 = value;
  }

  @Output() callbackevent = new EventEmitter<any>();

  txt_fileName: string = "";
  txt_fileRefno: string = "";
  txt_fileDocType: string = "";
  
  canupload:boolean = true;

  private errorMessage: string = '';

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
  MultiFilesList: Table_Mast_Files[] = [];
  filesSelected: boolean = false;;

  ngOnInit() {
    this.txt_fileDocType = this.Files_Type;
    this.List();
  }


  getFileDetails(e: any) {

    this.MultiFilesList = <Table_Mast_Files[]>[];
    let mFiles = <Table_Mast_Files>{};

    let fileExtn: string = "";
    let fileName: string = "";
    let fileDesc: string = "";
    let DefaultFilename: string = "";
    let fileSize: number = 0;
    let fileCreateDate: string = "";
    let strDfname: string = "";

    let isValidFile = true;
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;

      fileExtn = this.getExtension(e.target.files[i].name);

      fileName = this.gs.getGuid().toString().replace("-", "") + fileExtn;
      fileName = fileName.toUpperCase();
      fileDesc = e.target.files[i].name;
      fileDesc = fileDesc.toUpperCase();
      fileSize =  e.target.files[i].size;

      if (DefaultFilename.trim() != "")
          strDfname = DefaultFilename + fileExtn.toUpperCase();
      if (strDfname.length > 50)
      {
          DefaultFilename = DefaultFilename.substring(0, 50 - fileExtn.length);
          strDfname = DefaultFilename + fileExtn.toUpperCase();
      }

      if (fileDesc.length > 50)
          fileDesc = fileDesc.substring(0, 50 - fileExtn.length) + fileExtn.toUpperCase();
      fileDesc = this.gs.ProperFileName(fileDesc);

      this.txt_fileName  = strDfname;
      if ( this.txt_fileName.trim().length <= 0)
      this.txt_fileName = fileDesc;
      this.txt_fileName = this.gs.ProperFileName(this.txt_fileName);

      fileCreateDate = this.gs.defaultValues.today;

      if (fileName.indexOf('&') >= 0)
        isValidFile = false;
      if (fileName.indexOf('%') >= 0)
        isValidFile = false;
      if (fileName.indexOf('#') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);

      mFiles = <Table_Mast_Files>{};
      mFiles.file_id = fileName;
      mFiles.file_desc = fileDesc;
      mFiles.files_strfile = "";
      mFiles.files_created_date = fileCreateDate;
      mFiles.files_size = fileSize;
      //mFiles.files_sizewithunit = GetFsize(file.Length);
      this.MultiFilesList.push(mFiles);

    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%#');
    }
  }


  getExtension(_fName: string) {
    var temparr = _fName.split('.');
    return "." + temparr[temparr.length - 1].toString();
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

// GetSpaceTrim(str: string) {
//     let num: number;
//     let strTrim = {
//       newstr: ''
//     };
//     if (str.trim() != "") {
//       var temparr = str.split(' ');
//       for (num = 0; num < temparr.length; num++) {
//         strTrim.newstr = strTrim.newstr.concat(temparr[num]);
//       }
//     }
//     return strTrim;
//   }


  List() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.PKID = this.Files_Parent_Id;
    SearchData.FILES_TYPE = this.Files_Type;
    SearchData.FILES_SUB_ID = this.Files_Sub_Id;
    SearchData.VIEW_ONLY_SOURCE = this.VIEW_ONLY_SOURCE
    SearchData.VIEW_ONLY_ID = this.VIEW_ONLY_ID;
    this.lovService.DocumentList(SearchData)
      .subscribe(response => {
        this.RecordList = <Table_Mast_Files[]>response.list;

        this.RecordList.forEach(Rec => {
          Rec.file_uri = this.gs.WWW_FILES_URL + "/" + Rec.file_id;
          if (Rec.files_type == "XML-EDI") {
            Rec.file_uri = this.gs.WWW_ROOT_FILE_FOLDER + "/../" + Rec.files_path + Rec.file_id;
          }
          Rec.files_type = this.GetFileType(Rec.files_type); //in database filestype  store code but the list wants to shows name, so to retreive name this fn is used;
        })

        if (this.Files_Type == "PAYMENT SETTLEMENT")
          this.ReLoadDocType(response.tothouse);

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }
  GetFileType(_scode: string) {
    let str = "";
    this.Files_TypeList.forEach(Rec => {
      if (Rec.code == _scode)
        str = Rec.name;
    })
    return str;
  }
  ReLoadDocType(_tothbl: number) {
    let fTypeList = this.Files_TypeList;

    this.Files_TypeList = new Array<any>();
    let newRec = {
      code: "EMAIL",
      name: "E-MAIL"
    };
    this.Files_TypeList.push(newRec);

    for (let j = 1; j <= _tothbl; j++) {
      let str = "HOUSE" + j.toString();
      if (this.GetFileType(str) == "") {
        newRec = {
          code: str,
          name: str
        };
        this.Files_TypeList.push(newRec);
      }
    }

    fTypeList.forEach(Rec => {
      if (this.GetFileType(Rec.code) == "") {
        newRec = {
          code: Rec.code,
          name: Rec.name
        };
        this.Files_TypeList.push(newRec);
      }
    })

  }


  // IsTypeListContainsCode(_scode:string)
  // {
  //   let bRet:boolean =false;

  //   this.Files_TypeList.forEach(Rec => {
  //     if (Rec.code == _scode)
  //       return Rec.name;
  //   })

  //   return bRet;

  // }

  ShowFile(filename: string) {
    this.Downloadfile(filename, "", filename);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  RemoveRow(_rec: Table_Mast_Files) {

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

  Close() {
    if (this.callbackevent)
      this.callbackevent.emit({ action: 'CLOSE', source: '' });
  }

  onBlur(field: string) {
    switch (field) {
      case 'txt_fileName': {
        this.txt_fileName = this.txt_fileName.toUpperCase();
        break;
      }
      case 'txt_fileRefno': {
        this.txt_fileRefno = this.txt_fileRefno.toUpperCase();
        break;
      }
    }
  }
}
