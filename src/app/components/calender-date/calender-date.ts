import { Component, input, output } from '@angular/core';

@Component({
	selector: 'app-calender-date',
	imports: [],
	templateUrl: './calender-date.html',
	styleUrl: './calender-date.scss',
})
export class CalenderDate {
	isEmpty = input<boolean>();
	date = input<number>();

	clicked = output<number>();
}
