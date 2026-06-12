import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationManagement } from './reservation-management';
import { KeycloakService } from '../../auth/keycloak.service';
import { ReservationService } from '../../services/reservation.service';
import { ServiceService } from '../../services/service.service';
import { of } from 'rxjs';

describe('ReservationManagement', () => {
	let component: ReservationManagement;
	let fixture: ComponentFixture<ReservationManagement>;
	let mockKeycloakService: Partial<KeycloakService>;
	let mockReservationService: Partial<ReservationService>;
	let mockServiceService: Partial<ServiceService>;

	beforeEach(async () => {
		mockKeycloakService = {
			hasRole: () => false,
		};

		mockReservationService = {
			getAllReservations: () => of([]),
			getMyReservations: () => of([]),
		};

		mockServiceService = {
			getMaterials: () => of([]),
		};

		await TestBed.configureTestingModule({
			imports: [ReservationManagement],
			providers: [
				{ provide: KeycloakService, useValue: mockKeycloakService },
				{ provide: ReservationService, useValue: mockReservationService },
				{ provide: ServiceService, useValue: mockServiceService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ReservationManagement);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
