import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { DateService } from '../services/date.service';
import { MockDateService } from '../services/mock-date.service';

describe('CalendarComponent Default Tests', () => {

    let component = null;
    let fixture: ComponentFixture<CalendarComponent>;
    let ds: DateService;

    beforeEach( async( () => {
        TestBed.configureTestingModule({
            declarations: [
                CalendarComponent,
                CalendarDayComponent
            ],
            providers: [
                {provide: DateService, useClass: MockDateService}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarComponent);
        component = fixture.debugElement.componentInstance;
        ds = new DateService();
    }) );

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));

    it('should get days in months', async(() => {
        fixture.detectChanges();
        // Get days in september 2018
        const days = component.getDaysInMonth(9, 2018);
        expect(days).toBe(30);
    }));
    
    it('should set months', async( () => {
        // Default date from mockservice aug 28 2018
        
        fixture.detectChanges();

        expect( component.daysInMonth ).toBe( 31 );
        expect( component.prevMonthLastDay ).toBe( 31 );
        expect( component.prevMonthStartDay ).toBe( 29 );

    }));

    it('should set months when date is passed', async( () => {
        
        const dateStr = "2018-06-13";
        const dateObj = ds.createDate(dateStr);

        component.date = dateObj;
        
        fixture.detectChanges();

        expect( component.daysInMonth ).toBe( 30 );
        expect( component.prevMonthLastDay ).toBe( 31 );
        expect( component.prevMonthStartDay ).toBe( 27 );

    }));

    it('should create date model', async( () => {
        let model;
        const selectedDate = ds.createDate('2018-08-28');
        const d1 = ds.createDate('2018-07-29');
        const d2 = ds.createDate('2018-08-28');
        const d3 = ds.createDate('2018-08-15');

        component.date = ds.createDate(selectedDate);

        fixture.detectChanges();
        model = component.createDateModel(2018, 7, 3, 0);
        expect( model.date.getTime() ).toBe( d1.getTime() );
        model = component.createDateModel(2018, 7, 3, 30);
        expect( model.date.getTime() ).toBe( d2.getTime() );
        model = component.createDateModel(2018, 7, 3, 17);
        expect( model.date.getTime() ).toBe( d3.getTime() );

    }));

    it('should set days', async( () => {
        const date = ds.createDate('2018-08-28');
        
        component.date = date;

        fixture.detectChanges();
        expect( component.selectedDate.getTime() ).toBe( date.getTime() );
        date.setDate(1); // Aug 01 2018
        expect( component.days[3].date.getTime() ).toBe( date.getTime() );
        date.setDate(-2); // Jul 29 2018
        expect( component.days[0].date.getTime() ).toBe( date.getTime() );
    }));

    it('should initialize disabled dates', async( () => {
        const disabledTimes = [1535385600000, 1473696000000, 1561651200000];
        component.disabledDates = [
            ds.createDate('2018-08-28'),
            new Date('2016-09-13'),
            '2019-06-28'
        ];

        fixture.detectChanges();

        expect( component.disabledDates ).toEqual( disabledTimes );
    }));

    
});
