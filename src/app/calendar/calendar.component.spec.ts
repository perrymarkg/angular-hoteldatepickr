import { TestBed, async } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
describe('CalendarComponentTest', () => {

    it('should initialize var activemonth to current month', async(() => {
        const comp = new CalendarComponent();
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        comp.setVars();

        expect(comp.activeMonth.getTime()).toBe(currentMonth.getTime());

    }));
    it('should initialize vars when `date` is passed', () => {
        const comp = new CalendarComponent();
        const dateString = '2018-06-09';
        const dateObj = new Date(dateString);

        comp.date = dateString;
        comp.setVars();


        expect(comp.activeMonth.getMonth()).toBe(dateObj.getMonth());
    });
    it('should not disable today when date is selected', () => {
        const comp = new CalendarComponent();
        comp.setVars();
        comp.initCalendar();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expect(comp.isDateClickable(today)).toBe(false);
        comp.selectDay(new Event('click'), new Date('2018-04-13'));
        expect(comp.isDateClickable(today)).toBe(false);
    });
});
