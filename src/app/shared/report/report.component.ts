import { Component, OnInit, Input,Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  private errorMessage : string = '';
  private  tab: string = 'main';

  private canPrint : boolean = false;
  private canDownload : boolean = false;
  private canExcel : boolean = false;
  private canEmail : boolean = false;

  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;

  private _menuid: string;
  @Input() set menuid(value: string) {
    this._menuid = value;
  }


  private _title: string;
  @Input() set title(value: string) {
    this._title = value;
  }

  private _url: string;
  @Input() set url(value: string) {
    this._url = value;
  }

  private _searchdata: any;
  @Input() set searchdata(value: any) {
    this._searchdata = value;
  }


  private _filename  : string ;
  @Input() set filename(value: any) {
    this._filename = value;
  }

  private _filetype : string ;
  @Input() set filetype(value: any) {
    this._filetype = value;
  }

  private _filedisplayname : string ;
  @Input() set filedisplayname(value: any) {
    this._filedisplayname = value;
  }

  @Output() callbackevent = new EventEmitter<any>();

  AttachList: any[] = [];
  
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  ngOnInit() {
    this.canPrint = this.gs.canPrint(this._menuid);
    this.canDownload = this.gs.canDownload(this._menuid);
    this.canExcel = this.gs.canExel(this._menuid);
    this.canEmail = this.gs.canEmail(this._menuid);


    

    if ( this._url == undefined && this._filename == undefined)
    return ;

    if ( this._url == undefined)
      this.AutoLoad();
    else 
      this.loaddata();
    
  }


  loaddata(){
    this.gs.makecall( this._url, this._searchdata).subscribe (
      response =>{
        
        this.filename = response.filename;
        this.filetype  = response.filetype; 
        this.filedisplayname =  response.filedisplayname;
        this.AutoLoad();
      },
      error =>{
        this.errorMessage = this.gs.getError(error);
        alert( this.errorMessage );
      }
    );
  }

  Close(){
    if ( this.callbackevent)
      this.callbackevent.emit({action : 'CLOSE', source :'MANIFEST'});
  }
  
  
  AutoLoad(){

    this.gs.getFile(this.gs.GLOBAL_REPORT_FOLDER, this._filename, this._filetype, this._filedisplayname).subscribe( response =>{

      this.pdfViewerAutoLoad.pdfSrc = response;
      this.pdfViewerAutoLoad.refresh(); 

    }, error =>{
      this.errorMessage = this.gs.getError( error);
      alert(this.errorMessage);
    });

  }

  report ( action : string  ) {

    if(action=="email")
    {
      this.AttachList = new Array<any>();
      this.AttachList.push({ filename: this.filename, filetype: this.filetype, filedisplayname: this.filedisplayname});
      this.tab="email";
    }
  }

  mailcallbackevent(event: any) {
    this.tab = 'main';
    this.AutoLoad();
  }


}
