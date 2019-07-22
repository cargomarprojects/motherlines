import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges , HostListener} from '@angular/core';

import { GlobalService } from '../../core/services/global.service';

@Component({
    selector: 'InputBoxNumber',
    templateUrl: './inputboxnumber.component.html'
})


export class InputBoxNumberComponent {

    @Input() inputModel: number;
    @Output() inputModelChange = new EventEmitter<number>();
    @Input() disabled: boolean = false;
    @Input() maxlength: number = 25;
    @Input() dec: number = 2;

    @ViewChild('inputbox') private inputbox: ElementRef;

    constructor(public gs: GlobalService,
    ) {
    }

    ngOnInit() {

    }

    onBlur() {
        if (this.inputModel != null) {
            this.inputModel = this.gs.roundNumber(this.inputModel, this.dec);            
        }
        this.inputModelChange.emit(this.inputModel);        
    }

    public focus() {
        if (!this.disabled)
          this.inputbox.nativeElement.focus();
      }

}
