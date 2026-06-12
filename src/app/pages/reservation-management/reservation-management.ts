import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../auth/keycloak.service';
import { ReservationService } from '../../services/reservation.service';
import { ServiceService } from '../../services/service.service';
import { AdminReservationRequestDTO, Reservation } from '../../dataaccess/reservation';
import { ServiceInfo } from '../../dataaccess/service-info';

@Component({
	selector: 'app-reservation-list',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './reservation-management.html',
	styleUrl: './reservation-management.scss',
})
export class ReservationManagement implements OnInit {
	private keycloakService = inject(KeycloakService);
	private reservationService = inject(ReservationService);
	private serviceService = inject(ServiceService);
	private fb = inject(FormBuilder);

	// Signals for state
	reservations = signal<any[]>([]);
	availableServices = signal<ServiceInfo[]>([]);
	isAdmin = signal<boolean>(false);
	editingReservationId = signal<number | null>(null);

	// Form Group
	reservationForm: FormGroup = this.fb.group({
		id: [null],
		status: ['', Validators.required],
		startTime: ['', Validators.required],
		endTime: ['', Validators.required],
		service: this.fb.group({
			id: [null, Validators.required],
			name: [''],
			description: [''],
			durationSeconds: [0],
			afterServiceBreakDurationSeconds: [0],
			wholeDurationSeconds: [0],
		}),
	});

	ngOnInit(): void {
		this.isAdmin.set(this.keycloakService.hasRole('ROLE_admin'));
		this.loadExistingServices();
		this.loadReservations();

		// Listen to changes on the service ID dropdown selection
		this.trackServiceSelection();
	}

	loadExistingServices(): void {
		this.serviceService.getMaterials().subscribe({
			next: (services) => {
				this.availableServices.set(services);
			},
			error: (err) => console.error('Failed to load services', err),
		});
	}

	loadReservations(): void {
		if (this.isAdmin()) {
			this.reservationService.getAllReservations().subscribe({
				next: (resList) => {
					this.reservations.set(resList);
				},
				error: (err) => console.error('Failed to load all reservations', err),
			});
		} else {
			this.reservationService.getMyReservations().subscribe({
				next: (resList) => {
					this.reservations.set(resList);
				},
				error: (err) => console.error('Failed to load my reservations', err),
			});
		}
	}

	private trackServiceSelection(): void {
		// Automatically swap the whole service payload when the admin picks a different service ID
		this.reservationForm.get('service.id')?.valueChanges.subscribe((selectedId) => {
			const matchedService = this.availableServices().find((s) => s.id === Number(selectedId));
			if (matchedService) {
				this.reservationForm.get('service')?.patchValue(matchedService, { emitEvent: false });
			}
		});
	}

	startEdit(reservation: any): void {
		this.editingReservationId.set(reservation.id);

		if (reservation.user) {
			if (!this.reservationForm.contains('user')) {
				this.reservationForm.addControl(
					'user',
					this.fb.group({
						id: [''],
						username: ['', Validators.required],
						email: ['', [Validators.required, Validators.email]],
					}),
				);
			}
		} else {
			if (this.reservationForm.contains('user')) {
				this.reservationForm.removeControl('user');
			}
		}

		this.reservationForm.patchValue(reservation);
	}

	cancelEdit(): void {
		this.editingReservationId.set(null);
		this.reservationForm.reset();
	}

	saveReservation(): void {
		if (this.reservationForm.invalid || !this.isAdmin()) return;

		const formValues = this.reservationForm.value;

		const payload: AdminReservationRequestDTO = {
			userId: formValues.user?.id || '',
			serviceId: Number(formValues.service.id),
			status: formValues.status,
			startTime: new Date(formValues.startTime).toISOString(),
		};

		const id = formValues.id;

		this.reservationService.putReservation(id, payload).subscribe({
			next: (updatedRes) => {
				this.reservations.update((list) => list.map((res) => (res.id === id ? updatedRes : res)));
				this.editingReservationId.set(null);
			},
			error: (err) => console.error('Failed to update reservation', err),
		});
	}

	deleteReservation(id: number): void {
		if (this.isAdmin()) {
			if (!confirm('Are you sure you want to delete this reservation?')) return;
			this.reservationService.deleteReservation(id).subscribe({
				next: () => {
					this.reservations.update((list) => list.filter((res) => res.id !== id));
				},
				error: (err) => console.error('Failed to delete reservation', err),
			});
		} else {
			if (!confirm('Are you sure you want to cancel your reservation?')) return;
			this.reservationService.cancelMyReservation(id).subscribe({
				next: () => {
					// Toggle local status representation to CANCELLED
					this.reservations.update((list) =>
						list.map((res) => (res.id === id ? { ...res, status: 'CANCELLED' } : res)),
					);
				},
				error: (err) => console.error('Failed to cancel reservation', err),
			});
		}
	}
}
