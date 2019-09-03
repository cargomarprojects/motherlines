import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html'
})

export class DateComponent {
    @Input() public inputdate: string;
    @Output() ValueChanged = new EventEmitter<string>();
    @Input() disabled: boolean = false;

    @ViewChild('inputbox') private inputbox: ElementRef;

    DisplayDate: string;
    ReturnDate: string;

    yy: number;
    mm: number;
    dd: number;

    constructor(
        private gs: GlobalService
    ) {
    }
    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName == "inputdate") {
                this.InitDate();
            }
        }
    }


    InitDate() {

        this.yy = 0; this.mm = 0; this.dd = 0;
        if (this.inputdate == null || this.inputdate == undefined || this.inputdate == '') {
            this.inputdate = "";
            this.DisplayDate = "";
        }
        if (this.inputdate.indexOf("-") != -1) {
            var parts1 = this.inputdate.split("-");
            if (parts1.length == 3) {
                this.yy = parseInt(parts1[0], 10);
                this.mm = parseInt(parts1[1], 10);
                this.dd = parseInt(parts1[2], 10);
                if (this.gs.DateFormat() === "dd")
                    this.DisplayDate = ("00" + this.dd).slice(-2) + "/" + ("00" + this.mm).slice(-2) + "/" + this.yy;
                if (this.gs.DateFormat() === "mm")
                    this.DisplayDate = ("00" + this.mm).slice(-2) + "/" + ("00" + this.dd).slice(-2) + "/" + this.yy;
            }
        }

    }

    GetDisplayDate() {
        return this.DisplayDate;
    }

    Focus() {
        if (!this.disabled)
            this.inputbox.nativeElement.focus();
    }


    OnBlur1() {
        if (this.isValidDate()) {

            if (this.gs.DateFormat() === 'dd')
                this.DisplayDate = this.dd + "/" + this.mm + "/" + this.yy;
            if (this.gs.DateFormat() === 'mm')
                this.DisplayDate = this.mm + "/" + this.dd + "/" + this.yy;

            this.ReturnDate = this.yy + "-" + this.mm + "-" + this.dd;
            this.ValueChanged.emit(this.ReturnDate);
            return true;
        }
        else {
            this.DisplayDate = "";
            this.ReturnDate = "";
            this.ValueChanged.emit(this.ReturnDate);
            return false;
        }
    }

    isValidDate() {

        var date1 = new Date();

        var sepchar = '';

        this.yy = 0;
        this.mm = 0;
        this.dd = 0;

        // Parse the date parts to integers

        if (this.DisplayDate == null || this.DisplayDate == undefined)
            this.DisplayDate = "";

        if (this.DisplayDate.indexOf("/") != -1)
            sepchar = '/';
        if (this.DisplayDate.indexOf("-") != -1)
            sepchar = '-';

        if (sepchar != '') {
            var parts = this.DisplayDate.split(sepchar);
            if (parts.length == 3) {

                if (this.gs.DateFormat() === 'dd') {
                    this.dd = parseInt(parts[0], 10);
                    this.mm = parseInt(parts[1], 10);
                    this.yy = parseInt(parts[2], 10);
                }
                if (this.gs.DateFormat() === 'mm') {
                    this.mm = parseInt(parts[0], 10);
                    this.dd = parseInt(parts[1], 10);
                    this.yy = parseInt(parts[2], 10);
                }

            }
        }
        else {

            if (this.DisplayDate.length == 1 || this.DisplayDate.length == 2) {
                if (parseInt(this.DisplayDate) >= 0 && parseInt(this.DisplayDate) <= 31) {
                    this.dd = parseInt(this.DisplayDate);
                    this.mm = date1.getMonth() + 1;
                    this.yy = date1.getFullYear();
                }
            }
            if (this.DisplayDate.length == 4 ) {
                if (this.gs.DateFormat() === 'dd') {
                    this.dd = parseInt(this.DisplayDate.substr(0, 2));
                    this.mm = parseInt(this.DisplayDate.substr(2, 2));
                    this.yy = this.gs.defaultValues.yy;
                }
                if (this.gs.DateFormat() === 'mm') {
                    this.mm = parseInt(this.DisplayDate.substr(0, 2));
                    this.dd = parseInt(this.DisplayDate.substr(2, 2));
                    this.yy = 0;
                }                
            }            
            else if (this.DisplayDate.length == 6 || this.DisplayDate.length == 8) {
                if (this.gs.DateFormat() === 'dd') {
                    this.dd = parseInt(this.DisplayDate.substr(0, 2));
                    this.mm = parseInt(this.DisplayDate.substr(2, 2));
                    if (this.DisplayDate.length == 6)
                        this.yy = parseInt(this.DisplayDate.substr(4, 2)) + 2000;
                    else
                        this.yy = parseInt(this.DisplayDate.substr(4, 4));
                }
                if (this.gs.DateFormat() === 'mm') {
                    this.mm = parseInt(this.DisplayDate.substr(0, 2));
                    this.dd = parseInt(this.DisplayDate.substr(2, 2));
                    if (this.DisplayDate.length == 6)
                        this.yy = parseInt(this.DisplayDate.substr(4, 4)) + 2000;
                    else
                        this.yy = parseInt(this.DisplayDate.substr(4, 4));
                }
            }
        }


        // Check the ranges of month and year
        if (this.yy < 1000 || this.yy > 3000 || this.mm < 1 || this.mm > 12) {
            return false;
        }

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (this.yy % 400 == 0 || (this.yy % 100 != 0 && this.yy % 4 == 0)) {
            monthLength[1] = 29;
        }

        // Check the range of the day
        if (this.dd > 0 && this.dd <= monthLength[this.mm - 1]) {
            return true;
        }
        else {
            return false;
        }
    }

}
