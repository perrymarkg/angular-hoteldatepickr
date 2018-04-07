import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateModel } from '../date.model';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    @Output() dateSelected = new EventEmitter<Date>();

    @Input() date;
    selectedDate: Date;

    today = new Date();
    totalDays = 35;
    days: Array<Date>;

    startDateOfMonth: Date;
    daysInMonth: number;

    prevMonthLastDate: Date;
    prevMonthStartDay: number;

    nextMonth: Date;
    nextMonthStartDay: number;

    constructor( private datepipe: DatePipe) {}

    ngOnInit() {
        this.days = new Array( this.totalDays ).fill(0);

        if ( this.date ) {
            this.selectedDate = new Date(this.date);
            this.selectedDate.setHours(0, 0, 0, 0);
            this.startDateOfMonth = new Date(this.date);
            this.startDateOfMonth.setDate(1);
        }

        if ( !this.selectedDate ) {
            this.startDateOfMonth = new Date( this.today );
            this.startDateOfMonth.setDate(1);
        }

        this.today.setHours(0, 0, 0, 0);

        this.initCalendar();
    }

    initCalendar() {
        this.setMonths();
        this.mapDays();
    }

    setMonths() {

        this.daysInMonth = this.getDaysInMonth(
            this.startDateOfMonth.getMonth() + 1,
            this.startDateOfMonth.getFullYear()
        );

        this.prevMonthLastDate = new Date(
            this.startDateOfMonth.getFullYear(),
            this.startDateOfMonth.getMonth(), 0
        );

        this.prevMonthStartDay = this.prevMonthLastDate.getDate() - this.startDateOfMonth.getDay() + 1;

        this.nextMonth = new Date( this.startDateOfMonth.getFullYear(), this.startDateOfMonth.getMonth() + 1, 1);

    }

    mapDays() {
        this.nextMonthStartDay = 1;
        this.days = this.days.map( (el, index) => {
            let date;

            if ( index < this.startDateOfMonth.getDay() ) {

                date = new Date(
                    this.prevMonthLastDate.getFullYear(),
                    this.prevMonthLastDate.getMonth(),
                    this.prevMonthStartDay + index
                );
            } else if ( ( index - this.startDateOfMonth.getDay() ) >= this.daysInMonth) {
                date = new Date(
                    this.nextMonth.getFullYear(),
                    this.nextMonth.getMonth(),
                    this.nextMonthStartDay++
                );
            } else {
                date = new Date(
                    this.startDateOfMonth.getFullYear(),
                    this.startDateOfMonth.getMonth(),
                    (index - this.startDateOfMonth.getDay() ) + 1
                );
            }

            return date;
        });
    }

    getDaysInMonth(month, year): number {
        // Setting day parameter to 0 means one day less than first day of the month.
        return new Date(year, month, 0).getDate();
    }

    selectDay( event, date: Date ) {
        event.preventDefault();
        this.selectedDate = date;
        this.dateSelected.emit( date );
    }

    setMonth(event, type) {
        event.preventDefault();

        if ( type === 'next') {
            this.startDateOfMonth.setMonth( this.startDateOfMonth.getMonth() + 1);
        }

        if ( type === 'prev') {
            this.startDateOfMonth.setMonth( this.startDateOfMonth.getMonth() - 1);
        }

        // Re-render
        this.startDateOfMonth = new Date( this.startDateOfMonth );

        this.initCalendar();
    }

    getClass( date: Date) {

        const classes = [];
        if ( date.getMonth() < this.startDateOfMonth.getMonth() || date.getMonth() > this.startDateOfMonth.getMonth() ) {
            classes.push('grey');
        }

        if ( date.getTime() === this.today.getTime() ) {
            classes.push('today');
        }

        if ( this.selectedDate && date.getTime() === this.selectedDate.getTime() ) {
            classes.push('selected');
        }

        return classes.toString().replace(/,/g, ' ');
    }
}
