import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ServiceInfo } from '../../dataaccess/service-info';
import { BookingSelectCalender } from '../../components/booking-select-calender/booking-select-calender';
import { ServiceService } from '../../services/service.service';
import { AvailabilityService } from '../../services/availability.service';

@Component({
	selector: 'app-booking-select',
	imports: [BookingSelectCalender],
	templateUrl: './booking-select.html',
	styleUrl: './booking-select.scss',
})
export class BookingSelect {
	availabilityService = inject(AvailabilityService);



	selectedDate: Date | null = null;

	serviceId: Signal<number>;
	service: ServiceInfo | null = null;

	constructor(private route: ActivatedRoute) {
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

	dateSelected(date: Date) {
		this.availabilityService.getAvailability(date.toISOString().split('T')[0]).subscribe((availability) => {
			console.log('Verfügbarkeiten für den ausgewählten Tag:', availability);
		});
	}
}
