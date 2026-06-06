import { Component, input, output } from '@angular/core';

@Component({
	selector: 'app-calender-date',
	imports: [],
	templateUrl: './calender-date.html',
	styleUrl: './calender-date.css',
})
export class CalenderDate {
	isEmpty = input<boolean>();
	date = input<number>();

	clicked = output<number>();
}
