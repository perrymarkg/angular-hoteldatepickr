import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  dateTest = new Date('2018-08-25');

  disabledDatesString = ['2018-08-24', '2018-04-19'];
  disabledDates = [new Date('2018-08-24'), new Date('2018-08-27')];
  
  ngOnInit() {
    /* this.disabledDatesString.map( el => {
      this.disabledDates.push(new Date(el));
    });

    console.log(this.disabledDates, this.disabledDatesString); */
  }
}
