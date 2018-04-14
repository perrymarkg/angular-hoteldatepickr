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
    }

    dateClick( event: Event ) {
        event.preventDefault();
        event.stopPropagation();

        this.clicked.emit({obj: this.day});
    }

}
