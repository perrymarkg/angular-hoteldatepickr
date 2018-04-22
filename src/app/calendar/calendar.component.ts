import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DateModel } from '../date.model';
import { DateService } from '../services/date.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    @Output() dateSelected = new EventEmitter<any>();

    @Input() hideOffMonths: boolean = false;
    @Input() date: string | Date;
    @Input() minDate: string | Array<string>;
    @Input() disabledDates: Array<any>;
    selectedDate: Date;

    today: Date;
    totalDays = 35;
    days: Array<any>;

    activeMonth: Date;
    daysInMonth: number;

    prevMonthLastDay: number;
    prevMonthStartDay: number;

    nextMonth: Date;

    showMS = false; // Month Selection
    showYS = false; // Year Selection
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    years: Array<number>;

    constructor( protected ds: DateService) {
        
    }

    beforeInit() {}

    ngOnInit() {
        
        this.beforeInit();

        this.today = this.ds.today();
        
        this.disabledDates = this.initDisabledDates( this.disabledDates );
        
        this.selectedDate = this.ds.createDate( this.date ? this.date : this.today );
        
        this.initActiveMonth();

        this.daysInMonth = this.getDaysInMonth( this.activeMonth.getMonth() + 1, this.activeMonth.getFullYear() );

        this.prevMonthLastDay = this.getDaysInMonth( this.activeMonth.getMonth(), this.activeMonth.getFullYear() );

        this.prevMonthStartDay = this.prevMonthLastDay - this.activeMonth.getDay() + 1;

        this.days = this.createDays( new Array( this.totalDays ).fill(0), this.activeMonth );

    }

    initDisabledDates( disabledDates: any, selectedDate?: Date ) {
        if ( disabledDates ) {
            return disabledDates.map( (date: any, index) => {
                const d = this.ds.createDate(date);

                if ( selectedDate && d.getTime() === selectedDate.getTime() ) {
                    console.warn('Selected Date is part of disabled date');
                }
                
                return d.getTime();

            } );
        }

        return disabledDates;
    }

    initActiveMonth() {
        this.activeMonth = this.ds.createDate( this.date ? this.date : this.today );
        this.activeMonth.setDate(1);
    }

    reInitCalendar() {
        
        this.activeMonth = new Date(this.activeMonth);
        
        this.daysInMonth = this.getDaysInMonth(
            this.activeMonth.getMonth() + 1,
            this.activeMonth.getFullYear(),
        );

        this.prevMonthLastDay = this.getDaysInMonth(
            this.activeMonth.getMonth(),
            this.activeMonth.getFullYear()
        );

        this.prevMonthStartDay = this.prevMonthLastDay - this.activeMonth.getDay() + 1;
        
        this.days = this.createDays( this.days, this.activeMonth );
    }

    createDays( days: Array<any>, activeMonth: Date ) {
        return days.map( (el, index) => {
            return this.createDateModel( 
                    activeMonth.getFullYear(), 
                    activeMonth.getMonth(),
                    activeMonth.getDay(),
                    index
                );
        });
    }


    createDateModel(year: number, month: number, dayIndex: number, index: number) {
        let date: boolean | Date = false;
        let clickable = true;
        const day = (index - dayIndex ) + 1;

        if ( this.hideOffMonths && day < 1 || this.hideOffMonths && day > this.daysInMonth) {
            date = false;
        } else {
            // https://stackoverflow.com/questions/41340836/why-does-date-accept-negative-values
            // TLDR; new Date(2018, 6, -2) will subtract two days from year(2018) month(6 - July in zero-base) thus date is Jun 28 2018
            // TLDR; new Date(2018, 8, 133) will add 133 days from year(2018) month(8 - Sep in zero-base) thus date is Jan 11 2019
            date = new Date(
                year,
                month,
                day
            );

            clickable = this.isDateClickable( date, this.today, this.disabledDates );

        }

        return new DateModel(date, this.getClass(date), clickable, index);
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

        this.shouldReInitialzeCalendar( event.obj.date );

        this.setDayClasses();

        this.dateSelected.emit({selected: this.selectedDate });

    }

    shouldReInitialzeCalendar( date: Date ) {
        if ( date.getMonth() > this.activeMonth.getMonth() ||
            date.getMonth() < this.activeMonth.getMonth() ) {

            this.activeMonth.setMonth( date.getMonth() );
            this.reInitCalendar();
        }
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

    getClass( date: any ) {

        if( !date ) {
            return;
        }

        let classes = [];

        if ( this.isDateOffMonth( date, this.activeMonth ) ) {
            classes.push('off-month');
        }

        if ( this.isDateSame( date, this.today) ) {
            classes.push('today');
        }

        if ( this.isDateDisabled( date, this.disabledDates ) ) {
            classes.push('disabled');
        }

        if ( this.selectedDate && date.getTime() === this.selectedDate.getTime() ) {
            classes.push('selected')
        }

        return classes;
    }

    isDateDisabled( date: Date, disabledDates: Array<any> ) {
        return disabledDates && disabledDates.indexOf( date.getTime() ) >= 0;
    }

    isDateOffMonth( date: Date, activeMonth: Date) {
        return date.getMonth() < activeMonth.getMonth() || date.getMonth() > activeMonth.getMonth();
    }

    isDateSame(date1: Date, date2: Date) {
        return date1.getTime() === date2.getTime();
    }

    isDateClickable( date: Date, today: Date, disabledDates: Array<any>) {
        return date.getTime() >= today.getTime() || (
            disabledDates && disabledDates.indexOf( date.getTime() ) < 0 );
    }

    isDateSelected() {
        
    }

    // Year Month Selections

    showMonthSelection( event ) {
        event.preventDefault();
        event.stopPropagation();
        this.hideSelections();
        this.showMS = !this.showMS;
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
