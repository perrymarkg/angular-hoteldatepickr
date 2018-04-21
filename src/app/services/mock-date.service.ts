import { DateService } from "./date.service";

export class MockDateService extends DateService {
    
    mockToday: Date;

    setToday( date: Date ) {
        this.mockToday = this.createDate(date);
    }

    today() {
        if( !this.mockToday ) {
            this.mockToday = this.createDate('2018-08-28');
        }
        return this.mockToday;
    }
}