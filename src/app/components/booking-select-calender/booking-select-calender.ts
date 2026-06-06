import { Component } from '@angular/core';

@Component({
	selector: 'app-booking-select-calender',
	imports: [],
	templateUrl: './booking-select-calender.html',
	styleUrl: './booking-select-calender.css',
})
export class BookingSelectCalender {
	selectedDate: Date | null = null;
	curerntlySelectedMonth: number = new Date().getMonth();
	currentlySelectedYear: number = new Date().getFullYear();
}
