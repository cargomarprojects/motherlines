import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges , HostListener} from '@angular/core';


@Component({
    selector: 'InputBox',
    templateUrl: './inputbox.component.html'
})


export class InputBoxComponent {

    @Input() inputModel: string;
    @Output() inputModelChange = new EventEmitter<string>();
    @Input() disabled: boolean = false;
    @Input() maxlength: number = 1;

    @Input() uppercase: boolean = false;
    @Input() lowercase: boolean = false;

    @ViewChild('inputbox') private inputbox: ElementRef;

    constructor() {
    }

    ngOnInit() {

    }

    onBlur() {
        if (this.inputModel != null) {
            if (this.uppercase) {
                this.inputModel = this.inputModel.toUpperCase();

            }
            else if (this.lowercase) {
                this.inputModel = this.inputModel.toLowerCase();
            }
        }
        this.inputModelChange.emit(this.inputModel);        
    }

    public focus() {
        if (!this.disabled)
          this.inputbox.nativeElement.focus();
      }

}
