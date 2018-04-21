import { async } from '@angular/core/testing';
import { DateService } from "./date.service";
import { MockDateService } from './mock-date.service';

describe('DateService Tests', () => {
    let ds: DateService;

    beforeEach( async( () => {
        ds = new DateService();
    }));

    it('should get date today', ()=>{
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expect( ds.today().getTime() ).toBe( today.getTime() );
    });

    it('should validate date object', async( () => {
        const date = new Date('2015-04-15');
        
        expect( ds.isValidDateObj(date) ).toBe(true);
        expect( ds.isValidDateObj('any') ).toBe(false);
    }));

    it('should create date', async( () => {
        const dateStr = "2018-08-28";
        const dateObj = new Date(dateStr);
        dateObj.setHours(0, 0, 0, 0);

        const testDateStr = ds.createDate(dateStr);
        const testDateObj = ds.createDate(dateObj);

        expect( testDateStr.getTime() ).toBe( dateObj.getTime() );
        expect( testDateObj.getTime() ).toBe( dateObj.getTime() );

    }));
    
});

describe('mock date tests', () => {

    let mds: MockDateService;

    beforeEach( async( () => {
        mds = new MockDateService();
        mds.setToday( new Date('2018-08-23') );
    }));

    it('should mock today', async( () => {
        expect( mds.today().getTime() ).toBe( 1534953600000 ) ;
    }))

});