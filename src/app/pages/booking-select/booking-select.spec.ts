import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BookingSelect } from './booking-select';
import { AvailabilityService } from '../../services/availability.service';
import { ServiceService } from '../../services/service.service';
import { ReservationService } from '../../services/reservation.service';
import { KeycloakService } from '../../auth/keycloak.service';
import { of } from 'rxjs';

describe('BookingSelect', () => {
	let component: BookingSelect;
	let fixture: ComponentFixture<BookingSelect>;

	let mockAvailabilityService: Partial<AvailabilityService>;
	let mockServiceService: Partial<ServiceService>;
	let mockReservationService: Partial<ReservationService>;
	let mockKeycloakService: Partial<KeycloakService>;

	beforeEach(async () => {
		mockAvailabilityService = {
			getAvailability: () => of([]),
		};

		mockServiceService = {
			getServiceById: () =>
				of({
					id: 1,
					name: 'Test Service',
					description: 'Test Service Description',
					durationSeconds: 1800,
					afterServiceBreakDurationSeconds: 300,
				}),
		};

		mockReservationService = {
			postMyReservation: () =>
				of({
					id: 123,
					service: {
						id: 1,
						name: 'Test Service',
						description: 'Test Service Description',
						durationSeconds: 1800,
						afterServiceBreakDurationSeconds: 300,
					},
					status: 'PENDING',
					startTime: new Date().toISOString(),
					endTime: new Date().toISOString(),
				}),
		};

		mockKeycloakService = {
			isLoggedIn: true,
			username: 'test-user',
			login: () => Promise.resolve(),
			logout: () => Promise.resolve(),
		};

		await TestBed.configureTestingModule({
			imports: [BookingSelect],
			providers: [
				provideRouter([]),
				{ provide: AvailabilityService, useValue: mockAvailabilityService },
				{ provide: ServiceService, useValue: mockServiceService },
				{ provide: ReservationService, useValue: mockReservationService },
				{ provide: KeycloakService, useValue: mockKeycloakService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(BookingSelect);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
