import { Component, inject, Signal, signal, WritableSignal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ServiceInfo } from '../../dataaccess/service-info';
import { BookingSelectCalender } from '../../components/booking-select-calender/booking-select-calender';
import { ServiceService } from '../../services/service.service';
import { ReservationService } from '../../services/reservation.service';
import { AvailabilityService } from '../../services/availability.service';
import { BookingSelectTime } from '../../components/booking-select-time/booking-select-time';
import { availabilityInfo } from '../../dataaccess/availability';
import { GuestReservationRequestDTO } from '../../dataaccess/reservation';
import { DatePipe } from '@angular/common';
import { KeycloakService } from '../../auth/keycloak.service';

@Component({
	selector: 'app-booking-select',
	imports: [BookingSelectCalender, BookingSelectTime, DatePipe],
	templateUrl: './booking-select.html',
	styleUrl: './booking-select.scss',
})
export class BookingSelect {
	private availabilityService = inject(AvailabilityService);
	private serviceService = inject(ServiceService);
	private reservationService = inject(ReservationService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	protected keycloakService = inject(KeycloakService);

	// 1. Properly initialize as a WritableSignal with a default empty array
	availabilityForSelectedDate: WritableSignal<availabilityInfo[]> = signal([]);

	// 2. Track selected state
	selectedDate = signal<Date | null>(null);
	selectedTime = signal<Date | null>(null);

	serviceId: Signal<number>;
	service = signal<ServiceInfo | null>(null);

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

		// Load service details reactively based on serviceId signal changes
		effect(() => {
			const id = this.serviceId();
			if (id && id > 0) {
				this.serviceService.getServiceById(id).subscribe({
					next: (srv) => {
						this.service.set(srv);
					},
					error: (err) => console.error('Failed to load service', err),
				});
			}
		});
	}

	// 3. Capture the output event emitted from BookingSelectTime
	onTimeConfirmed(time: Date) {
		this.selectedTime.set(time);
		console.log('User selected time:', time);
	}

	// 4. Fetch availability data when a date is picked
	dateSelected(date: Date) {
		this.selectedDate.set(date);
		// Reset previously selected slot when the date changes
		this.selectedTime.set(null);

		// Safe extraction of local date components to prevent timezone shifting (midnight bug)
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const formattedDate = `${year}-${month}-${day}`;

		this.availabilityService.getAvailability(formattedDate).subscribe((availability) => {
			console.log('RAW BACKEND DATA:', availability);
			this.availabilityForSelectedDate.set(availability);
		});
	}

	// 5. Submit the booking request
	confirmBooking() {
		const slot = this.selectedTime();
		const srvId = this.serviceId();

		if (!slot || srvId === -1) {
			return;
		}

		if (!this.keycloakService.isLoggedIn) {
			alert('Please login first to book a service!');
			this.keycloakService.login({
				redirectUri: window.location.href,
			});
			return;
		}

		// Format the local selected slot Date to a standard ISO string with the local timezone offset
		const pad = (num: number) => String(num).padStart(2, '0');
		const tzo = -slot.getTimezoneOffset();
		const dif = tzo >= 0 ? '+' : '-';
		const formattedDate = 
			slot.getFullYear() +
			'-' + pad(slot.getMonth() + 1) +
			'-' + pad(slot.getDate()) +
			'T' + pad(slot.getHours()) +
			':' + pad(slot.getMinutes()) +
			':' + pad(slot.getSeconds()) +
			dif + pad(Math.floor(Math.abs(tzo) / 60)) +
			':' + pad(Math.abs(tzo) % 60);

		// Ensure we convert the local selected slot Date to an ISO string
		const requestPayload: GuestReservationRequestDTO = {
			serviceId: srvId,
			startTime: formattedDate,
		};

		this.reservationService.postMyReservation(requestPayload).subscribe({
			next: (response) => {
				alert(`Booking confirmed successfully! \nReservation ID: #${response.id}`);
				this.router.navigate(['/reservations']);
			},
			error: (err) => {
				console.error('Failed to book reservation', err);
				alert('Oh no! Something went wrong while saving your reservation. Please try again.');
			},
		});
	}
}
