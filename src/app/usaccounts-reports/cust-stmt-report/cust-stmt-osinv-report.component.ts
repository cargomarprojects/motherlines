import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Tbl_OS_REPORT } from '../models/Tbl_OS_Report';


@Component({
  selector: 'app-cust-stmt-osinv-report',
  templateUrl: './cust-stmt-osinv-report.component.html'
})
export class CustStmtOsinvReportComponent implements OnInit {

  title = 'OS Invoices Details';

  @Input() public RecordList: Tbl_OS_REPORT[] = [];
  @Input() public IdList: any[] = [];
  @Output() osinvcallbackevent = new EventEmitter<any>();

  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;

  allchecked: boolean = false;
  selectdeselect: boolean = false;
  selected_invids: string = '';
  ErrorMessage = "";
  InfoMessage = "";

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private location: Location
  ) {
    // URL Query Parameter 
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadCombo();
  }

  InitComponent() {
    this.InitLov();
  }

  InitLov() {


  }
  LovSelected(_Record: SearchTable) {

  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  LoadCombo() {


  }

  Save() {
    this.ErrorMessage = "";

    this.selected_invids = '';
    this.RecordList.forEach(Rec => {
      if (Rec.inv_flag_b) {
        if (this.selected_invids != "")
          this.selected_invids += ',';
        this.selected_invids += Rec.inv_pkid;
      }
    })

    if (this.gs.isBlank(this.selected_invids)) {
      this.ErrorMessage = "No Records Selected.";
      alert(this.ErrorMessage);
      return;
    }


    if (this.osinvcallbackevent)
      this.osinvcallbackevent.emit({ action: 'SAVE', ids: this.selected_invids });
  }
  // Save Data
  OnBlur(field: string) {

  }
  Close() {
    if (this.osinvcallbackevent)
      this.osinvcallbackevent.emit({ action: 'CLOSE', ids: '' });
  }

  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    this.RecordList.forEach(Rec => {
      Rec.inv_flag_b = this.selectdeselect;
      this.allchecked = this.selectdeselect;
    })
  }
}
