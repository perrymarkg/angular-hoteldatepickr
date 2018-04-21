import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DatePickrComponent } from './datepickr/date-pickr.component';
import { RangePickrComponent } from './rangepickr/range-pickr.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { CalendarRangeComponent } from './calendar-range/calendar-range.component';

import { DateService } from './services/date.service';

// Third-Party
import { ClickOutsideModule } from 'ng4-click-outside';


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    DatePickrComponent,
    RangePickrComponent,
    CalendarDayComponent,
    CalendarRangeComponent
  ],
  imports: [
    BrowserModule,
    ClickOutsideModule,
    FormsModule
  ],
  providers: [DatePipe, DateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
