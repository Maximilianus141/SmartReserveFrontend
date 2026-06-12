import { Component, input, computed, signal, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { availabilityInfo } from '../../dataaccess/availability';

@Component({
	selector: 'app-booking-select-time',
	imports: [DatePipe],
	templateUrl: './booking-select-time.html',
	styleUrl: './booking-select-time.scss',
})
export class BookingSelectTime {
	// 1. Inputs and Outputs
	availability = input<availabilityInfo[]>([]);
	timeSelected = output<Date>();
	selectedTime = signal<Date | null>(null);

	// 2. Pure hourly pool definitions
	private baseHours = [8, 9, 10, 11, 14, 15, 16, 17, 18];

	availableSlots = computed<Date[]>(() => {
		const ranges = this.availability();
		if (!ranges || ranges.length === 0) return [];

		const slots: Date[] = [];

		ranges.forEach((range) => {
			const start = new Date(range.startTime);
			const end = new Date(range.endTime);

			// FIX: Extract date components using UTC to prevent midnight timezone shifting
			const currentDate = new Date(
				Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
			);
			const lastDate = new Date(
				Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()),
			);

			while (currentDate <= lastDate) {
				this.baseHours.forEach((hour) => {
					// Create the slot using the exact UTC day
					const slotDate = new Date(currentDate);
					slotDate.setHours(hour, 0, 0, 0);

					if (slotDate >= start && slotDate <= end) {
						slots.push(slotDate);
					}
				});

				// Move to the next UTC day safely
				currentDate.setUTCDate(currentDate.getUTCDate() + 1);
			}
		});

		return slots.sort((a, b) => a.getTime() - b.getTime());
	});

	// 4. Method to handle user selection
	selectTime(slot: Date): void {
		this.selectedTime.set(slot);
		this.timeSelected.emit(slot);
	}
}
