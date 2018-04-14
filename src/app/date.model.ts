export class DateModel {
    public date: Date;
    public classes: Array<String> = [];
    public clickable: boolean;
    public index: number;

    constructor(date: Date, classes: Array<String>, clickable: boolean, index: number) {
        this.date = date;
        this.classes = classes;
        this.clickable = clickable;
        this.index = index;
    }
}
