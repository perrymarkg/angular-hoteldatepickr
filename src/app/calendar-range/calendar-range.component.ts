import { Component, Input } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
    selector: 'app-calendar-range',
    templateUrl: './calendar-range.component.html',
    styleUrls: ['../calendar/calendar.component.css']
})
export class CalendarRangeComponent extends CalendarComponent {

    clickStarted = false;
    clickEnded: boolean;
    dateHovered: Date;

    @Input() rangeStart: Date;
    @Input() rangeEnd: Date;

    initDates() {

        this.hideOffMonths = true;

        if ( this.rangeStart && this.rangeEnd) {
            this.activeMonth = this.createDate( this.rangeStart );
        } else {
            this.activeMonth = this.createDate( this.today );
        }

        this.days = new Array( this.totalDays ).fill(0);
        this.activeMonth.setDate(1);

    }

    selectDay( event: any ) {

        this.selectedDate = event.obj.date;
        
        this.registerClicks(event);

        this.shouldReInitialzeCalendar( event.obj.date );

        this.setDayClasses();
        
        this.dateSelected.emit({ from: this.rangeStart, to: this.rangeEnd });
    }


    registerClicks( event: any) {
        
        if ( this.rangeStart && ( event.obj.date.getTime() <= this.rangeStart.getTime() ) ) {
            this.resetClicks();
        }

        if ( !this.clickStarted ) {
            this.clickStarted = true;
            this.rangeStart = event.obj.date;
            this.rangeEnd = null;
        } else {
            this.clickStarted = false;
            this.rangeEnd = event.obj.date;
            this.dateHovered = null;
        }

        if ( this.rangeEnd && this.disabledDates && this.isDateBetweenDisabledDates( this.rangeEnd ) ) {
            this.resetClicks();
        }
    }

    resetClicks() {
        this.clickStarted = false;
        this.rangeStart = null;
        this.rangeEnd = null;
        this.dateHovered = null;
        this.selectedDate = null;
    }

    highlightDay(event: Event, day: any) {

        if ( this.clickStarted && event.type === 'mouseenter') {
            this.dateHovered = day.date;
        }

        if ( this.clickStarted ) {
            this.setDayClasses();
        }

    }

    getClass( date: any ) {
        
        if( !date ) {
            return;
        }
        
        let classes = [];

        if ( date.getMonth() < this.activeMonth.getMonth() || date.getMonth() > this.activeMonth.getMonth() ) {
            classes.push('off-month');
        }

        if ( date.getTime() === this.today.getTime() ) {
            classes.push('today');
        }

        if ( this.isDateDisabled( date ) ) {
            classes.push('disabled');
        }

       /*  let classes = this.getClass( date ); */

        classes = this.getRangeClass(date, classes);

        return classes;
        
    }

    getRangeClass( date: Date, classes: Array<string> ) {

        if ( this.rangeStart && this.rangeStart.getTime() === date.getTime() ||
            this.rangeEnd && this.rangeEnd.getTime() === date.getTime()
        ) {
            classes.push('selected');
        }

        if ( this.clickStarted &&
            this.disabledDates &&
            this.isDateBetweenDisabledDates( date ) ) {
                classes.push('disabled');
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

        return classes;
    }

    isDateBetweenDisabledDates( date: Date ) {
        let disabled = false;
        for ( let x = 0; x <= this.disabledDates.length; x++) {
            if ( this.rangeStart &&
                this.disabledDates[x] > this.rangeStart.getTime() &&
                date.getTime() >= this.disabledDates[x] ) {
                    disabled = true;
                    break;
                }
            }
        return disabled;
    }
}