export class DateModel {
    public date: Date;
    public classes: Array<String> = [];
    public clickable: boolean;

    constructor(date: Date, classes: Array<String>, clickable: boolean) {
        this.date = date;
        this.classes = classes;
        this.clickable = clickable;
    }
}
