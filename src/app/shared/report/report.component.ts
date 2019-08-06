import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

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

      },
      error =>{
        alert( this.gs.getError(error));
      }
    );
  }

  return(){
    if ( this.callbackevent)
      this.callbackevent.emit({action : 'CLOSE', source :'MANIFEST'});
  }
  
  

}
