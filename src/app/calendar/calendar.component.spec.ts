import { TestBed, async, fakeAsync } from '@angular/core/testing';
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

    it('should get days in months', async(() => {
        this.fixture.detectChanges();
        // Get days in september 2018
        const days = this.component.getDaysInMonth(9, 2018);
        expect(days).toBe(30);
    }));

    it('should set months', async( () => {
        const selectedDate = new Date('2018-05-23');
        selectedDate.setHours(0, 0, 0, 0);

        this.component.date = new Date(selectedDate);

        this.fixture.detectChanges();

        expect( this.component.daysInMonth ).toBe(31);
        expect( this.component.prevMonthLastDay ).toBe( 30 );
        expect( this.component.prevMonthStartDay ).toBe(29);

    }));

    it('should create date model', async( () => {
        let model;
        const selectedDate = new Date('2018-08-28');
        const d1 = new Date('2018-07-29 0:00:00');
        const d2 = new Date('2018-08-28 0:00:00');
        const d3 = new Date('2018-08-15 0:00:00');

        this.component.date = new Date(selectedDate);

        this.fixture.detectChanges();
        model = this.component.createDateModel(2018, 7, 3, 0);
        expect( model.date.getTime() ).toBe( d1.getTime() );
        model = this.component.createDateModel(2018, 7, 3, 30);
        expect( model.date.getTime() ).toBe( d2.getTime() );
        model = this.component.createDateModel(2018, 7, 3, 17);
        expect( model.date.getTime() ).toBe( d3.getTime() );

    }));

    it('should initialize default variables', async( () => {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Active month to first day of today
        const activeMonth = new Date(today);
        activeMonth.setDate(1);

        this.fixture.detectChanges();

        expect( this.component.activeMonth.getTime() ).toBe( activeMonth.getTime() );
    }));

    it('should initialize vars when date is passed', async( () => {
        const date = new Date('2018-08-28');
        date.setHours(0, 0, 0, 0);
        this.component.date = date;

        this.fixture.detectChanges();
        expect( this.component.selectedDate.getTime() ).toBe( date.getTime() );
        date.setDate(1); // Aug 01 2018
        expect( this.component.days[3].date.getTime() ).toBe( date.getTime() );
        date.setDate(-2); // Jul 29 2018
        expect(this.component.days[0].date.getTime() ).toBe( date.getTime() );
    }));

    it('should validate date object', async( () => {
        const date = new Date('2015-04-15');
        const r = this.component.isValidDateObj(date);

        expect(r).toBe(true);
    }));

    it('should initialize disabled dates | string', async( () => {
        const disabledTimes = [1535385600000, 1473696000000, 1561651200000];
        this.component.disabledDates = ['2018-08-28', '2016-09-13', '2019-06-28'];

        this.fixture.detectChanges();

        expect( this.component.disabledDates ).toEqual( disabledTimes );
    }));

    it('should initialize disabled dates | DateObj', async( () => {
        const disabledTimes = [1535385600000, 1473696000000, 1561651200000];
        this.component.disabledDates = [
            new Date('2018-08-28'),
            new Date('2016-09-13'),
            new Date('2019-06-28')
        ];

        this.fixture.detectChanges();

        expect( this.component.disabledDates ).toEqual( disabledTimes );
    }));

    it('should initialize disabled dates | Mixed', async( () => {
        const disabledTimes = [1535385600000, 1473696000000];

        this.component.disabledDates = [
            new Date('2018-08-28'),
            '2016-09-13',
            // 'nan'
        ];

        this.fixture.detectChanges();

        expect( this.component.disabledDates ).toEqual( disabledTimes );
    }));
});
