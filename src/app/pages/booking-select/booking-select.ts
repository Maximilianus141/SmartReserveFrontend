import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ServiceInfo } from '../../dataaccess/service-info';
import { BookingSelectCalender } from '../../components/booking-select-calender/booking-select-calender';

@Component({
	selector: 'app-booking-select',
	imports: [BookingSelectCalender],
	templateUrl: './booking-select.html',
	styleUrl: './booking-select.css',
})
export class BookingSelect {
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

	dateSelected() {
		
	}
}
