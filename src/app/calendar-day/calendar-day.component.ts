import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { DateModel } from '../date.model';

@Component({
    selector: 'app-calendar-day',
    templateUrl: './calendar-day.component.html',
    styleUrls: ['./calendar-day.component.css']
})
export class CalendarDayComponent implements OnInit {

    @Output() clicked = new EventEmitter<{}>();
    @Input() day;

    constructor() {}

    ngOnInit() {
        if ( !this.day && this.day.date.getTime() === '1535241600000' ) { // Aug 26 1989
            console.log(this.day);
        }
    }

    dateClick( event: Event ) {
        event.preventDefault();
        event.stopPropagation();

        this.clicked.emit({obj: this.day});
    }

}
