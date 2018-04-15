import { Component } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  dateTest = new Date('2018-08-25');

  disabledDates = ['2018-04-24', '2018-04-19'];
}
