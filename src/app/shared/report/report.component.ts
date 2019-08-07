import { Component, OnInit, Input,Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  private errorMessage : string = '';

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

  @Output() callbackevent = new EventEmitter<any>();

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  ngOnInit() {

    this.canPrint = this.gs.canPrint(this._menuid);
    this.canDownload = this.gs.canDownload(this._menuid);
    this.canExcel = this.gs.canExel(this._menuid);
    this.canEmail = this.gs.canEmail(this._menuid);

    this.loaddata();
  }

  filename  : string ;
  filetype : string ;
  filedisplayname : string ;

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
        alert( );
      }
    );
  }

  Close(){
    if ( this.callbackevent)
      this.callbackevent.emit({action : 'CLOSE', source :'MANIFEST'});
  }
  
  
  AutoLoad(){

    this.gs.getFile(this.gs.GLOBAL_REPORT_FOLDER, this.filename, this.filetype, this.filedisplayname).subscribe( response =>{

      this.pdfViewerAutoLoad.pdfSrc = response;
      this.pdfViewerAutoLoad.refresh(); 

    }, error =>{
      this.errorMessage = this.gs.getError( error);
      alert(this.errorMessage);
    });

  }

  report ( action : string  ) {

  }
}
