import { TestBed, async } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { DatePipe } from '@angular/common';

describe('CalendarComponent Tests', () => {

    const component = null;
    const fixture: TestBed = null;
    const dp = new DatePipe('en');

    beforeEach( async( () => {
        TestBed.configureTestingModule({
            declarations: [
                CalendarComponent,
                CalendarDayComponent
            ],
            providers: [DatePipe]
        }).compileComponents();

        this.fixture = TestBed.createComponent(CalendarComponent);
        this.component = this.fixture.debugElement.componentInstance;
    }) );



    it('should create the app', async(() => {
        expect(this.component).toBeTruthy();
    }));

    it('should initialize default variables', (async () => {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Active month to first day of today
        const activeMonth = new Date(today);
        activeMonth.setDate(1);

        const nextMonth = new Date(activeMonth);
        nextMonth.setMonth( activeMonth.getMonth() + 1 );

        this.fixture.detectChanges();

        expect( this.component.activeMonth.getTime() ).toBe( activeMonth.getTime() );
        expect( this.component.nextMonth.getTime() ).toBe( nextMonth.getTime() );
    }));

    it('shoud initilize variables with selected date', ( async() => {

        const selectedDate = new Date('2018-08-28');
        selectedDate.setHours(0, 0, 0, 0);

        const nextMonth = new Date();
        nextMonth.setMonth(selectedDate.getMonth() + 1);
        nextMonth.setFullYear( selectedDate.getFullYear() );
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);

        this.fixture.detectChanges();

        this.component.date = selectedDate;

        this.fixture.detectChanges();
        this.component.ngOnInit();

        expect(this.component.selectedDate.getTime()).toBe(selectedDate.getTime());
        expect(this.component.nextMonth.getTime()).toBe(nextMonth.getTime());

    }));

});

