import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';


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

    constructor() {
    }

    ngOnInit() {

    }

    OnBlur() {
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

}
