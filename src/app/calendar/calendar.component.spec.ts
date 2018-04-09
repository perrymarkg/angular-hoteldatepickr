import { TestBed, async } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
describe('CalendarComponentTest', () => {
    
    it('should initialize var activemonth to current month', async(() => {
        let comp = new CalendarComponent();
        let currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        comp.setVars();

        expect(comp.activeMonth.getTime()).toBe(currentMonth.getTime());
        
    }));
    it('should initialize vars when `date` is passed', () => {
        let comp = new CalendarComponent();
        let dateString = '2018-06-09';
        let dateObj = new Date(dateString);

        comp.date = dateObj;
        comp.setVars();

        console.log(comp.activeMonth, dateObj);
        expect(comp.activeMonth.getTime()).toBe(dateObj.getTime());
    });
    it('should not disable today', () => {
        let comp = new CalendarComponent();
        comp.setVars();
        comp.initCalendar();
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        expect(comp.isDateDisabled(today)).toBe(false);
    })
});