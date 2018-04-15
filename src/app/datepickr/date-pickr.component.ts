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

            if( typeof this.from === 'string') {
                this.from = new Date(this.from);
            }
    
            if( typeof this.to === 'string') {
                this.to = new Date(this.to);
            }

            this.from.setHours(0, 0, 0, 0);
            this.to.setHours(0, 0, 0, 0);
            this.output = this.formatDate(this.from, 'From') + ' > ' + this.formatDate(this.to, 'To');

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
            this.from = event.from;
            this.to = event.to;

            this.output = this.formatDate(this.from, 'From') + ' > ' + this.formatDate(this.to, 'To');
            return;
        }

        this.output = this.formatDate( event.selected, '' );
    }

    formatDate(date: Date | String, def: string) {

        if( typeof date === 'string' ) {
            date = new Date(date);
        }

        const result = this.dp.transform(date, this.dateFormat);
        return result ? result : def;
    }

}
