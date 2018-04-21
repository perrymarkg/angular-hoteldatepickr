export class DateService {

    today(){
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }

    isValidDateObj( date: any) {
        return Object.prototype.toString.call(date) === '[object Date]';
    }

    createDate( date: any ) {
        let result;
        if( typeof date === 'string') {
            result = new Date(date);
        } else if ( this.isValidDateObj(date) ) {
            result = new Date( date.getTime() )
        } else {
            throw new Error('Invalid date created');
        }
        result.setHours(0, 0, 0, 0);
        return result;
    }
}