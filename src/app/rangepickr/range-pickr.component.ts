import { Component, Output, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-range-pickr',
    styleUrls: ['./range-pickr.component.css'],
    templateUrl: './range-pickr.component.html'
})
export class RangePickrComponent implements OnInit {

    @Input() disabledDates: Array<any>;

    constructor() {
        console.log(this.disabledDates);
    }

    ngOnInit() {
        console.log(this.disabledDates);
    }

}
