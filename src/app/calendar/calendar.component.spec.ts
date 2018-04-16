import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { DatePipe } from '@angular/common';

describe('CalendarComponent Tests', () => {

    let calendar;
    let component;
    let fixture: TestBed;
    let dp = new DatePipe('en');

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

    it('should initialize default variables', async( () => {
        
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

})
