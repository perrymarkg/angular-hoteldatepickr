import { Component, Input, OnInit } from '@angular/core';
import { DateModel } from '../date.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-date-pickr',
    templateUrl: './date-pickr.component.html',
    styleUrls: ['./date-pickr.component.css']
})
export class DatePickrComponent implements OnInit {

    show = false;
    selectedDate: String;

    @Input() from: Date | string;
    @Input() to: Date | string;

    @Input() type: string;
    @Input() name: string;
    @Input() dateFormat = 'E MMM dd, YYYY';

    constructor(private dp: DatePipe) {}

    ngOnInit() {
    }

    showCalendar() {
        this.show = !this.show;
    }

    hideCalendar() {
        this.show = false;
    }

    onClickedOutside() {
        if ( this.show ) {
            this.hideCalendar();
        }
    }

    setSelectedDate( date: Date ) {
        this.selectedDate = this.dp.transform(date, this.dateFormat);
    }
}
