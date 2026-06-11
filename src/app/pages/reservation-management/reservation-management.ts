import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeycloakService } from '../../auth/keycloak.service';

export interface ServicePayload {
  id: number;
  name: string;
  description: string;
  durationSeconds: number;
  afterServiceBreakDurationSeconds: number;
  wholeDurationSeconds: number;
}

export interface Reservation {
  id: number;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  service: ServicePayload;
  status: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reservation-management.html',
})
export class ReservationManagement implements OnInit {
  private keycloakService = inject(KeycloakService);
  private fb = inject(FormBuilder);

  // Signals for state
  reservations = signal<Reservation[]>([]);
  availableServices = signal<ServicePayload[]>([]); // Your pre-existing services
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
      wholeDurationSeconds: [0]
    })
  });

  ngOnInit(): void {
    this.isAdmin.set(this.keycloakService.hasRole('ROLE_admin'));
    this.loadExistingServices();
    this.loadReservations();

    // Listen to changes on the service ID dropdown selection
    this.trackServiceSelection();
  }

  loadExistingServices(): void {
    // Populate this from your actual pre-existing service/API
    this.availableServices.set([
      { id: 1, name: 'Haircut', description: 'Standard cut', durationSeconds: 1800, afterServiceBreakDurationSeconds: 300, wholeDurationSeconds: 2100 },
      { id: 2, name: 'Massage', description: 'Full body Swedish massage', durationSeconds: 3600, afterServiceBreakDurationSeconds: 600, wholeDurationSeconds: 4200 },
      { id: 3, name: 'Beard Trim', description: 'Trimming and shaping', durationSeconds: 900, afterServiceBreakDurationSeconds: 150, wholeDurationSeconds: 1050 }
    ]);
  }

  loadReservations(): void {
    this.reservations.set([
      {
        id: 101,
        user: { id: "u1", username: "john_doe", email: "john@example.com" },
        service: { id: 1, name: "Haircut", description: "Standard cut", durationSeconds: 1800, afterServiceBreakDurationSeconds: 300, wholeDurationSeconds: 2100 },
        status: "PENDING",
        startTime: "2026-06-11T08:50:37.548Z",
        endTime: "2026-06-11T09:25:37.548Z"
      }
    ]);
  }

  private trackServiceSelection(): void {
    // Automatically swap the whole service payload when the admin picks a different service ID
    this.reservationForm.get('service.id')?.valueChanges.subscribe((selectedId) => {
      const matchedService = this.availableServices().find(s => s.id === Number(selectedId));
      if (matchedService) {
        this.reservationForm.get('service')?.patchValue(matchedService, { emitEvent: false });
      }
    });
  }

  startEdit(reservation: Reservation): void {
    this.editingReservationId.set(reservation.id);

    if (reservation.user) {
      if (!this.reservationForm.contains('user')) {
        this.reservationForm.addControl('user', this.fb.group({
          id: [''],
          username: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        }));
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

    const updatedData: Reservation = this.reservationForm.value;

    this.reservations.update(currentList =>
      currentList.map(res => res.id === updatedData.id ? { ...res, ...updatedData } : res)
    );

    this.editingReservationId.set(null);
  }
}