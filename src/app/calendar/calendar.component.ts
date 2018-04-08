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
    @Input() disabledDates: Array<any>;
    selectedDate: Date;

    today = new Date();
    totalDays = 35;
    days: Array<Date>;

    activeMonth: Date;
    daysInMonth: number;

    prevMonthLastDate: Date;
    prevMonthStartDay: number;

    nextMonth: Date;
    nextMonthStartDay: number;

    showMS = false; // Month Selection
    showYS = false; // Year Selection
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    years: Array<number>;

    constructor( private datepipe: DatePipe) {}

    ngOnInit() {
        this.setVars();

        this.initCalendar();
    }

    setVars() {

        this.days = new Array( this.totalDays ).fill(0);

        if ( this.date ) {
            this.selectedDate = new Date(this.date);
            this.selectedDate.setHours(0, 0, 0, 0);
            this.activeMonth = new Date(this.date);
            this.activeMonth.setDate(1);
        }

        if ( !this.selectedDate ) {
            this.activeMonth = new Date( this.today );
            this.activeMonth.setDate(1);
        }

        if ( this.disabledDates ) {
            this.disabledDates = this.disabledDates.map( (date: string) => {
                const d = new Date( date );
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            } );
        }

        this.today.setHours(0, 0, 0, 0);
        
    }

    createYears() {
        const limit = 4
        this.years = new Array(12).fill(0).map( (el, index) => {
            if( index <= 4) {
                el = this.activeMonth.getFullYear() - (4 - index);
            } else {
                el = this.activeMonth.getFullYear() + (index - 4 );
            }
            return el;
        });
    }

    initCalendar() {
        this.setMonths();
        this.setDays();
    }

    reInitCalendar() {
        this.activeMonth = new Date(this.activeMonth);
        this.initCalendar();
    }

    setMonths() {

        this.daysInMonth = this.getDaysInMonth(
            this.activeMonth.getMonth() + 1,
            this.activeMonth.getFullYear()
        );

        this.prevMonthLastDate = new Date(
            this.activeMonth.getFullYear(),
            this.activeMonth.getMonth(), 0
        );

        this.prevMonthStartDay = this.prevMonthLastDate.getDate() - this.activeMonth.getDay() + 1;

        this.nextMonth = new Date( this.activeMonth.getFullYear(), this.activeMonth.getMonth() + 1, 1);

    }

    setDays() {
        this.nextMonthStartDay = 1;
        this.days = this.days.map( (el, index) => {
            let date;

            if ( index < this.activeMonth.getDay() ) {

                date = new Date(
                    this.prevMonthLastDate.getFullYear(),
                    this.prevMonthLastDate.getMonth(),
                    this.prevMonthStartDay + index
                );
            } else if ( ( index - this.activeMonth.getDay() ) >= this.daysInMonth) {
                date = new Date(
                    this.nextMonth.getFullYear(),
                    this.nextMonth.getMonth(),
                    this.nextMonthStartDay++
                );
            } else {
                date = new Date(
                    this.activeMonth.getFullYear(),
                    this.activeMonth.getMonth(),
                    (index - this.activeMonth.getDay() ) + 1
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
        event.stopPropagation();
        this.selectedDate = date;
        
        if( date.getMonth() > this.activeMonth.getMonth() || date.getMonth() < this.activeMonth.getMonth() ){
            this.activeMonth.setMonth( date.getMonth() );
            this.reInitCalendar();
        }
        this.dateSelected.emit( date );
    }

    cycleMonth(event, type) {
        event.preventDefault();

        if ( type === 'next') {
            this.activeMonth.setMonth( this.activeMonth.getMonth() + 1);
        }

        if ( type === 'prev') {
            this.activeMonth.setMonth( this.activeMonth.getMonth() - 1);
        }

        this.reInitCalendar();
    }

    getClass( date: Date) {

        const classes = [];
        if ( date.getMonth() < this.activeMonth.getMonth() || date.getMonth() > this.activeMonth.getMonth() ) {
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

    isDateDisabled( date: Date ) {
        let isDisabled = false;
        if ( date.getTime() < this.today.getTime() ) {
            isDisabled = true;
        }

        if ( this.disabledDates ) {
            this.disabledDates.map( el => {
                if ( el === date.getTime() ) {
                    isDisabled = true;
                }
            });
        }

        return isDisabled;
    }

    showMonthSelection( event ) {
        event.preventDefault();
        this.hideSelections();
        this.showMS = !this.showMS;
    }

    showYearSelection( event ) {
        event.preventDefault();
        this.hideSelections();
        this.showYS = !this.showYS;
        if( this.showYS ) {
            this.createYears();
        }
    }

    hideSelections() {
        this.showMS = false;
        this.showYS = false;
    }

    cycleYear( type: string ) {
        let start

        if( type === 'prev') {
            start = this.years[0] - 12;
        }

        if( type === 'next') {
            start = this.years[this.years.length - 1] + 1;
        }

        this.years = this.years.map( (el) => {
            return start++;
        });
    }

    setMonth( event, month ) {
        event.preventDefault();
        event.stopPropagation(); // prevent click bubbling triggering top leve on-click outside.
        const index = this.months.indexOf(month);
        
        if( index >= 0 && this.activeMonth.getMonth() !== index ) {
            this.activeMonth.setMonth(index);
            this.reInitCalendar();
            this.hideSelections();
        }
    }

    isSelectedMonth( month: string ) {
        return this.activeMonth.getMonth() === this.months.indexOf(month)
    }

    isSelectedYear( year: number ) {
        return this.activeMonth.getFullYear() === year;
    }

    setYear( event: Event, year:number ) {
        event.preventDefault();
        event.stopPropagation();
        if( this.activeMonth.getFullYear() !== year ){
            this.activeMonth.setFullYear( year );
            this.reInitCalendar();
            this.hideSelections();
        }
    }
}
