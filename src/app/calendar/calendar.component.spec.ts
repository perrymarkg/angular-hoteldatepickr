import { TestBed, async } from '@angular/core/testing';
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
    }))

})
