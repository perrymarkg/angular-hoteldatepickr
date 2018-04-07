import { Component, Input } from '@angular/core';
import { DateModel } from '../date.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-date-pickr',
    templateUrl: './date-pickr.component.html',
    styleUrls: ['./date-pickr.component.css']
})
export class DatePickrComponent {

    show = false;
    selectedDate: String;
    @Input() dateFormat = 'E MMM dd, YYYY';

    constructor(private dp: DatePipe) {}

    showCalendar() {
        this.show = !this.show;
    }

    hideCalendar() {
        this.show = false;
    }

    onClickedOutside() {
        this.hideCalendar();
    }

    setSelectedDate( date: Date ) {
        this.selectedDate = this.dp.transform(date, this.dateFormat);
    }
}
