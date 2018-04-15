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
    selectedDate: string;

    output: string;

    @Input() disabledDates: Array<Date | string>;
    @Input() from: Date | string;
    @Input() to: Date | string;

    @Input() type: string;
    @Input() name: string;
    @Input() dateFormat = 'E MMM dd, YYYY';

    constructor(private dp: DatePipe) {}

    ngOnInit() {

        if ( this.type === 'range' ) {
            this.output = 'From > To';
            return;
        }

        this.output = this.selectedDate;
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

    setSelectedDate( event: any ) {
        this.selectedDate = this.dp.transform( event.selected, this.dateFormat);

        if ( this.type === 'range' ) {
            this.from = event.from ? this.dp.transform( event.from, this.dateFormat) : 'From';
            this.to = event.to ? this.dp.transform( event.to ) : 'To';

            this.output = this.from + ' > ' + this.to;
            return;
        }

        this.output = this.dp.transform( event.selected, this.dateFormat);
    }
}
