import { Component, output } from '@angular/core';
import { CalenderDate } from "../calender-date/calender-date";

@Component({
	selector: 'app-booking-select-calender',
	imports: [CalenderDate],
	templateUrl: './booking-select-calender.html',
	styleUrl: './booking-select-calender.css',
})
export class BookingSelectCalender {

	selectedDate: Date | null = null;
	outputDate =  output<Date>();

	curerntlySelectedMonth: number = new Date().getMonth();
	currentlySelectedYear: number = new Date().getFullYear();
	months: string[] = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];


	dates: number[] = new Array(35).fill(0);

	dateClicked($event: number) {
		this.selectedDate = new Date(this.currentlySelectedYear, this.curerntlySelectedMonth, $event);
		this.outputDate.emit(this.selectedDate);
	}

	resetDates() {
		this.dates.fill(0);
	}

	nextMonth() {
		if (this.curerntlySelectedMonth === 11) {
			this.curerntlySelectedMonth = 0;
			this.currentlySelectedYear++;
		} else {
			this.curerntlySelectedMonth++;
		}
		this.setDates();
	}

	prevMonth() {
		if (this.curerntlySelectedMonth === 0) {
			this.curerntlySelectedMonth = 11;
			this.currentlySelectedYear--;
		} else {
			this.curerntlySelectedMonth--;
		}
		this.setDates();
	}

	ngOnInit() {
		this.setDates();
	}

	setDates() {
		this.resetDates();
		const now = new Date(this.currentlySelectedYear, this.curerntlySelectedMonth, 1);
		let today = now.getDay() - 1;
		if (today < 0) {
			today = 6;
		}		

		const daysInMonth = new Date(this.currentlySelectedYear, this.curerntlySelectedMonth + 1, 0).getDate();

		for (let i = 0; i < daysInMonth; i++) {
			this.dates[today + i] = i + 1;
		}
	}



}
