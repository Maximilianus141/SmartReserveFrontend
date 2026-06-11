import { Component, inject, Signal, signal, WritableSignal } from '@angular/core'; // Added signal & WritableSignal
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ServiceInfo } from '../../dataaccess/service-info';
import { BookingSelectCalender } from '../../components/booking-select-calender/booking-select-calender';
import { ServiceService } from '../../services/service.service';
import { AvailabilityService } from '../../services/availability.service';
import { BookingSelectTime } from '../../components/booking-select-time/booking-select-time';
import { availabilityInfo } from '../../dataaccess/availability';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-booking-select',
    imports: [BookingSelectCalender, BookingSelectTime, DatePipe],
    templateUrl: './booking-select.html',
    styleUrl: './booking-select.scss',
})
export class BookingSelect {
    private availabilityService = inject(AvailabilityService);
    private route = inject(ActivatedRoute); // Consistent inject pattern instead of constructor

    // 1. Properly initialize as a WritableSignal with a default empty array
    availabilityForSelectedDate: WritableSignal<availabilityInfo[]> = signal([]);

    // 2. Track selected state if needed (or keep as signal)
    selectedDate = signal<Date | null>(null);
    selectedTime = signal<Date | null>(null);

    serviceId: Signal<number>;
    service: ServiceInfo | null = null;

    constructor() {
        // Fetch serviceId parameter reactively
        this.serviceId = toSignal(
            this.route.paramMap.pipe(
                map((params) => {
                    const id = params.get('serviceId');
                    return id ? parseInt(id) : -1;
                }),
            ),
            { initialValue: -1 },
        );
    }

    // 3. Capture the output event emitted from BookingSelectTime
    onTimeConfirmed(time: Date) {
        this.selectedTime.set(time);
        console.log('User selected time:', time);
        // Add your redirect logic or booking submission logic here
    }

    // 4. Fetch availability data when a date is picked
    dateSelected(date: Date) {
        this.selectedDate.set(date);

        // Standard ISO date extraction (YYYY-MM-DD)
        const formattedDate = date.toISOString().split('T')[0];

        this.availabilityService
            .getAvailability(formattedDate)
            .subscribe((availability) => {
                // Use .set() to completely replace the array value in the signal
				console.log("RAW BACKEND DATA:", availability); // <-- Check the console!
                this.availabilityForSelectedDate.set(availability);
            });
    }
}