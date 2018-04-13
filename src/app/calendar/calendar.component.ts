import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DateModel } from '../date.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    @Output() dateSelected = new EventEmitter<Date>();

    @Input() type: string;
    @Input() date: string | Date;
    @Input() minDate: string | Array<string>;
    @Input() disabledDates: Array<any>;
    selectedDate: Date;


    today = new Date();
    totalDays = 35;
    days: Array<any>;

    activeMonth: Date;
    daysInMonth: number;

    prevMonthLastDate: Date;
    prevMonthStartDay: number;

    nextMonth: Date;
    nextMonthStartDay: number;

    showMS = false; // Month Selection
    showYS = false; // Year Selection
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    years: Array<number>;

    // Range Vars
    clickStarted = false;
    clickEnded = true;
    dateHovered: Date;
    @Output() rangeStart: Date;
    @Output() rangeEnd: Date;
    @Output() rangeStarted = new EventEmitter<Date>();
    @Output() rangeEnded = new EventEmitter<Date>();

    constructor(private dp: DatePipe) {
        this.today.setHours(0, 0, 0, 0);
    }

    ngOnInit() {
        this.initDisabledDates();
        this.initDates();
        this.initCalendar();
    }

    isValidDateObj( date: any) {
        return Object.prototype.toString.call(this.date) === '[object Date]';
    }

    initDates() {

        // Set the selected date and the activemonth date object
        if ( this.date ) {
            if ( typeof this.date === 'string') {
                this.selectedDate = new Date(this.date);
                this.activeMonth = new Date(this.date);
            } else if ( Object.prototype.toString.call(this.date) === '[object Date]' ) {
                this.selectedDate = new Date(this.date.getTime());
                this.activeMonth = new Date(this.date.getTime());
            }
            this.selectedDate.setHours(0, 0, 0, 0);
        }

        if ( !this.selectedDate ) {
            this.activeMonth = new Date( this.today );
        }

        this.days = new Array( this.totalDays ).fill(0);
        this.activeMonth.setDate(1);

    }

    initDisabledDates() {
        if ( this.disabledDates ) {
            this.disabledDates = this.disabledDates.map( (date: any) => {
                let d;

                if ( typeof date === 'string') {
                    d = new Date( date );
                } else if ( this.isValidDateObj(date) ) {
                    d = date;
                }

                d.setHours(0, 0, 0, 0);
                if ( this.selectedDate && d.getTime() === this.selectedDate.getTime() ) {
                    console.warn('Selected Date is part of disabled date');
                }
                return d.getTime();
            } );
        }
    }

    createYears() {
        const total = 9;
        const limit = 4;
        this.years = new Array(total).fill(0).map( (el, index) => {
            if ( index <= limit) {
                el = this.activeMonth.getFullYear() - (limit - index);
            } else {
                el = this.activeMonth.getFullYear() + (index - limit );
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
        // @Todo: Improve
        this.days = this.days.map( (el, index) => {
            let date;
            let clickable = true;
            const day = (index - this.activeMonth.getDay() ) + 1;

            if ( this.type && day < 1 || this.type && day > this.daysInMonth) {
                date = false;
            } else {
                // https://stackoverflow.com/questions/41340836/why-does-date-accept-negative-values
                // TLDR; new Date(2018, 6, -2) will subtract two days from year(2018) month(6 - July in zero-base) thus date is Jun 28 2018
                // TLDR; new Date(2018, 8, 133) will add 133 days from year(2018) month(8 - Sep in zero-base) thus date is Jan 11 2019
                date = new Date(
                    this.activeMonth.getFullYear(),
                    this.activeMonth.getMonth(),
                    day
                );

                if ( date.getTime() < this.today.getTime() ||
                    ( this.disabledDates && this.disabledDates.indexOf( date.getTime() ) >= 0 ) ) {
                    clickable = false;
                }

            }

            return new DateModel(date, this.getClass(date), clickable);

        });
    }

    setDayClasses() {
        this.days = this.days.map( (el, i) => {
            el.classes = this.getClass(el.date);
            return el;
        });
    }

    getDaysInMonth(month, year): number {
        // Setting day parameter to 0 means one day less than first day of the month.
        return new Date(year, month, 0).getDate();
    }

    selectDay( event: any ) {

        this.selectedDate = event.obj.date;

        if ( this.type === 'range') {
            this.registerClicks(event);
            this.checkIfRangeAllowed();
        }

        if ( event.obj.date.getMonth() > this.activeMonth.getMonth() || 
        event.obj.date.getMonth() < this.activeMonth.getMonth() ) {
            this.activeMonth.setMonth( event.obj.date.getMonth() );
            this.reInitCalendar();
        }

        this.setDayClasses();

        this.dateSelected.emit( event.obj.date );
    }

    registerClicks( event: any) {

        if ( this.rangeStart && event.obj.date.getTime() < this.rangeStart.getTime() ) {
            this.clickStarted = false;
            this.rangeStart = null;
            this.dateHovered = null;
        }

        if ( !this.clickStarted ) {
            this.clickStarted = true;
            this.rangeStart = event.obj.date;
            this.rangeEnd = null;
            this.rangeStarted.emit(event.obj.date);
        } else {
            this.clickStarted = false;
            this.rangeEnd = event.obj.date;
            this.rangeEnded.emit(event.obj.date);
            this.dateHovered = null;
        }

    }

    checkIfRangeAllowed() {
        if ( this.rangeStart ) {

        }
    }

    highlightDay(event: Event, day: any) {
        if ( this.clickStarted && event.type === 'mouseenter') {
            this.dateHovered = day.date;
        }

        if ( this.clickStarted && event.type === 'mouseleave') {
            this.dateHovered = null;
        }
        this.setDayClasses();
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

        if ( !date ) {
            classes.push('grey');
        } else {

            if ( date.getMonth() < this.activeMonth.getMonth() || date.getMonth() > this.activeMonth.getMonth() ) {
                classes.push('grey');
            }

            if ( date.getTime() === this.today.getTime() ) {
                classes.push('today');
            }

            if (
                this.selectedDate && date.getTime() === this.selectedDate.getTime() ||
                this.rangeStart && this.rangeStart.getTime() === date.getTime() ||
                this.rangeEnd && this.rangeEnd.getTime() === date.getTime()
            ) {
                classes.push('selected');
            }

            if( this.isDateDisabled( date ) ) {
                classes.push('disabled')
            }

            if (
                (
                    this.clickStarted && this.dateHovered &&
                    date.getTime() > this.rangeStart.getTime() &&
                    this.dateHovered && date.getTime() <= this.dateHovered.getTime()
                ) || (
                    this.rangeStart && this.rangeEnd &&
                    date.getTime() > this.rangeStart.getTime() &&
                    date.getTime() < this.rangeEnd.getTime()
                )
              ) {
                classes.push('highlight');
            }

        }

        return classes;
    }

    isDateDisabled( date: Date ) {
        return this.disabledDates && this.disabledDates.indexOf( date.getTime() ) >= 0;
    }

    // Year Month Selections

    showMonthSelection( event ) {
        event.preventDefault();
        event.stopPropagation();
        this.hideSelections();
        this.showMS = !this.showMS;
    }

    showYearSelection( event ) {
        event.preventDefault();
        event.stopPropagation();
        this.hideSelections();
        this.showYS = !this.showYS;
        if ( this.showYS ) {
            this.createYears();
        }
    }

    hideSelections() {
        this.showMS = false;
        this.showYS = false;
    }

    cycleYear( type: string ) {
        let start;

        if ( type === 'prev') {
            start = this.years[0] - 9;
        }

        if ( type === 'next') {
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

        if ( index >= 0 && this.activeMonth.getMonth() !== index ) {
            this.activeMonth.setMonth(index);
            this.reInitCalendar();
        }
        this.hideSelections();
    }

    isSelectedMonth( month: string ) {
        return this.activeMonth.getMonth() === this.months.indexOf(month);
    }

    isSelectedYear( year: number ) {
        return this.activeMonth.getFullYear() === year;
    }

    setYear( event: Event, year: number ) {
        event.preventDefault();
        event.stopPropagation();
        if ( this.activeMonth.getFullYear() !== year ) {
            this.activeMonth.setFullYear( year );
            this.reInitCalendar();
        }
        this.hideSelections();
    }
}
