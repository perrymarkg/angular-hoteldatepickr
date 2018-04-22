import { Component, Input } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DateService } from '../services/date.service';

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

    beforeInit() {
        this.hideOffMonths = true;
    }

    initActiveMonth() {
        if ( this.rangeStart && this.rangeEnd) {
            this.activeMonth = this.ds.createDate( this.rangeStart );
        } else {
            this.activeMonth = this.ds.createDate( this.today );
        }
    }

    selectDay( event: any ) {

        //this.selectedDate = event.obj.date;
        
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

        if ( this.rangeEnd && 
            this.disabledDates && 
            this.isDateBetweenDisabledDates( this.rangeEnd, this.disabledDates ) 
        ) {
            this.resetClicks();
        }
    }

    resetClicks() {
        this.clickStarted = false;
        this.rangeStart = null;
        this.rangeEnd = null;
        this.dateHovered = null;
        //this.selectedDate = null;
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
        
        let classes = super.getClass( date );

        classes = this.getRangeClass(date, classes);

        return classes;
        
    }

    getRangeClass( date: Date, classes: Array<string> ) {

        if ( this.isRangeSelected( this.rangeStart, this.rangeEnd, date) ) {
            classes.push('selected');
        }

        if ( this.clickStarted &&
            this.disabledDates &&
            this.isDateBetweenDisabledDates( date, this.disabledDates ) ) {
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

    isRangeSelected(start: Date, end: Date, date: Date) {
        return start && start.getTime() === date.getTime() || end && end.getTime() === date.getTime();
    }

    /* isDateDisabled( clickStarted: Date | boolean, disabledDates: Array<any>) {
        return true;
    } */

    isDateBetweenDisabledDates( date: Date, disabledDates: any ) {
        let disabled = false;
        for ( let x = 0; x <= disabledDates.length; x++) {
            if ( this.rangeStart &&
                disabledDates[x] > this.rangeStart.getTime() &&
                date.getTime() >= disabledDates[x] ) {
                    disabled = true;
                    break;
                }
            }
        return disabled;
    }
}